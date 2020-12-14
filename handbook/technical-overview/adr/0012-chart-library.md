# What Chart Library Should We Use Across Island.is?

- Status: proposed
- Deciders: designers and developers of island.is
- Date: 2020-11-23

Technical Story: Select a chart library which fulfills all requirements for implementing charts on island.is

## Context and Problem Statement

Multiple projects need to show data visually using charts and graphs. In order to provide unified look and feel across island.is we should commit to a single approach to implementing charts, i.e. choose one library for the whole repository.

## Requirements

The charting library should:

- support rendering all standard charts, i.e. bar, line, pie,
- support custom styling of elements (colors, fonts, tooltips, legends, axis)
- support lazy/dynamic loading to minimize js bundles
- Typescript support

## Decision Drivers

- Meet all requirements listed above
- API quality
- Pricing
- Bundle size
- Typescript support

## Considered Options

- [Recharts](http://recharts.org/)
- [Chart.js latest stable version](https://www.chartjs.org/)
- [Chart.js 3.0.0 beta](https://www.chartjs.org/docs/next/getting-started/installation/)
- [Nivo](https://nivo.rocks/)
- [react-vis](https://uber.github.io/react-vis/)

## Decision Outcome

Chosen option: "Recharts", because it meets all requirements, and overall has a very nice, dev-friendly API. It is the most popular (downloads per week) react charting library on github, and recommended across the community. We can customize how it looks, and start using it quickly without much groundwork.

### Positive Consequences

- We can start implementing charts and graphs as needed in island.is

### Negative Consequences

- It is a big dependency, but almost all chart libraries are big due to their nature. We will minimize the impact of this by enforcing charts to be lazy loaded in our codebase.

## Pros and Cons of the Options

### Recharts

- Great, because it has a great API with composable chart components
- Great, because it allows customization of almost all chart elements
- Great, because it works beautifully with react
- Great, because it is tree-shakable
- Good, because it is battle tested and widely used across the community (510k weekly downloads, 15k github stars)
- Good, because it has typescript support
- Good, because it has no pricing
- Good, because there is a babel plugin which allows us to reduce the build output substantially
- Bad, because it is a big dependency (490.1 kb minified)

### Chart.js version 2.9.8 (latest stable version)

- Good, because it is battle tested and widely used across the community (1,273,958 weekly downloads, 51.1k github stars)
- Good, because it has typescript support
- Good, because it has no pricing
- Neutral, because it is not written for React, but it has a react wrapper package we can use to simply use it in our React code
- Bad, because it is pretty outdated and is due to be majorly refactored in version 3.0 which breaks backwards compatibility
- Bad, because it is a big dependency (459.6 kb minified)
- Bad, because its API is a bit bloated for doing simple things like custom tooltips

### Chart.js version 3.0.0-beta

- Great, because it is a relatively small dependency (154.1 kb minified)
- Great, because it is tree-shakable
- Good, because its API has been improved vastly over the latest stable version
- Good, because it has typescript support
- Good, because it has no pricing
- Bad, because it is still in beta
- Bad, because its API is a bit bloated for doing simple things like custom tooltips
- Bad, because if we opt in to use the beta version, we will have to implement our own react wrapper so it can be quickly used across our codebase

### Nivo

- Great, because it allows customization of almost all chart elements
- Great, because it works beautifully with react
- Great, because it is tree-shakable
- Good, because it has server side rendering
- Good, because it supports more exotic chart types in addition to the standard ones
- Good, because it has online storybook for documentation
- Good, because it has typescript support
- Good, because it is in very active development
- Good, because it has a very robust documentation
- Bad, because it is not as widely used nor battle tested as Chart.js or recharts
- Bad, because it is a big dependency (389.5 kB minified)
- Bad, because in practice its API is inferior to recharts (this is opinionated)
- Bad, because it can be hard to find what you are looking for in the documentation

### react-vis

- Great, because it is tree-shakable
- Good, because it works with react
- Good, because it has online storybook for documentation
- Good, because it has typescript support
- Bad, because in practice its API is inferior to most of the other options (this is opinionated)
- Bad, because we need to import their stylesheet, which in turn does not provide as nice styling API as the other choices
- Bad, because it is a relatively big dependency (313 kb minified)
- Bad, because it looks like there is no active development

## Links

- [Best react chart libraries](https://openbase.io/categories/js/best-react-chart-libraries)
- [Recharts](http://recharts.org/)
- [Chart.js latest stable version](https://www.chartjs.org/)
- [Chart.js 3.0.0 beta](https://www.chartjs.org/docs/next/getting-started/installation/)
- [Nivo](https://nivo.rocks/)
- [react-vis](https://uber.github.io/react-vis/)
