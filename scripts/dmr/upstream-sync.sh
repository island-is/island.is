#!/usr/bin/env bash
#
# upstream-sync.sh — sync ONLY kept paths from upstream island-is/island.is
# into the pruned DMR judicial-system fork.
#
# A full merge costs ~400 conflicts because upstream edits libs we deleted.
# This tool looks only at upstream commits that touch paths the fork still
# keeps, and (in --apply) replays each one restricted to those paths via
# `git format-patch -- <kept paths> | git am -3`.
#
# Usage:
#   scripts/dmr/upstream-sync.sh                 # report (read-only, default)
#   scripts/dmr/upstream-sync.sh --base <sha>    # report since an explicit base
#   scripts/dmr/upstream-sync.sh --apply         # replay relevant commits
#   scripts/dmr/upstream-sync.sh --apply --continue   # after resolving a conflict
#   scripts/dmr/upstream-sync.sh --no-fetch      # skip `git fetch upstream`
#
set -euo pipefail

UPSTREAM_REMOTE="upstream"
UPSTREAM_BRANCH="main"
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BASE_FILE="scripts/dmr/.upstream-sync-base"
# Fallback base: upstream commit merged by the last full sync (174be4d2cf^2).
DEFAULT_BASE="0135c083803bb6177992a3b62df72091454e439e"

# DMR-owned prefixes — never taken from upstream.
DMR_OWNED=(
  "terraform/"
  "scripts/dmr/"
  "docs/dmr/"
  ".github/workflows/"
)

MODE="report"
DO_FETCH=1
CONTINUE=0
BASE_OVERRIDE=""

while [ $# -gt 0 ]; do
  case "$1" in
    --apply)    MODE="apply" ;;
    --continue) CONTINUE=1 ;;
    --no-fetch) DO_FETCH=0 ;;
    --base)     shift; BASE_OVERRIDE="${1:-}" ;;
    -h|--help)  sed -n '2,19p' "$0"; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
  shift
done

say()  { printf '%s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die()  { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# ---- resolve base ----------------------------------------------------------
resolve_base() {
  if [ -n "$BASE_OVERRIDE" ]; then
    echo "$BASE_OVERRIDE"; return
  fi
  if [ -f "$BASE_FILE" ]; then
    local b; b="$(tr -d '[:space:]' < "$BASE_FILE")"
    [ -n "$b" ] && { echo "$b"; return; }
  fi
  echo "$DEFAULT_BASE"
}

# ---- build the kept-path list dynamically ----------------------------------
# A path is "kept" if it exists in the fork working tree AND is tracked.
# Emits a list of path prefixes (dirs, trailing /) + exact root files.
build_kept_prefixes() {
  local -a kept=()
  [ -d apps/judicial-system ] && kept+=("apps/judicial-system/")
  [ -d apps/system-e2e ]      && kept+=("apps/system-e2e/")
  local d
  for d in libs/*/; do
    [ -d "$d" ] && kept+=("$d")
  done
  [ -d infra ] && kept+=("infra/")
  local f
  for f in package.json yarn.lock tsconfig.base.json tsconfig.shared.json \
           nx.json .yarnrc.yml .npmrc babel.config.json jest.config.ts \
           jest.preset.js jest.resolver.js eslint.config.mjs scripts/ci/Dockerfile; do
    [ -e "$f" ] && kept+=("$f")
  done
  [ -d .yarn ] && kept+=(".yarn/")
  printf '%s\n' "${kept[@]}"
}

# is a given file path kept? ($1 = path, reads KEPT array)
path_is_kept() {
  local p="$1" k
  for k in "${DMR_OWNED[@]}"; do
    case "$p" in "$k"*) return 1 ;; esac
  done
  for k in "${KEPT[@]}"; do
    case "$k" in
      */) case "$p" in "$k"*) return 0 ;; esac ;;   # prefix
      *)  [ "$p" = "$k" ] && return 0 ;;            # exact file
    esac
  done
  return 1
}

classify() {
  case "$1" in
    apps/judicial-system/*|libs/judicial-system/*) echo "judicial" ;;
    apps/system-e2e/*)                             echo "judicial" ;;
    libs/*)                                        echo "shared-libs" ;;
    *)                                             echo "root" ;;
  esac
}

# set of @island.is/<root> aliases actually present in tsconfig.base.json
tsconfig_aliases() {
  grep -oE '"@island\.is/[^"]+"' tsconfig.base.json \
    | sed -E 's/^"@island\.is\/([^/"]+).*/\1/' | sort -u
}

