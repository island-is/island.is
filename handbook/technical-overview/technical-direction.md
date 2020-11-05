# Technical Direction

{% hint style="info" %}
This document sets a high-level technical direction for Digital Iceland. It describes architectural patterns, development tools, workflows and values that should be adopted by teams building solutions for Ísland.is.
{% endhint %}

{% hint style="info" %}
As time goes by, this document will be updated to match evolving trends in Digital Iceland as well as the global developer community.
{% endhint %}

Digital Iceland is responsible for software solutions that relate to the Icelandic [central service portal](https://stafraent.island.is/verkefni/nytt-island-is/) under the brand Ísland.is. These solutions allow companies and individuals to access government services in a simple and efficient way. Meanwhile, government organisations are responsible for their content, data and service, some of which may end up on Ísland.is.

Solutions are developed by teams, from multiple vendors and organisations, in a single [code repository](monorepo.md). The code is open source, facilitating code reuse and allowing various parties to contribute to development and maintenance in the future.

On top of this, we enforce strict responsibilities, code reviews and automated testing to maintain good code quality.

### Architecture

There are a few software architectural patterns that Digital Iceland embraces when designing its solutions.

#### Frontend applications

Teams should implement solutions as standalone frontend applications, e.g. single-page applications (SPA) or mobile applications, and integrate them with backend services through API interfaces.

Having a clear separation between frontend and backend allows us to implement User Interfaces (UI) that behave like applications with richer and faster User Experience (UX). It also reduces coupling and scales up development, creating reusable backend services that support more varied presentation through different frontend applications.

#### Shared code

A big focus in the technical direction for Ísland.is is to support the development of code that teams can share and reuse in later projects to accelerate overall development. With time, teams get faster at implementing projects, since a lot of the individual pieces already exist. Additionally, the overall quality increases, since improvements to the shared code elevates all projects that use it.

Code can be reused at all levels, e.g.:

- UI Components like buttons, typography and forms.
- Localisation utilities to support translations in multiple languages, date and number formatting, with specialised Icelandic support.
- Authentication and authorisation logic that implements security best practices.
- Operation monitoring with logging, metrics and tracing.
- Microservices for handling PDF generation, electronic signatures, notifications, payments, audit and more.
- Client code for external services.
- Build and deployment pipelines.

#### Modular solutions

Instead of ending up with dozens, or even hundreds of solutions, Ísland.is wants to create a few monolithic, modular solutions which our teams can extend with new functionality. Examples of this include:

- One information portal for any form of content that the government wants to publish.
- One service portal, for individuals and companies to sign in and access self-service modules.
- One admin interface, for government organisations, to serve their users.
- One access control system, to authenticate users, authorize actions and delegate access.
- One API gateway to all of our microservices.

We design these solutions to give our users a consistent, high-quality UX while giving our teams the flexibility and power they need to implement their projects.

#### Microservices

For specific data or business logic which is owned by Ísland.is (as opposed to other government organisation), teams should implement them in microservices.

These microservices can store data in a database, and communicate with other services through REST communications. Teams should consider using a message bus to reduce coupling between microservices when appropriate.

Frontend applications can access these microservices through an API gateway.

### Workflow

[Interdisciplinary teams](https://stafraent.island.is/samvinna/thverfagleg-stafraen-teymi/) should perform their work using an agile methodology, like Scrum, to optimize efficiency and efficacy while embracing change and minimizing risk. Agile software development emphasizes continuous delivery, where solutions are released early and improved with time.

With continuous delivery, code changes are verified as follows to minimize the likelihood of errors:

- Teams write code in a strongly typed programming language, like TypeScript, where the compiler catches many cases of invalid code.
- The teams maintain automated tests, with a particular focus on E2E tests (e.g. interface tests) that test the solution from start to finish.
- For every change, the team and other affected parties perform a code review to verify the quality of the code.
- Last but not least, teams deploy their changes to a testing environment, where project owners, testers and designers can review and approve the implementation before it goes into production.

#### Code storage

For the development of centralized, open-source solutions, it is essential to have a shared place to store and collaborate on code.

We will use [GitHub](https://github.com/) for all development and teams must submit all code there. GitHub is the primary code hosting provider for open-sourced software development, owned by Microsoft, with an excellent feature-set and interface for code reviews and collaboration. GitHub is also integrated into many essential tools in the software development ecosystem.

Digital Iceland has set up a monorepo, which contains the code for all of its solutions in one code repository with collaboration between all teams. There are many reasons we develop in a monorepo:

- Reduce barriers for code reuse on all levels of the implementation.
- Increase cooperation and consistency in implementation between projects.
- Prevent solutions from being left and forgotten, with code rot and old dependencies.
- Support organisation-wide improvements in developer experience, hosting, performance, accessibility, design and usability.

#### Cloud hosting

We host our solutions in a containerised cloud environment, using [Docker](https://www.docker.com/resources/what-container) and [Kubernetes](https://kubernetes.io/), on AWS infrastructure. To avoid lock-in, we use open-source databases and tools that we can host on any cloud infrastructure.

With Docker containers, services run independently of the hardware. They are easy to spin up, especially suitable for Agile development with continuous delivery and can handle increased load and hardware problems.

We've configured our cloud environment with a secure virtual private network that limits external access to sensitive services as well as allowing us to set up VPN connections and fixed IP addresses to integrate with external services. We also have an [X-Road](https://x-road.global/) Security Server to access other government organisations through [Straumurinn](https://stafraent.island.is/verkefni/straumurinn/).

### Development tools

Digital Iceland chooses the primary programming languages, frameworks, tools and databases that teams should use, to increase consistency and code reuse while avoiding vendor lock-in. The primary prerequisites behind a technology choice are:

- Open-source: To minimise operational costs and reduce gatekeeping when it comes to tenders.
- Popular: To increase the talent pool among Icelandic vendors and continued support in the overall community.
- Flexible: To support reuse with more use cases and limit the total number of tools in use.
- Dependable: To support rapid software development with as few errors as possible.

#### Frontend

Our teams implement frontend applications using the [TypeScript](https://www.typescriptlang.org/) programming language. TypeScript is a popular programming language which is compiled into JavaScript and offers strict data types, readable code and a compiler that catches many errors. Deep integration in development tools helps teams build and maintain large solutions.

When creating interfaces, teams should use the [React](https://reactjs.org/) frontend framework. With React, teams create user interface (UI) components which they then arrange to form complete interfaces.

Many of these UI components can be reused for multiple interfaces, across teams and projects, e.g. buttons, inputs and navigation. Teams should add these to [Storybook](https://storybook.js.org/), which provides an overview of all reusable components, as well as a testing environment for interested stakeholders.

For interactive frontend applications, teams should use [Cypress](https://www.cypress.io/) to perform automated interface tests in a browser. These tests run as part of the release workflow and verify that the application functions as expected. Teams should use [Jest](https://jestjs.io/) to implement unit and integration tests.

#### Backend

The backend is also implemented in **TypeScript**, using the [Node.JS](https://nodejs.org/en/about/) framework. By using the same programming language in the frontend and backend, we can share code, e.g. types and validation. The work becomes more efficient, with fewer developer roles since more developers can work on both sides. Node.JS also has a large and active open-source community, with mature code libraries covering most needs.

Backend servers should provide a [GraphQL](https://graphql.org/) interface for frontend clients. It defines a schema that describes all the available data and operations. Whenever possible, the schema should represent an idealised world independent of implementation details. When designed well, it is possible to replace backend systems without changing the schema or frontend.

GraphQL provides better separation between the frontend and backend. In one GraphQL query, the frontend can ask for everything it requires. The GraphQL server calls web services and databases as needed to resolve the query, and the result contains only the data that the frontend requested.

If the backend contains a lot of complexity or stores data in a database, teams should consider implementing it as a special REST microservice that the GraphQL server wraps.

## Values

With centralized development and strict values, we can improve our service level, make development teams more efficient and save money with centralized experience and implementations.

These values apply to all of Digital Iceland's development under the Ísland.is brand.

### Accessibility

All websites and digital government services need to be accessible to all users. Teams should be knowledgeable about accessibility standards like the Web Content Accessibility Guidelines (WCAG) and should aim for Level AAA of WCAG version 2.1 when working on Ísland.is solutions.

All solutions built for Ísland.is will be audited according to the [Commission Implementing Decision (EU) 2018/1524](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32018D1524&from=EN) (Accessibility of websites)1. The decision includes requirements to periodically test user interfaces with automatic accessibility tests and manual audits for critical interfaces. Additionally, it emphasizes an efficient reporting system where users can report accessibility issues which we address quickly and securely.

You can find more information about the government's website accessibility policy from [the Government of Iceland](https://www.stjornarradid.is/verkefni/upplysingasamfelagid/opinberir-vefir/adgengisstefna/).

Teams should test web interfaces and ensure they work on different devices and in all browsers with more than 1% usage in Iceland, according to StatCounter.

### Developer Environment

With centralized solutions, we need to create and maintain a development environment that facilitates rapid development with multiple teams.

Coding standards, automatic formatting and linting tools help developers write similar code. Automated tests give us confidence that existing business logic works as intended. Feature deployments give designers, testers and other stakeholders access to verify that a change is good and working correctly.

The development environment should help new projects, and new developers get started, with clear documentation, setup guides and development servers (e.g. with [Docker](https://www.docker.com/resources/what-container)). It's essential to grant developers access to test services and data, but also a secure authorization system and workflows when it comes to more sensitive secrets and data.

### Free and Open-Source Software (FOSS)

Digital Iceland dedicates to develop new software in a free and open-source way, whenever possible. Building solutions using FOSS lowers the total cost of operations and gives more parties access to contribute to the project. That leaves vendors on equal footing when it comes to maintenance and further development.

FOSS applies especially to pieces of reusable software that can prove useful for other organisations and corporations. E.g. UI components and integrations for our authentication system and Straumurinn (Iceland's X-Road data transfer layer).

Open-sourcing promotes better documentation across the board, which is especially crucial for Digital Iceland and it's teams, as well as external contributors. By supporting external contributions, we can increase the quality of our solutions in many ways, e.g. with better accessibility, translations, browser compatibility and security.

All code used by Digital Iceland needs to have permissive open-source licenses. Vendors agree to release all rights to their work so Digital Iceland can publish it with an open-source license (i.e. the MIT license for code and CC BY 4.0 for documentation).

See more information about FOSS on [the Government of Iceland website](https://www.stjornarradid.is/verkefni/upplysingasamfelagid/stafraent-frelsi/opinn-hugbunadur/).

### Hosting Environment

When we create centralized solutions, we assume more responsibility for keeping systems running and services operational. To handle this responsibility, we need holistic monitoring, alerts and call system, as well as operational dashboards that provide an overview for the whole system. We will also create a status page that is open to the public, to increase transparency, accountability and communications when users encounter operational issues.

By maintaining an incident log and performing root cause analysis, we can implement the fixes needed, in both internal and external systems, to prevent recurrence of production issues.

Digital Iceland will embrace cloud hosting for its solutions. Cloud hosting increases operational stability by hosting backend solutions with high availability on virtualized computers and operating systems. When one computer stops working, another starts automatically. When we receive increased demand, we can spread it on more computers with minimal or no human intervention.

### Localisation

All of Digital Iceland's solutions should have localisation support built-in, with content available in Icelandic and other languages depending on the context.

Digital Iceland looks to the European regulation [Single Digital Gateway](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32018R1724)1 when it comes to translating content and services. The directive declares services that are relevant to people crossing borders should be available in languages that cover most of its users. In our case, these services will be at least available in Icelandic and English.

### Performance

Research shows that performance is a critical factor for user experience in digital services. Users expect websites to load in two seconds, and after three seconds, [up to 40% of users will abandon the site](http://bit.ly/1ttKspI). As we develop more comprehensive solutions with more services, it is easy to end up with subpar performance.

Digital Iceland will set clear performance goals and encourage periodic performance tests to measure and improve overall performance. These goals apply to page load and interactions on desktop and mobile, API responses, X-Road and more.

### User-centered design

Design solutions with a focus on User Experience (UX). Digital Iceland plans to release a design guide that covers this in more detail. Until then, here are a few things to keep in mind:

- Include designers, UX specialists and testers in the project from the beginning.
- Consider the user in all parts of design and development with personas and user stories.
- Create prototypes and perform user testing to verify the design.
- Design the backend to serve the UX rather than the other way around. Try to overcome system limitation when they hurt the user experience.

### Security

Since Ísland.is solutions will process sensitive, Personally Identifiable Information (PII), it is crucial to have security at the forefront at all stages of development.

Teams should be familiar with the vulnerabilities and attacks documented in the Open Web Application Security Project (OWASP). Digital Iceland will look to the ISO 27001 family of standards when it comes to hosting and operations and requires vendors to perform in-house security assessments.

There will be regular monitoring of all solutions developed by Digital Iceland with security assessments and audits performed by a third party to prevent unforeseen vulnerabilities. Digital Iceland will follow the latest security policies published by the Security Council of the Ministry of Transport and Local Government.

1 The directive or regulation is not yet part of the EEA Agreement.
