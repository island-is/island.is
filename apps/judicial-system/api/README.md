# Getting started

## Running locally

You can serve this service locally by running:

`yarn nx serve judicial-system-api --ssl`

You can skip `--ssl` but then authentication through innskraning.island.is will not work.

To skip authentication at innskraning.island.is navigate to

`/api/auth/login?nationalId=<national id>`

in the web project where `<national id>` is the national id of a known user.

## Graphql playground

Visit

`localhost:3333/api/graphql`