# ---- gather relevant commits ----------------------------------------------
BASE="$(resolve_base)"
mapfile -t KEPT < <(build_kept_prefixes)

if [ "$DO_FETCH" -eq 1 ] && [ "$CONTINUE" -eq 0 ]; then
  say ">> git fetch $UPSTREAM_REMOTE $UPSTREAM_BRANCH"
  git fetch "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH" >/dev/null 2>&1 \
    || die "fetch failed (network? remote '$UPSTREAM_REMOTE'?)"
fi

UP="$UPSTREAM_REMOTE/$UPSTREAM_BRANCH"
git cat-file -e "$BASE^{commit}" 2>/dev/null || die "base $BASE not found locally"
git merge-base --is-ancestor "$BASE" "$UP" 2>/dev/null \
  || warn "base $BASE is not an ancestor of $UP — results may be odd"

mapfile -t ALL < <(git rev-list --reverse --no-merges "$BASE..$UP")

RELEVANT=()
declare -A GROUP_OF
declare -A DEP_WARN
SKIPPED=0
mapfile -t ALIASES < <(tsconfig_aliases)
alias_known() { local a; for a in "${ALIASES[@]}"; do [ "$a" = "$1" ] && return 0; done; return 1; }

# files of a commit, restricted to kept paths (prints kept files only)
kept_files_of() {
  local sha="$1" f
  while IFS= read -r f; do
    path_is_kept "$f" && printf '%s\n' "$f"
  done < <(git diff-tree --no-commit-id --name-only -r "$sha")
}

