# Medical and Rehabilitation Payments Application Template

This template was generated via `nx generate-template medical-and-rehabilitation-payments` and provides a scaffold for submitting medical and rehabilitation payment requests to the Social Insurance Administration (TR).

## Description

- This application template allows applicants to submit an application for medical and rehabilitation payments with Social Insurance Administration (TR)
- Gervimenn that can use this application are e.g. Rögnvaldur, tel: 311-1439

### States

#### Prerequisites

This state is a temporary state that all new medical and rehabilitation applications will be created in. It has a short lifespan and is unlisted.

The purpose of this state is to be a guard into the actual application. There is an external data step which fetches data from island.is and TR.

#### Draft

Valid applicants will be able to advance to this state where they can start filling in their details and answering a self-assesment questionnaire.

#### Approved (Processed)

The application has been processed by TR.

## Running unit tests

Run `nx test application-templates-social-insurance-administration-medical-and-rehabilitation-payments` to execute the unit tests via [Jest](https://jestjs.io).
