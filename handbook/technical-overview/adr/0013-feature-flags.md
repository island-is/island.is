# What Feature Flag Service/application Should We Use at Island.is?

- Status: accepted
- Deciders: developers and product owners of island.is
- Date: 2021-01-18

Technical Story: Select a feature flag solution that gives us the ability to easily use feature flags across our solutions.

## Context and Problem Statement

We want to be able to roll out new features gradually, perform A/B testing and target individual groups with a new feature. Also, we want to be able to flip a switch to turn features on or off for everyone.

## Decision Drivers

- Ease of setup
- Ease of maintenance
- Cost
- Developer experience
- Usability/UX
- Operational concerns
- Handling of PII

## Considered Options

- [LaunchDarkly](https://launchdarkly.com/)
- [FlagSmith](https://www.flagsmith.com/)
- [Optimizely Rollouts](https://www.optimizely.com/rollouts)
- [Unleash](https://github.com/Unleash/unleash)
- [ConfigCat](https://configcat.com)
- [FeatureFlagTech](https://featureflag.tech)

## Decision Outcome

Chosen option: "ConfigCat", because:

- We can probably get away with using it for very low cost
- We can start using it almost right away with little configuration

If we decide later that we would like some of the features of LaunchDarkly, we want to be able to quickly swap. Thus, it is vital that we write some kind of service-agnostic wrapper.

### Positive Consequences

- We can start using feature flags across our stack.

### Negative Consequences

- Complexity of applications will increase

## Pros and Cons of the Options

### LaunchDarkly

- Good, because it has great UX
- Good, because it is the market leader and has a lot of customization options
- Good, because it allows developers to change flags in config files for local development
- Good, because it offers a relay proxy, minimizing outgoing connections
- Good, because setup is easy and maintenance is really low
- Good, because it has built-in support for multiple environments
- Good, because the provide private attributes to help with PII
- Good, because it has built-in datadog support
- Bad, because it's the most expensive of the considered options
- Bad, because it's hard to segment on PII

### FlagSmith

- Good, because it's free if self-hosted
- Good, because it has built-in support for multiple environments
- Good, because we can segment on PII since we store all the data
- Good, because devs could run their own instance for local development
- Bad, because we'd need to maintain it ourselves
- Bad, because it has quite low community activity on GitHub

### Optimizely Rollouts

- Good, because it's free for a low volume
- Good, because setup is easy and maintenance is really low
- Good, because it has built-in support for multiple environments
- Bad, because it's really hard to segment on PII
- Bad, because UI is hard to navigate
- Bad, because it doesn't seem to have a lot of open-source usage/examples
- Bad, because it only supports development environment inside the product
- Bad, because they don't have self-serve or an open price list
- Bad, because it's part of some larger stack that we're not using, and seems to be opinionated towards that

### Unleash

- Good, because it's free if self-hosted
- Good, because we can segment on PII since we store all the data
- Good, because devs could run their own instance for local development
- Good, because it has high community activity on GitHub
- Bad, because it doesn't come with built-in support for multiple environments
- Bad, because the UI is hard to navigate and counter-intuative in places
- Bad, because we'd have to implement authorization ourselves

### ConfigCat

- Good, because they don't base their pricing on MAU but config downloads
- Good, because they can be configured to store everythin in EU
- Good, because setup is easy
- Good, because it has built-in support for multiple environments
- Bad, because we would want to implement our own relay
- Bad, because it seems quite bare-bones compared to others
- Bad, because it only supports development environment inside the product
- Bad, because it's really hard to segment on PII

### FeatureFlagTech

- Good, because it's cheap
- Good, because setup is easy and maintenance is really low
- Bad, because we would want to implement our own relay
- Bad, because it doesn't support user segmentation or variations
- Bad, because their UI is horrible

## Links

- [LaunchDarkly read flags from files](https://docs.launchdarkly.com/sdk/concepts/flags-from-files)
- [Optimizely Rollouts Plans Comparison](https://www.optimizely.com/compare-rollouts-plans/)
