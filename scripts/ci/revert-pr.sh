#!/bin/bash

PR=$1
read -r NODE_ID TITLE < <(gh api "repos/island-is/island.is/pulls/${PR}" --jq '[.node_id, .title] | @tsv')

# shellcheck disable=SC2016
gh api graphql -f query='
  mutation ($pr: ID!, $title: String, $body: String) {
    revertPullRequest(
      input: {
        title: $title,
        body: $body,
        pullRequestId: $pr
      }
    ) {
      revertPullRequest {
        number
      }
    }
  }' \
  -f "pr=${NODE_ID}" \
  -f "title=revert: ⚠️  ${TITLE}" \
  -f "body=Reverts PR #${PR}" --jq '.data.revertPullRequest.revertPullRequest.number'
