# Google Business Profile API — access setup

One-time manual steps required before the `gbp-post` skill can post anything.

## 1. Request API access (gated by Google approval)

The Business Profile API is allowlist-only. Submit the access request form:

- Form: https://support.google.com/business/contact/api_default
- Review time: 7–10 business days

**Current status (as of 2026-04-04):** submitted, case ID `7-9693000040828`. Expected approval window **2026-04-15 to 2026-04-20**.

Until approved, every API call returns `403 PERMISSION_DENIED`. The OAuth flow itself will work pre-approval; only the account/location/post endpoints are gated.

## 2. Enable the APIs in Google Cloud

Once Google approves the allowlist, these eight APIs become visible in your Cloud project. Enable all of them:

- Google My Business API
- My Business Account Management API
- My Business Business Information API
- My Business Place Actions API
- My Business Notifications API
- My Business Verifications API
- My Business Q&A API
- My Business Lodging API

Only the first three are strictly needed for posting, but enabling all avoids surprises.

## 3. Create OAuth 2.0 Desktop credentials

In Google Cloud Console → APIs & Services → Credentials:

1. Click **Create Credentials** → **OAuth client ID**
2. Application type: **Desktop app**
3. Name: `gbp-post skill`
4. Click **Create**, then **Download JSON**
5. Save the downloaded file to:
   ```
   C:\Users\friso\AppData\Roaming\gbp-post\credentials.json
   ```
   (create the `gbp-post` folder if it doesn't exist)

## 4. Configure the OAuth consent screen

If you haven't already configured the consent screen for this Cloud project:

- User type: **External** (unless you have a Google Workspace)
- App name: anything recognizable
- Scopes: add `https://www.googleapis.com/auth/business.manage`
- Test users: add the Google account that **owns the Uridan business profile** (otherwise the OAuth flow will reject it)
- Publishing status: **Testing** is fine — the app never needs to go through Google's verification process for personal use

## 5. Run setup.py

```bash
python "C:\Claude Code Projects\Agentic Skills\plugins\gbp-post-plugin\skills\gbp-post\scripts\setup.py"
```

This opens a browser, prompts you to sign in with the Google account that owns Uridan, saves the refresh token to `%APPDATA%\gbp-post\token.json`, and writes the picked account/location to `%APPDATA%\gbp-post\config.json`.

## 6. Post

```bash
python "...\scripts\post.py" "Check out our latest waterless urinal install" "https://uridan.com/img/install.jpg"
```

Or, via Claude Code:

```
/gbp-post "Check out our latest waterless urinal install" https://uridan.com/img/install.jpg
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `403 PERMISSION_DENIED` on account list | API access request not yet approved | Wait for case `7-9693000040828` to be approved |
| `access_denied` in browser | OAuth consent screen doesn't list this user as a test user | Add the Google account to test users in consent screen config |
| `invalid_grant` when refreshing | Refresh token revoked or expired (Google expires unused tokens after 6 months) | Delete `token.json` and re-run `setup.py` |
| `No accounts returned` | Signed-in Google account doesn't own/manage any Business Profile | Sign out and re-run with the owner account |
| `400 INVALID_ARGUMENT` on post | Malformed body — often a non-HTTPS image URL or too-long summary | Check image URL is `https://` and publicly accessible; keep summary under 1500 chars |
