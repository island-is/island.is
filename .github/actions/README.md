# GitHub Actions supporting scripts

In this section of the repo you will find GitHub specific integrations. We really hope there will not be many of them.

## Testing

```
yarn
yarn test
```

## Building/Packaging

```
yarn
yarn build
```

## Running locally

Running the action locally is a bit tricky. First thing is it should use `@octokit/rest` instead of `@octokit/action` (as commented at the top of [the file](./main.ts)). The other thing is you need to provide a GitHub PAT token to perform the GitHub API calls necessary for the functionality(see the other comment a bit further down the same file). Then you need to pipe in the `stdin` a list of git SHAs taken from a git log and that should get you going.

There is a rewrite in the works so probably best to avoid worrying about this version very much
