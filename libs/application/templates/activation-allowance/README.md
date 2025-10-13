# Activation Allowance (Virknistyrkur) application for the Directorate of Labor

## Description

## URLs

- [Local](http://localhost:4242/umsoknir/virknistyrkur)
- [Dev](https://beta.dev01.devland.is/umsoknir/virknistyrkur)
- [Production](https://island.is/umsoknir/virknistyrkur)

## Clients and template-api-modules

- [Client](https://github.com/island-is/island.is/tree/main/libs/clients/vmst-unemployment/src/lib/vmstUnemploymentClient.service.ts)
- [Template-api-module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/activation-allowance)

## States

### Prerequisite

Data is fetched from the National Registry, user profile, RSK, and the Social Insurance Administration.

### Terms

Short state where user has to agree to Directorate of Labor's terms

### Draft

#### User information screen

Basic user information is presented in read-only mode for the user to confirm, along with input fields for place of residence if it differs from their legal residence, and a "password" meant for phone-call verification if the Directorate of Labor calls.
This is followed by a short user-contact screen where the user can either mark themselves as the contact or input another person as their contact.

Note that this password is exclusively uses for phone call verification and is not sensitive like a login password etc. that is why there is no encryption.

#### Bank information screen

Required fields to input bank number, ledger, and account number. Validated via a custom component because we need to check external data to verify that the bank number and ledger exist.

#### Optional income screen

This screen is optional only if the user has registered income in the last 2 months with RSK.

#### Job wishes screen

Simple screen where user can (optionally) pick ESCO job wishes.

#### Job history screen

Another optional set of inputs where the user can enter job history

#### Academic history screen

The user's academic history. This is also optional, like the previous two screens.

#### Driving licenses screen

The user's driving and machinery licenses. Optional, like the previous three screens.

#### Language skills screen

Required to answer questions about English and Icelandic language skills, with the option to add other languages

#### CV screen

User can optionally upload a CV

#### Overview screen

Typical overview of the applications data.

### Completed

Information about what happens next; the process is now in the Directorate of Labor's hands

## Localisation

All localisation can be found on Contentful.

- [Activation Allowance translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/aa.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

## Test users

These are users with partial disability (26-50%) which allows them to apply.
Note that this can change if TR changes their disability status etc.

- **Gervimaður Bretland 010130-2429**
- **Gervimaður Færeyja 01030-2399**
- **Tómas Tinni 020684-1439**

## Codeowners

- [Origo](https://github.com/orgs/island-is/teams/origo)
  - [Baldur Óli](https://github.com/Ballioli)
