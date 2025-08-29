# Activation Allowance (Virknistyrkur) application for the Directorate of Labor

## Description

## URLs

- [Local](http://localhost:4242/umsoknir/virknistyrkur)
- [Dev](https://beta.dev01.devland.is/umsoknir/virknistyrkur)
- [Production](https://island.is/umsoknir/virknistyrkur)

## Clients and template-api-modules

- [Client](https://github.com/island-is/island.is/tree/main/libs/clients/vmst-unemployment/src/lib/vmstUnemploymentClient.service.ts)
- [Template-api-module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/activation-allowance')

## States

### Prerequisite

Data fetching from National Registry, User profile, RSK and Social Insurance Administration

### Terms

Short state where user has to agree to Directorate of Labor's terms

### Draft

#### User information screen

Basic user information presented in readonly for user to confirm along with input fields for place of residence if it differs from your legal home and a "password" meant for phone call use if Directorate of Labor calls.
Followed by a short user contact screen where user can either mark themselves as contact or input another person as their contact

#### Bank information screen

Required fields to input bank number, ledger and account number. validated via custom component because we need to check external data if bank number and ledger exist.

#### Optional income screen

This screen is optional if and only if user has registered income in the last 2 month from RSK.

#### Job wishes screen

Simple screen where user can (optionally) pick ESCO job wishes.

#### Job history screen

Another optional set of input where user can input history of jobs

#### Academic history screen

Users academic history. This is also optional like the previous two screens.

#### Driving licenses screen

Users driving and machine licenses. Optional like the previous three screens.

#### Language skills screen

Required to answer English and Icelandic language skills with the option to add other languages

#### CV screen

User can optionally upload a CV

#### Overview screen

Typical overview of the applications data.

### Completed

Information of what happens next, process is now in Directorate of Labor's hands.

## Localisation

All localisation can be found on Contentful.

- [Activation Allowance translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/aa.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

## Test users

- **Gervimaður Bretland 010130-2429**
- **Gervimaður Færeyja 01030-2399**
- **Tómas Tinni 020684-1439**

## Codeowners

- [Origo](https://github.com/orgs/island-is/teams/origo)
  - [Baldur Óli](https://github.com/Ballioli)
