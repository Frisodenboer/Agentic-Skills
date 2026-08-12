"""One-time setup for the gbp-post skill.

Walks the user through:
  1. OAuth 2.0 authorization (opens browser, stores refresh token)
  2. Listing their Google Business Profile accounts
  3. Listing locations under a chosen account
  4. Saving the chosen account/location IDs to config.json

Prerequisites:
  - credentials.json downloaded from Google Cloud Console (OAuth 2.0 Desktop app client)
    placed at %APPDATA%\\gbp-post\\credentials.json
  - Google Business Profile API access approved (case 7-9693000040828)

Run: python setup.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import requests
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/business.manage"]

ACCOUNTS_URL = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts"
LOCATIONS_URL_TMPL = (
    "https://mybusinessbusinessinformation.googleapis.com/v1/{account}/locations"
    "?readMask=name,title,storefrontAddress"
)


def config_dir() -> Path:
    """Return the per-user config dir for this skill, creating it if needed."""
    base = os.environ.get("APPDATA") or str(Path.home() / ".config")
    path = Path(base) / "gbp-post"
    path.mkdir(parents=True, exist_ok=True)
    return path


def run_oauth_flow(cfg_dir: Path) -> Credentials:
    """Load existing token.json or kick off an interactive OAuth flow."""
    token_file = cfg_dir / "token.json"
    creds_file = cfg_dir / "credentials.json"

    if not creds_file.exists():
        sys.stderr.write(
            f"ERROR: credentials.json not found at {creds_file}\n"
            "Download OAuth 2.0 Desktop app credentials from Google Cloud Console\n"
            "and save them to that path. See references/api-access.md for details.\n"
        )
        sys.exit(1)

    creds: Credentials | None = None
    if token_file.exists():
        creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing existing access token...")
            creds.refresh(Request())
        else:
            print("Opening browser for authorization...")
            flow = InstalledAppFlow.from_client_secrets_file(str(creds_file), SCOPES)
            creds = flow.run_local_server(port=0)

        token_file.write_text(creds.to_json(), encoding="utf-8")
        print(f"Saved token to {token_file}")

    return creds


def list_accounts(access_token: str) -> list[dict]:
    r = requests.get(
        ACCOUNTS_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=30,
    )
    r.raise_for_status()
    return r.json().get("accounts", [])


def list_locations(access_token: str, account_name: str) -> list[dict]:
    url = LOCATIONS_URL_TMPL.format(account=account_name)
    r = requests.get(
        url,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=30,
    )
    r.raise_for_status()
    return r.json().get("locations", [])


def pick(items: list[dict], label_fn) -> dict:
    for i, item in enumerate(items, start=1):
        print(f"  [{i}] {label_fn(item)}")
    while True:
        choice = input("Enter number: ").strip()
        if choice.isdigit() and 1 <= int(choice) <= len(items):
            return items[int(choice) - 1]
        print("Invalid choice, try again.")


def main() -> int:
    cfg_dir = config_dir()
    print(f"Config dir: {cfg_dir}")

    creds = run_oauth_flow(cfg_dir)
    token = creds.token

    print("\nFetching Google Business Profile accounts...")
    try:
        accounts = list_accounts(token)
    except requests.HTTPError as e:
        sys.stderr.write(
            f"\nFailed to list accounts: {e}\n"
            f"Response: {e.response.text if e.response else '(none)'}\n\n"
            "If this is 403 PERMISSION_DENIED, your API access request is likely\n"
            "still pending approval (case 7-9693000040828). Try again after Google\n"
            "approves your allowlist request.\n"
        )
        return 1

    if not accounts:
        sys.stderr.write("No accounts returned. Is this Google account linked to a Business Profile?\n")
        return 1

    print(f"\nFound {len(accounts)} account(s):")
    account = pick(accounts, lambda a: f"{a.get('accountName', '?')}  ({a['name']})")

    print(f"\nFetching locations for {account['name']}...")
    try:
        locations = list_locations(token, account["name"])
    except requests.HTTPError as e:
        sys.stderr.write(
            f"Failed to list locations: {e}\n"
            f"Response: {e.response.text if e.response else '(none)'}\n"
        )
        return 1

    if not locations:
        sys.stderr.write("No locations returned for this account.\n")
        return 1

    print(f"\nFound {len(locations)} location(s):")
    def loc_label(loc: dict) -> str:
        title = loc.get("title", "?")
        addr = loc.get("storefrontAddress", {})
        city = addr.get("locality", "")
        return f"{title} — {city}  ({loc['name']})"

    location = pick(locations, loc_label)

    # The v4 localPosts endpoint wants raw numeric IDs in the path, but v1 APIs
    # return full resource names like "accounts/123/locations/456". Store both.
    config = {
        "account_name": account["name"],           # "accounts/{accountId}"
        "account_title": account.get("accountName", ""),
        "location_name": location["name"],          # "locations/{locationId}"
        "location_title": location.get("title", ""),
    }

    config_file = cfg_dir / "config.json"
    config_file.write_text(json.dumps(config, indent=2), encoding="utf-8")
    print(f"\nSaved config to {config_file}")
    print(f"\nReady to post to: {config['account_title']} / {config['location_title']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
