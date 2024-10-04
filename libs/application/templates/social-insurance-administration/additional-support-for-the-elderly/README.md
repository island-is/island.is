# Additional Support for the Elderly

## Description

This application template allows applicants to apply for additional elderly support.

### States

#### Prerequisites

A temporary state for new applications, unlisted with a short lifespan.

**Purpose:** Ensure applicants meet criteria. It includes an external data check from Þjóðskrá and TR. Applicants must be 67+, domiciled in Iceland, and not pensioners with 90%+ social security rights to proceed.

#### Draft

Eligible applicants fill in relevant data here.

#### Tryggingastofnun Submitted

Applications are submitted to TR. Editing is still allowed.

#### Tryggingastofnun In Review

TR begins review in this state. Editing is disabled.

#### Additional Document Required

State changes here if more documents are needed. Applicants can add these documents.

#### Approved

Application is approved by TR.

#### Rejected

Application is rejected by TR.

### Localisation

Available on Contentful.

- [Application translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/asfte.application)
- [System translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

Update Contentful with new text strings in `messages.ts`. See [message extraction guide](../../../../localization/README.md#message-extraction).

## Setup

Refer to the [application-system setup](../../../../../apps/application-system/README.md) for setup guidance.

Navigate to [http://localhost:4242/umsoknir/felagslegur-vidbotarstudningur](http://localhost:4242/umsoknir/felagslegur-vidbotarstudningur) for development access.