for sha in "${ALL[@]}"; do
  mapfile -t kf < <(kept_files_of "$sha")
  if [ "${#kf[@]}" -eq 0 ]; then
    SKIPPED=$((SKIPPED+1)); continue
  fi
  RELEVANT+=("$sha")
  g=""
  for f in "${kf[@]}"; do
    cg="$(classify "$f")"
    case "$cg" in
      judicial) g="judicial" ;;
      shared-libs) [ "$g" = "judicial" ] || g="shared-libs" ;;
      root) [ -z "$g" ] && g="root" ;;
    esac
  done
  GROUP_OF[$sha]="$g"
  # new-dependency scan: added imports of @island.is/<root> in kept files,
  # where <root> is NOT a tsconfig alias in this fork (would break the build).
  while IFS= read -r line; do
    case "$line" in +*@island.is/*) : ;; *) continue ;; esac
    dep="$(printf '%s' "$line" | grep -oE '@island\.is/[A-Za-z0-9._-]+' | head -1 || true)"
    [ -z "$dep" ] && continue
    root="${dep#@island.is/}"; root="${root%%/*}"
    if ! alias_known "$root"; then
      case " ${DEP_WARN[$sha]:-} " in
        *" $root "*) : ;;
        *) DEP_WARN[$sha]="${DEP_WARN[$sha]:-} $root" ;;
      esac
    fi
  done < <(git show "$sha" -- "${kf[@]}" 2>/dev/null | grep -E '^\+' || true)
done

# ---- report ----------------------------------------------------------------
report() {
  say ""
  say "Upstream sync report"
  say "  base       : $BASE"
  say "  upstream   : $UP ($(git rev-parse --short "$UP"))"
  say "  kept rules : ${#KEPT[@]} prefixes/files; DMR-owned excluded"
  say "  commits    : ${#RELEVANT[@]} relevant, $SKIPPED skipped (touch only deleted paths)"
  say ""
  local grp printed sha flag
  for grp in judicial shared-libs root; do
    printed=0
    for sha in "${RELEVANT[@]}"; do
      [ "${GROUP_OF[$sha]}" = "$grp" ] || continue
      if [ "$printed" -eq 0 ]; then say "[$grp]"; printed=1; fi
      flag=""
      [ -n "${DEP_WARN[$sha]:-}" ] && flag="  ⚠ imports pruned lib(s):${DEP_WARN[$sha]}"
      say "  $(git log -1 --format='%h %s' "$sha")$flag"
    done
    [ "$printed" -eq 1 ] && say ""
  done
  local depcount=0 k
  for k in "${!DEP_WARN[@]}"; do depcount=$((depcount+1)); done
  if [ "$depcount" -gt 0 ]; then
    say "⚠ $depcount commit(s) import @island.is libs NOT in tsconfig.base.json"
    say "  — those libs are pruned from this fork; replaying them will break the build."
  fi
  [ "${#RELEVANT[@]}" -eq 0 ] && say "Nothing to sync. Fork is current with $UP for kept paths."
  return 0
}

# ---- apply -----------------------------------------------------------------
# Replay one commit restricted to its kept paths. Returns:
#   0 applied, 2 empty-after-restriction, 3 conflict (left for user)
apply_one() {
  local sha="$1"
  mapfile -t kf < <(kept_files_of "$sha")
  [ "${#kf[@]}" -eq 0 ] && return 2
  local patch; patch="$(mktemp "${TMPDIR:-/tmp}/dmr-sync.XXXXXX.patch")"
  # format-patch restricted to kept paths; -x-style provenance via am message.
  if ! git format-patch -k -1 --stdout "$sha" -- "${kf[@]}" > "$patch" 2>/dev/null; then
    rm -f "$patch"; return 2
  fi
  [ -s "$patch" ] || { rm -f "$patch"; return 2; }
  if git am -3 --keep-non-patch "$patch" >/dev/null 2>&1; then
    rm -f "$patch"
    # append provenance trailer (git am keeps original author/subject)
    git commit --amend -q --no-edit -m "$(git log -1 --format='%B')" \
      -m "(cherry picked from commit $sha)" 2>/dev/null || true
    return 0
  fi
  rm -f "$patch"
  # conflict: is anything actually unresolved?
  if git diff --name-only --diff-filter=U | grep -q .; then
    return 3
  fi
  # am failed but no conflict markers (e.g. empty after 3-way): abort cleanly
  git am --abort 2>/dev/null || true
  return 2
}

do_apply() {
  [ "${#RELEVANT[@]}" -eq 0 ] && { report; say "apply: nothing to do."; return 0; }
  local branch; branch="dmr/upstream-sync-$(date +%Y%m%d)"
  if [ "$CONTINUE" -eq 0 ]; then
    if ! git diff --quiet || ! git diff --cached --quiet; then
      die "working tree not clean; commit/stash first"
    fi
    git rev-parse --verify "$branch" >/dev/null 2>&1 \
      && die "branch $branch already exists — resume with --apply --continue on it, or delete it"
    git checkout -q -b "$branch"
    say ">> created $branch"
  else
    # finishing an in-progress am started by a previous run
    if [ -d "$(git rev-parse --git-path rebase-apply 2>/dev/null)" ]; then
      git am --continue >/dev/null 2>&1 || die "git am --continue failed; resolve conflicts, 'git add', retry"
    fi
    say ">> continuing on $(git rev-parse --abbrev-ref HEAD)"
  fi

  local applied=0 lockfile_touched=0 sha rc
  for sha in "${RELEVANT[@]}"; do
    # idempotent: skip if an equivalent subject already landed on this branch
    if git log --format='%s' "$BASE..HEAD" 2>/dev/null | grep -qxF "$(git log -1 --format='%s' "$sha")"; then
      continue
    fi
    say ">> replay $(git log -1 --format='%h %s' "$sha")"
    rc=0; apply_one "$sha" || rc=$?
    case "$rc" in
      0) applied=$((applied+1))
         if git diff-tree --no-commit-id --name-only -r "$sha" | grep -qE '^(package\.json|yarn\.lock)$'; then
           lockfile_touched=1
         fi
         [ -n "${DEP_WARN[$sha]:-}" ] && warn "replayed commit imports pruned lib(s):${DEP_WARN[$sha]} — build may fail" ;;
      2) say "   (no kept changes after restriction / already present, skipped)" ;;
      3) warn "CONFLICT in kept paths at $sha"
         say "   resolve the files, 'git add' them, then: $0 --apply --continue"
         exit 1 ;;
    esac
  done

  git rev-parse "$UP" > "$BASE_FILE"
  git add "$BASE_FILE"
  git commit -q -m "chore(dmr): record upstream-sync base $(git rev-parse --short "$UP")" || true
  say ""
  say "Applied $applied commit(s) onto $branch. Recorded base -> $BASE_FILE."
  [ "$lockfile_touched" -eq 1 ] && \
    warn "package.json/yarn.lock changed — run 'yarn install' to regenerate the lockfile before building."
  return 0
}

case "$MODE" in
  report) report ;;
  apply)  do_apply ;;
esac
