# Flow

Tests

- **generate-chunks**
  - PROJECTS=$("$PROJECT_ROOT"/scripts/ci/_nx-affected-targets.sh test)
    - **nx-affected-targets**
      - AFFECTED_FILES=$(git diff --name-only "$HEAD" "$BASE")
      - nx print-affected --target=test --select=tasks.target.project $EXTRA_ARGS
  - CHUNKS=$(./scripts/ci/generate-chunks.sh test)
    - **_chunk.js**
      - even chunks
