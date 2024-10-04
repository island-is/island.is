# Old Age Pension

## Description

This application template enables applicants to apply for an old age pension.

![Application Process Flow](../core/assets/tr-applications-flow-chart.png)

### States Overview

#### Prerequisites

A temporary, unlisted state meant for new applications with a short lifespan. It acts as a gateway into the main application process. Applicants select their pension type (standard, half, or sailor's pension) and receive introductory information about the process and data collection by TR. An external step retrieves data from Þjóðskrá and TR. A mandatory question asks if all pension funds have been applied for. Applicants cannot proceed if they are already pensioners, have pending applications, or have not applied for all pension funds.

#### Draft

Eligible applicants start the application process here, providing all necessary information.

#### Tryggingastofnun Submitted

The application reaches this state once submitted to TR and remains editable.

#### Tryggingastofnun In Review

TR assigns this state when reviewing begins. The application becomes non-editable.

#### Additional Document Required

If more documents are needed, TR changes the state here, allowing applicants to upload missing items.

#### Approved

TR approves the application.

#### Rejected

TR rejects the application.

### Localisation

Localization details are maintained in Contentful:

- [Old age pension application translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/oap.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

Always update Contentful when adding new text in the `messages.ts` file. Refer to [message extraction](../../../../localization/README.md#message-extraction).

## Setup

Refer to [application-system setup](../../../../../apps/application-system/README.md) to get started.

After setup, access [http://localhost:4242/umsoknir/ellilifeyrir](http://localhost:4242/umsoknir/ellilifeyrir) to begin development.

