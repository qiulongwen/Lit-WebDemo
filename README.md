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
| Push to `main` or tag `v*` | Builds and pushes **one** tag: `<version>-<shortsha>` |

### Image name and tags

```text
ghcr.io/qiulongwen/lit-webdemo:<version>-<commit id>
```

Repository names are lowercased for GHCR. **`latest` is not used.** There is only one tag form:

| Part | Source |
| --- | --- |
| `<version>` | `version` from `package.json` (no `v` prefix), e.g. `1.0.0` |
| `<commit id>` | Short git SHA (7 chars), e.g. `79e915d` |

Example: `ghcr.io/qiulongwen/lit-webdemo:1.0.0-79e915d`

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
docker pull ghcr.io/qiulongwen/lit-webdemo:1.0.0-79e915d
docker run --rm -p 8080:80 ghcr.io/qiulongwen/lit-webdemo:1.0.0-79e915d
```

If the package is private:

```bash
echo "$GITHUB_TOKEN" | docker login ghcr.io -u USERNAME --password-stdin
docker pull ghcr.io/qiulongwen/lit-webdemo:1.0.0-79e915d
```

## Runtime config (`config.js`)

The SPA loads `/config.js` **before** the app bundle. That file sets
`window.__APP_CONFIG__` (see `public/config.js`). The Vue app reads it via
`src/utils/appConfig.ts`, so API base URL and similar values can change at
deploy time **without rebuilding the image**.

Default keys:

| Key | Purpose |
| --- | --- |
| `apiBaseUrl` | Backend API origin (empty locally) |
| `appEnv` | Environment label (`local`, `staging`, …) |

### Kubernetes ConfigMap mount

Mount a ConfigMap file over the nginx static path:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: lit-webdemo-config
data:
  config.js: |
    window.__APP_CONFIG__ = {
      apiBaseUrl: 'https://api.example.com',
      appEnv: 'staging',
    };
---
# On the Deployment pod volumeMounts / volumes:
# volumeMounts:
#   - name: app-config
#     mountPath: /usr/share/nginx/html/config.js
#     subPath: config.js
#     readOnly: true
# volumes:
#   - name: app-config
#     configMap:
#       name: lit-webdemo-config
```

- **Mount path:** `/usr/share/nginx/html/config.js`
- **ConfigMap key:** `config.js` (use `subPath: config.js`)
- nginx serves `/config.js` with `Cache-Control: no-store` so browsers pick up updates after pod refresh

## Project layout

```text
├── public/config.js          # runtime config (ConfigMap override target)
├── src/                      # Vue 3 application
├── Dockerfile                # multi-stage: Node build → nginx serve
├── nginx.conf                # SPA-friendly static server config
├── .dockerignore
└── .github/workflows/        # GHCR publish workflow
```

