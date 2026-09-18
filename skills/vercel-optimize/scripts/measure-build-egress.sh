#!/usr/bin/env bash
#
# Measure how many bytes a production build pulls OUT of the database.
#
# Managed Postgres (Neon, Supabase, RDS) meters egress — bytes the database
# sends back to whoever asked. A `next build` that prerenders hundreds of paths
# can move hundreds of megabytes per deploy without anyone noticing, because
# nothing in the build log mentions it and the bill arrives as a refused
# connection weeks later.
#
# The measurement is the container's own network counter, diffed across a
# build. That is the same quantity the provider bills: bytes transmitted by the
# database process. No instrumentation, no sampling, no guessing.
#
# Usage:
#   scripts/measure-build-egress.sh                       # defaults below
#   scripts/measure-build-egress.sh --container pg-1 --build-cmd "pnpm build:ci"
#   scripts/measure-build-egress.sh --label "after buildMemo"
#
# Run it twice — once before a change and once after — and compare. A single
# number is only meaningful against a baseline.

set -uo pipefail

CONTAINER="${CONTAINER:-pgplasticsnl-postgres-1}"
BUILD_CMD="${BUILD_CMD:-pnpm run build:ci}"
LABEL=""
LOG_DIR="${TMPDIR:-/tmp}"

while [ $# -gt 0 ]; do
  case "$1" in
    --container) CONTAINER="$2"; shift 2 ;;
    --build-cmd) BUILD_CMD="$2"; shift 2 ;;
    --label)     LABEL="$2"; shift 2 ;;
    --log-dir)   LOG_DIR="$2"; shift 2 ;;
    -h|--help)   sed -n '2,25p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "error: no running container named '$CONTAINER'." >&2
  echo "       running containers:" >&2
  docker ps --format '         {{.Names}}  {{.Ports}}' >&2
  echo "       pass --container <name>, or start the database first." >&2
  exit 1
fi

# Find the container's primary interface. eth0 on default bridge networking,
# but compose networks and IPv6-only setups can name it otherwise, so fall back
# to the first non-loopback interface rather than failing.
IFACE="$(docker exec "$CONTAINER" sh -c \
  'for i in /sys/class/net/*; do n=$(basename "$i"); [ "$n" = lo ] || { echo "$n"; break; }; done' 2>/dev/null)"
if [ -z "$IFACE" ]; then
  echo "error: could not find a network interface inside '$CONTAINER'." >&2
  exit 1
fi

read_tx() {
  docker exec "$CONTAINER" sh -c "cat /sys/class/net/$IFACE/statistics/tx_bytes" 2>/dev/null
}

BEFORE="$(read_tx)"
if [ -z "${BEFORE:-}" ]; then
  echo "error: could not read the TX counter on $IFACE." >&2
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="$LOG_DIR/build-egress-$STAMP.log"

echo "container : $CONTAINER ($IFACE)"
echo "build     : $BUILD_CMD"
[ -n "$LABEL" ] && echo "label     : $LABEL"
echo "log       : $LOG"
echo "measuring — this runs a full production build, please wait…"
echo

# The build's own output goes to a file: it is long, and the number we want is
# not in it. The exit status is kept, because egress measured across a build
# that FAILED is not comparable to one that succeeded — it stopped early.
sh -c "$BUILD_CMD" > "$LOG" 2>&1
BUILD_STATUS=$?

AFTER="$(read_tx)"
DELTA=$(( AFTER - BEFORE ))

printf 'DB egress for this build : %s bytes (%.1f MB)\n' "$DELTA" "$(echo "$DELTA" | awk '{print $1/1048576}')"
printf 'build exit status        : %s\n' "$BUILD_STATUS"

if [ "$BUILD_STATUS" -ne 0 ]; then
  echo
  echo "WARNING: the build failed, so this figure is a partial read and is NOT"
  echo "         comparable to a successful build. Fix the build, then re-measure."
  tail -20 "$LOG"
  exit "$BUILD_STATUS"
fi

echo
echo "To judge it, divide the monthly transfer allowance by this number — that is"
echo "roughly how many deploys the plan affords before the database starts"
echo "refusing connections. Under ~20 MB a build is healthy for a catalogue of"
echo "this size; anything in the hundreds means the catalogue is being re-read"
echo "per prerendered path."
