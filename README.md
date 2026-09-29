# frehner.tech

Personal one-page site (static, no build step). Just `index.html`.

## Deploy (Render Static Site)
1. Push this repo to GitHub (e.g. `malaxy25/frehner-tech`).
2. Render -> New -> Static Site -> connect the repo.
   - Build command: *(leave empty)*
   - Publish directory: `.`
3. Settings -> Custom Domains -> add `frehner.tech` (and optionally `www.frehner.tech`).
4. Render shows an **A record IP** for the apex domain. In Namecheap -> Advanced DNS:
   - Type **A Record**, Host **@**, Value **<the IP Render shows>**, TTL Automatic.
   - Optional: Type **CNAME**, Host **www**, Value **<your-site>.onrender.com**.
5. Wait for DNS + TLS. Done.

## Edit
Everything is in `index.html`. Look for the `EDIT:` comments.
