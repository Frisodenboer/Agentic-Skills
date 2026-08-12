"""Post a STANDARD update to the configured Google Business Profile location.

Usage:
  python post.py "Post summary text" [https://image-url.jpg]

Exits 0 on success and prints the post searchUrl.
Exits non-zero on failure and writes the API error to stderr.

Requires setup.py to have been run first (creates token.json + config.json
in %APPDATA%\\gbp-post\\).
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import requests
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

SCOPES = ["https://www.googleapis.com/auth/business.manage"]

# v4 localPosts endpoint. account_name and location_name are stored in config.json
# as "accounts/{id}" and "locations/{id}" — we assemble the full parent path below.
POST_URL_TMPL = (
    "https://mybusiness.googleapis.com/v4/{account}/{location}/localPosts"
)

MAX_SUMMARY_LEN = 1500


def config_dir() -> Path:
    base = os.environ.get("APPDATA") or str(Path.home() / ".config")
    return Path(base) / "gbp-post"


def load_credentials(cfg_dir: Path) -> Credentials:
    token_file = cfg_dir / "token.json"
    if not token_file.exists():
        sys.stderr.write(
            f"ERROR: {token_file} not found. Run setup.py first.\n"
        )
        sys.exit(2)

    creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            token_file.write_text(creds.to_json(), encoding="utf-8")
        else:
            sys.stderr.write(
                "ERROR: stored credentials are invalid and cannot be refreshed.\n"
                "Re-run setup.py to re-authorize.\n"
            )
            sys.exit(2)
    return creds


def load_config(cfg_dir: Path) -> dict:
    config_file = cfg_dir / "config.json"
    if not config_file.exists():
        sys.stderr.write(
            f"ERROR: {config_file} not found. Run setup.py first.\n"
        )
        sys.exit(2)
    return json.loads(config_file.read_text(encoding="utf-8"))


def build_post_body(summary: str, image_url: str | None) -> dict:
    body: dict = {
        "topicType": "STANDARD",
        "languageCode": "en",
        "summary": summary,
    }
    if image_url:
        body["media"] = [
            {"sourceUrl": image_url, "mediaFormat": "PHOTO"}
        ]
    return body


def main(argv: list[str]) -> int:
    if len(argv) < 2 or not argv[1].strip():
        sys.stderr.write('Usage: post.py "<summary text>" [image-url]\n')
        return 2

    summary = argv[1]
    image_url = argv[2] if len(argv) >= 3 and argv[2].strip() else None

    if len(summary) > MAX_SUMMARY_LEN:
        sys.stderr.write(
            f"ERROR: summary is {len(summary)} chars, max is {MAX_SUMMARY_LEN}.\n"
        )
        return 2

    if image_url and not image_url.startswith("https://"):
        sys.stderr.write(
            "ERROR: image URL must start with https:// and be publicly accessible.\n"
        )
        return 2

    cfg_dir = config_dir()
    creds = load_credentials(cfg_dir)
    config = load_config(cfg_dir)

    url = POST_URL_TMPL.format(
        account=config["account_name"],
        location=config["location_name"],
    )
    body = build_post_body(summary, image_url)

    r = requests.post(
        url,
        headers={
            "Authorization": f"Bearer {creds.token}",
            "Content-Type": "application/json",
        },
        json=body,
        timeout=30,
    )

    if not r.ok:
        sys.stderr.write(
            f"ERROR: POST {url} returned {r.status_code}\n"
            f"Response: {r.text}\n"
        )
        return 1

    result = r.json()
    search_url = result.get("searchUrl", "(no searchUrl in response)")
    print(f"Posted successfully: {search_url}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
