# P0 — Pre-prune build baseline

Status: **GREEN** — all 7 judicial services build on the untouched (pre-light-prune) tree.
Date: 2026-10-19 · Branch: `chore/judicial-prune`

## Toolchain (required to reproduce)
- **Node 22.22.3** (pinned in `package.json` engines). Host default node 25 is too new. Installed via `fnm install 22.22.3`.
- **Yarn 4.6.0** (corepack / `packageManager`).
- **JDK** required for OpenAPI codegen (openapi-generator is Java). Used `/opt/homebrew/opt/openjdk@21`. The bare `/usr/bin/java` stub reports "Unable to locate a Java Runtime"; set `JAVA_HOME` explicitly.
- **TMPDIR workaround**: the sandbox denies `lstat`/`mkdir` on `$KIROCREW_SCRATCH`'s parent, which breaks yarn's `realpathSync`/mktemp. Set `TMPDIR`/`TMP`/`TEMP` to a repo-local `.tmp-build/` (git-ignored) for install + build.
- `NODE_OPTIONS=--max-old-space-size=8192`.

Reproduce:
```bash
export PATH="$HOME/.local/share/fnm/node-versions/v22.22.3/installation/bin:$PATH"
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
export TMPDIR="$PWD/.tmp-build" TMP="$PWD/.tmp-build" TEMP="$PWD/.tmp-build"
export NODE_OPTIONS=--max-old-space-size=8192
yarn install --immutable
```

## Codegen chain (must run before build; not wired as Nx `dependsOn`)
Order matters:
1. `judicial-system-api:codegen/backend-schema` → emits `apps/judicial-system/api/src/api.graphql` (judicial API's own GraphQL schema — NOT the island.is gateway).
2. `judicial-system-web:codegen/frontend-client` → reads that schema → emits `apps/judicial-system/web/src/graphql/schema.tsx`.
3. `judicial-system-court-client:codegen/backend-client` → OpenAPI → emits `libs/judicial-system/court-client/gen/fetch/` (**needs Java**).

> Scope codegen to the judicial projects explicitly. `nx run-many --target=codegen/frontend-client` fans out to contentful-apps / native-app / payments / web too.

## Gateway seam severed (the API decision, executed)
The judicial **web** closure pulled in the island.is API gateway schema `@island.is/api/schema` (`libs/api/schema`) purely at compile time, through two type-only imports of `Query` / `QueryGetTranslationsArgs`:
- `apps/judicial-system/web/pages/_app.tsx`
- `libs/localization/src/lib/withLocale.tsx` (shared lib; `LocaleContext.tsx` in the same lib already typed these locally)

Both replaced with local interfaces mirroring the resolver shape
(`getTranslations(input: {namespaces, lang}) → Record<string,string>`).
After the fix, `api-schema` is **no longer in `judicial-system-web`'s Nx dependency closure** — the gateway app/lib can be pruned without breaking the build. Runtime translations are unaffected: served by `judicial-system-api` via `libs/cms-translations` (Contentful), not the gateway.

## Build result
`nx run-many --target=build` for all 7 → **rc=0**, ~84s warm (200s cold for web).

| Service | Project | Build |
|---|---|---|
| backend | judicial-system-backend | ✅ |
| api | judicial-system-api | ✅ |
| web | judicial-system-web | ✅ |
| digital-mailbox-api | judicial-system-digital-mailbox-api | ✅ |
| message-handler | judicial-system-message-handler | ✅ |
| scheduler | judicial-system-scheduler | ✅ |
| xrd-api | judicial-system-xrd-api | ✅ |

## Carry-forward for later phases
- **Prune can now delete `apps/api` + `libs/api/schema`** without breaking judicial web (verified via closure check). Still referenced by the 21 non-judicial apps being dropped anyway.
- **CI must install a JDK** and run the 3 codegen steps (in order) before build.
- Stray `/Users/snojo/package-lock.json` makes Next.js warn about workspace-root inference — harmless; can set `outputFileTracingRoot` later to silence.
- `tsconfig.base.json` still has path mappings to the apps we'll delete — clean up during the prune (P1).
