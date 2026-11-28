---
name: hotfix-release
description: Create a hotfix branch from a release branch, cherry-pick a commit, and open a PR against that release branch
disable-model-invocation: true
argument-hint: '<release-branch-or-version> <sha> [sha...]'
allowed-tools: Bash(git:*), Bash(gh pr create:*), Read, Grep, Glob
---

# Hotfix Release

You are creating a hotfix on an existing release branch by cherry-picking a commit from `main` (typically a squash-merged PR), then opening a PR back to that release branch.

The user will provide:

- **Release branch name or version** (e.g. `release/2026.5.26.0` or `2026.5.26.0`).
- **Commit SHA(s)** to cherry-pick.

If either is missing, ask for it before continuing.

## Steps

1. **Normalize inputs**:

   - If the release argument doesn't start with `release/`, prepend it.
   - Treat each provided SHA as a single commit to cherry-pick. Multiple SHAs are allowed and applied in the order given.

2. **Fetch refs**:

   - Run `git fetch origin` so the release branch and the commit are guaranteed to be available locally.
   - Verify the release branch exists: `git rev-parse --verify origin/<release-branch>`. If it doesn't, stop and tell the user.
   - Verify each commit exists: `git cat-file -e <sha>^{commit}`. If any doesn't, stop and tell the user the SHA isn't reachable (it may need an additional fetch).

3. **Identify the source commit**:

   - For each SHA, run `git log -1 --format='%s%n%n%b' <sha>` to read its message.
   - From the first commit's subject (typically `type(scope): description (#NNNN)`), extract:
     - The conventional commit subject (used as the PR title).
     - The original PR number, if present in `(#NNNN)`, for the body link.

4. **Create the hotfix branch**:

   - Pick a branch name. Default form: `hotfix/<short-slug-from-commit-or-user-hint>`. If the source commit subject contains a recognizable scope/topic, derive the slug from it; otherwise ask the user.
   - Create the branch tracking the release branch:
     `git checkout -b hotfix/<slug> origin/<release-branch>`

5. **Cherry-pick**:

   - For each SHA in order: `git cherry-pick <sha>`.
   - If a conflict occurs, stop, show the conflicted files, and ask the user how to proceed. Do not auto-resolve conflicts.

6. **Push the branch**:

   - `git push -u origin hotfix/<slug>`.

7. **Open a PR against the release branch**:

   - Use `gh pr create --base <release-branch>`.
   - **Title**: same as the cherry-picked commit subject (without the `(#NNNN)` suffix is fine; keeping it is also fine — match what the user prefers, default to keeping the subject as-is minus the trailing PR number).
   - **Body**: minimal — link to the original PR(s) using `#NNNN` references. Use a HEREDOC.
   - Standard checklist appended.

   Default body template:

   ```
   Cherry-pick of #<original-pr> onto the release branch.

   ## Checklist:

   - [ ] I have performed a self-review of my own code
   - [ ] I have made corresponding changes to the documentation
   - [ ] My changes generate no new warnings
   - [ ] I have added tests that prove my fix is effective or that my feature works
   - [ ] Formatting passes locally with my changes
   - [ ] I have rebased against main before asking for a review
   - [ ] No AI tools were used in preparing this pull request
   - [x] AI tools were used in preparing this pull request
         Tools used: <the tool you are, e.g. Claude Code>
   ```

   For multiple cherry-picks, list each: `Cherry-pick of #A, #B onto the release branch.`

   If the original PR number can't be extracted from the commit subject, fall back to listing the SHAs: `Cherry-pick of <sha1>, <sha2> onto the release branch.`

8. **Confirm and return**:
   - Print the PR URL.

## Confirmation point

Before pushing (step 6), state the plan in one line and proceed. Only stop and ask if:

- The release branch doesn't exist.
- A SHA isn't reachable.
- A cherry-pick conflicts.
- The branch slug can't be confidently derived from the commit subject.

## Important

- Base branch for the PR is the **release branch**, never `main`.
- Use HEREDOC for the PR body to preserve formatting.
- Never run destructive git commands (`reset --hard`, `push --force`, `branch -D`) without explicit user confirmation.
- If the user is currently on a branch with uncommitted changes, stop and ask before checking out the new hotfix branch.
- Don't add tests or other changes. This skill cherry-picks exactly what the user provided — nothing more.
