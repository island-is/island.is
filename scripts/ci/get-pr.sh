#!/bin/bash

COMMIT_SHA=$1
OWNER=${2:-"island-is"}
REPO=${3:-"island.is"}

# shellcheck disable=SC2016
gh api graphql -F commitSha="$COMMIT_SHA" -F repository="$REPO" -F owner="$OWNER" -f query='
query GetPRFromCommit($commitSha: GitObjectID!, $repository: String!, $owner: String!) {
  repository(name: $repository, owner: $owner) {
    object(oid: $commitSha) {
      ... on Commit {
        associatedPullRequests(first: 1) {
          edges {
            node {
              number
              title
              state
              mergedAt
            }
          }
        }
      }
    }
  }
}' | jq -r '.data.repository.object.associatedPullRequests.edges[0].node.number'
