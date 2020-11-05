# Error tracking and monitoring

- Status: accepted
- Deciders: devs, devops
- Date: 12.06.2020

## Context and Problem Statement

Know it before they do! We need a tool to discover, triage, and prioritize errors in real-time.

## Considered Options

- [Bugsnag](https://www.bugsnag.com/)
- [Sentry](https://sentry.io/)

## Decision Outcome

Chosen option: `Sentry`, because it ranks higher in a community survey regarding our stack (Javascript). It's also much cheaper and offers the choice to be completely free if we self-host it.

## Pros and Cons of the Options

### Bugsnag

- Good, because it offers a Slack integration for faster feedback.
- Good, because it offers a Github integration to link to possible commits and PRs.
- Good, because it offers bot front-side/server-side/serverless error tracking.
- OK, because it was ranked the **\#5** as the best Javascript (client-side) error logging service in a community survey.
- Bad, because it's expensive. (**\$199/mo** for **450k events** and **15 collaborators**)
- Bad, because it's pricing includes a fixed set of collaborators.

### Sentry

- Good, because it offers a Slack integration for faster feedback.
- Good, because it offers a Github integration to link to possible commits and PRs.
- Good, because it offers bot front-side/server-side/serverless error tracking.
- Good, because it was ranked the **\#1** as the best Javascript (client-side) error logging service in a community survey.
- Good, because it's cheaper than most error logging services out there (half the price of Bugsnag).
- Good, because it offers the possibility of being completely free with a self-hosted solution (since Sentry is open-source).
- Good, because you only pay for the number of events, regardless of how many collaborators.
- Bad, because it costs (since we won't go with the self-hosted solution at first). (**\$89/mo** for **500k events** and **∞ collaborators**)
