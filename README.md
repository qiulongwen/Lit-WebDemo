# Lit-WebDemo

Vue 3 + Vite + TypeScript demo app with a multi-stage Docker image and GitHub Actions publishing to GitHub Container Registry (GHCR).

## Prerequisites

- Node.js 22+ and npm
- Docker (optional, for local container builds)

## Run locally (npm)

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build    # typecheck + production build → dist/
npm run preview  # serve the production build locally
```

## Build and run with Docker locally

```bash
docker build -t lit-webdemo:local .
docker run --rm -p 8080:80 lit-webdemo:local
```

Then open [http://localhost:8080](http://localhost:8080).

## CI: publish image to GHCR

Workflow: [`.github/workflows/docker-publish.yml`](.github/workflows/docker-publish.yml)

| Event | Behavior |
| --- | --- |
| Pull request targeting `main` | Builds the image (does **not** push) |
| Push to `main` | Builds and pushes tags including `latest` and `sha-<shortsha>` |
| Push of tag `v*` (e.g. `v1.0.0`) | Builds and pushes semver tags |

### Image name and tags

```text
ghcr.io/qiulongwen/lit-webdemo:<tag>
```

Repository names are lowercased for GHCR. Common tags:

- `latest` — latest build from the default branch (`main`)
- `sha-<shortsha>` — commit SHA tag on every push to `main`
- `1.0.0`, `1.0` — from annotated/semver tags like `v1.0.0`

### Secrets and permissions

- **No extra secrets required.** The workflow authenticates to GHCR with the built-in `GITHUB_TOKEN`.
- Workflow permissions: `contents: read`, `packages: write`.
- Ensure the repo (or org) allows Actions to create packages. In GitHub: **Settings → Actions → General → Workflow permissions** — “Read and write permissions” (or grant `packages: write` via the workflow as done here).

### Package visibility

By default, packages under a private repo inherit visibility. For a public image from a public repo, after the first publish you may need to set the package to **Public** under:

**GitHub → Packages → `lit-webdemo` → Package settings → Change visibility**

Pulling a private package requires a PAT (or `GITHUB_TOKEN` in Actions) with `read:packages`.

### Pull and run the published image

```bash
# Public package (or after docker login for private)
docker pull ghcr.io/qiulongwen/lit-webdemo:latest
docker run --rm -p 8080:80 ghcr.io/qiulongwen/lit-webdemo:latest
```

If the package is private:

```bash
echo "$GITHUB_TOKEN" | docker login ghcr.io -u USERNAME --password-stdin
docker pull ghcr.io/qiulongwen/lit-webdemo:latest
```

## Project layout

```text
├── src/                      # Vue 3 application
├── Dockerfile                # multi-stage: Node build → nginx serve
├── nginx.conf                # SPA-friendly static server config
├── .dockerignore
└── .github/workflows/        # GHCR publish workflow
```
