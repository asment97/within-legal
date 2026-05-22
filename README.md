# WITHIN legal pages

Static HTML hosted on GitHub Pages and linked from the App Store / Play
listing + the in-app Settings → Privacy section. All 4 pages share the
same theme (`styles.css`) and locale-switcher (`i18n.js`) so they read
as one continuous mini-site.

## Files

| File                     | Purpose                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `privacy.html`           | Privacy policy — PDPA-aligned, lists collected data + retention + user rights.                       |
| `terms.html`             | Terms of use — eligibility, content licence, liability, Malaysian governing law.                     |
| `delete-account.html`    | Web account-delete portal — Supabase magic-link sign-in + `delete_my_account()` RPC. Requires JS.    |
| `support.html`           | Support + FAQ (binding, deletion, exports, push notifications, bug reports, Plus timeline).          |
| `styles.css`             | Shared theme. Mirrors WITHIN design tokens (warm cream bg, blue headline, coral accent).             |
| `i18n.js`                | In-page locale switcher (zh-Hans ↔ en). Stores choice in localStorage. Toggles `[lang]` blocks.      |

## Before deploying

`delete-account.html` has two placeholders that **must** be filled before
the page can talk to Supabase:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Replace both with the values from your project's API settings:

- `SUPABASE_URL`: e.g. `https://xxxxxxxxxxxx.supabase.co` (visible in
  the Supabase dashboard → Settings → API → Project URL).
- `SUPABASE_ANON_KEY`: the public `anon` key. Safe to expose — RLS
  enforces auth on every row.

Also, in the Supabase Auth dashboard:

1. Add the deployed URL of this page (e.g.
   `https://your-username.github.io/within-legal/delete-account.html`) to
   the **Redirect URLs** allowlist. The magic-link email won't work
   otherwise.
2. Verify the Email template for "Magic Link" mentions WITHIN so users
   recognise it.

## Deploy steps

1. **Option A — separate `within-legal` repo** (recommended for clean
   URLs):
   ```bash
   # In a fresh checkout of github.com/<you>/within-legal
   cp -r within_mobile/legal/* .
   git add . && git commit -m "Initial WITHIN legal pages"
   git push
   # GitHub → Settings → Pages → Source: main / root → Save
   ```
   Final URLs:
   - `https://<you>.github.io/within-legal/privacy.html`
   - `https://<you>.github.io/within-legal/terms.html`
   - `https://<you>.github.io/within-legal/delete-account.html`
   - `https://<you>.github.io/within-legal/support.html`

2. **Option B — staging under this repo's GH Pages** (faster, if Pages
   isn't yet set up):
   - GitHub → repo Settings → Pages → Source: `main` branch, `/legal`
     folder.
   - URLs end up at `https://<you>.github.io/within_mobile/<page>.html`.

## After deploying

1. **Update Settings → Privacy** in the app to link to the live URLs.
   Currently the Settings sheet renders placeholder URLs — see
   `lib/features/settings/privacy_sheet.dart`.
2. **App Store Connect / Play Console**:
   - Privacy URL → `privacy.html`.
   - Support URL → `support.html`.
   - Account Deletion URL (Apple submission requirement) →
     `delete-account.html`.
3. **Test the magic-link round-trip** with your own email before sharing
   the deployed URL anywhere.

## Future considerations

- **Bahasa Malaysia (BM)** translation skipped for v1 per the PR5
  decision. Add a `lang="ms"` `<section>` block to each page and update
  `i18n.js`'s `SUPPORTED` array when a translator review is done.
- **Custom domain** (e.g. `legal.within.app`): configure DNS + add the
  domain in GitHub Pages settings. Update Supabase Auth Redirect URLs
  if `delete-account.html` moves.
- **Cookie/analytics banner**: not needed — these pages set no
  cookies and run no analytics. The privacy policy explicitly confirms
  this.

## Style + accessibility notes

- `styles.css` defines a `--bg-warm-cream` / `--blue-headline` /
  `--coral` palette mirrored from the in-app tokens, so cross-clicks
  feel continuous.
- Tested at 480px width down to mobile (responsive media query in CSS).
- Locale switcher uses `aria-pressed` for screen readers.
- `lang` attributes on `<section>` + `[data-locale-span]` give
  assistive tech the correct pronunciation per locale.
- No external trackers, no cookies set by these pages themselves
  (the Supabase JS SDK uses localStorage for its session, which is
  cleared on `signOut`).
