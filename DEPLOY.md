# Website preview (GitHub Pages)

The Android app repo is **private**. GitHub Pages only works on **public** repos with a free account.

We publish the site to a separate public repo: **BlokraaiWBoek-website**.

## One-time setup (~5 minutes)

### 1. Create the public website repo

1. Open https://github.com/new
2. Repository name: `BlokraaiWBoek-website`
3. Visibility: **Public**
4. Click **Create repository** (README optional)

### 2. Create a deploy token

1. Open https://github.com/settings/tokens?type=beta (fine-grained token)
2. **Generate new token**
3. Name: `BlokraaiWBoek website deploy`
4. Repository access: **Only select repositories** → choose `BlokraaiWBoek-website`
5. Permissions → **Contents**: Read and write
6. Generate and **copy the token**

### 3. Add the token to the app repo

1. Open https://github.com/piersinne/BlokraaiWBoek/settings/secrets/actions
2. **New repository secret**
3. Name: `WEBSITE_REPO_TOKEN`
4. Value: paste the token → **Add secret**

### 4. Turn on GitHub Pages (public website repo)

1. Open https://github.com/piersinne/BlokraaiWBoek-website/settings/pages
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: **main** → folder **/ (root)** → Save

### 5. Run the deploy

1. Open https://github.com/piersinne/BlokraaiWBoek/actions
2. **Deploy website to GitHub Pages** → **Run workflow**

Wait ~1–2 minutes. Then open:

- Home: https://piersinne.github.io/BlokraaiWBoek-website/
- Leidraad: https://piersinne.github.io/BlokraaiWBoek-website/features/leidraad.html

## Updating text later

Per slide (`01`, `02`, …) in `assets/.../screenshots/`:

| File | Purpose |
|------|---------|
| `NN.png` / `NN-dark.png` | Light and dark screenshots |
| `NN.mp3` | Narration audio |
| `NN.txt` | On-screen copy (website) |
| `talk-NN.txt` | Your recording script — **not** shown on the site |

1. Edit `01.txt`, `02.txt`, etc. (not `talk-01.txt`)
2. Run `sync-text.bat`
3. Commit and push `website/` — the site redeploys automatically
