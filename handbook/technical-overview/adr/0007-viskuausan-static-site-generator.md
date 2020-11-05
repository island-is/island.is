# Viskuausan Static Site Generator

- Status: accepted
- Deciders: devs
- Date: 2020-09-07

We're going to create a web app for Viskuausan (API Catalog). Viskuausan consists of three main components:

- Web service catalogue
  - Displays an overview of web services.
  - Displays details about each web service.
- Data definition catalogue
  - Displays an overview of data definitions
  - Displays details about each data definition
- Design guidelines
  - Static text content describing best practices for API development

The two catalogue components require:

- Data storage
- API communication
- API GW and X-Road integration
- Other custom implementations

The design guidelines component require:

- Static content written in markdown

## Context and Problem Statement

Viskuausan is proving to be more complex and larger platform than just a simple documentation site from static content. Which React framework provides the most out-of-the-box features that we need?

## Decision Drivers

- Should use NodeJS and React as outlined in [SÍ technical direction](../../technical-direction.md)
- Should be able to support markdown content rendered to HTML
- Should be open source
- Should be customizable to island.is UI design

## Considered Options

- [Docusaurus v2](https://v2.docusaurus.io/)
- [GatsbyJS](https://www.gatsbyjs.org/)
- NextJS + NestJS

## Decision Outcome

Chosen option: NextJS + NestJS

NextJS is the chosen web framework for all island.is websites needing server side rendering. As Viskuausan will probably be merged with island.is main website, creating it using same frameworks makes it easy to merge later on. It is easier to reuse islandis-ui components using NextJS over Docusaurus. Docusaurus main advantage over Next is out-of-the-box markdown support but it is easy to add markdown support in NextJS using [Remark](https://github.com/remarkjs/remark) library.

NestJS is used to create backend services and Viskuausan needs few backend services related to the X-Road and API GW integrations. Provides functionalities like ORM, dependency injection, unit testing.

## Pros and Cons of the Options

All of the considered options are built using React, are open source and popular site generators.

### Docusaurus v2

- Good, because it focuses on documentation
- Good, because it supports TypeScript
- Good, because it is extendable via plugins & themes
- Good, because it is ready for translations
- Good, because it supports document versioning
- Good, because it has content search out-of-the-box
- Bad, because it is still in beta
- Bad, because it requires manual setup for typescript compile-time type checking
- Bad, because it needs manual setup for ORM, dependency injection, testing and more.
- Bad, because it is not suitable for larger websites which needs more backend

  api functionality.

### Gatsby

- Good, because it has rich ecosystem of plugins
- Good, because it supports TypeScript
- Good, because it is really flexible
- Good, because it has GraphQL support for external data
- Bad, because it has high project complexity
- Bad, because it has high learning curve
- Bad, because it requires manual setup for TypeScript compile time type checking

### NextJS + NestJS

- Good, because it is flexible
- Good, because it supports TypeScript
- Good, because it is already in use in the monorepo
  - Will make it easier to move into the island.is web
- Good, because it is easy to use islandis-ui components
- Bad, because it requires customization to render markdown
  - Is relatively easy using [Remark](https://github.com/remarkjs/remark)

### Other honorable mentions

- [Docz](https://www.docz.site/)

  Built using Gatsby so we would rather go with Gatsby than Docz so

  unnecessary to list as an option
