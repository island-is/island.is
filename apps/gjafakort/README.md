# [DEPRECATED] Gjafakort - Ferðagjöf

This project should be considered as deprecated and should only be updated with
bugfixes.

## About

Registers a user as a participant in Ferðagjöf by creating a gift in the Yay
system.

The webpage supports the same functionality as the Ferðagjöf app. Like using the
gift and giving another user your gift.

## Project entrypoints

Dev: [https://gjafakort.dev01.devland.is](https://gjafakort.dev01.devland.is)
Staging: [https://gjafakort.staging01.devland.is](https://gjafakort.staging01.devland.is)
Production: [https://ferdagjof.island.is](https://ferdagjof.island.is)

### User Frontend

The user frontend has information about the initiative, legal terms, a way
for users to register for Ferðagjöf and use their Ferðagjöf.

URL: [https://gjafakort.dev01.devland.is](https://gjafakort.dev01.devland.is)

### Company Frontend

The company frontend has information about the initiative, legal terms, a way
for companies to register to take part in Ferðagjöf.

By registering they will be created in [Ferðamálastofnun](https://ferdalag.is)
and [Yay](https://yay.is).

URL: [https://gjafakort.dev01.devland.is/fyrirtaeki](https://gjafakort.dev01.devland.is/fyrirtaeki)

## Integrations

- [Ferðamálastofnun](https://ferdalag.is): To register companies in their
  database, their website is the main place to view what companies are a part
  of Ferðagjöf.
- [Yay](https://yay.is): To manage gifts. The Yay system has a way to distribute
  gifts to users and a backend for companies to use those gifts.
- [Skatturinn](https://rsk.is): To get basic information about companies and
  verify that they are eligible to take part in Ferðagjöf.
- [Nova](https://nova.is): To send SMS in order to confirm phone numbers.

## Development

Start all services related to the web application with:

```
make services
```

Next start the **api** and **web** with:

```
make api
```

```
make web
```

Visit [http://localhost:4200/](http://localhost:4200/) to view the application.

## Shortcuts

This project had a very short timline and will be thrown out eventually. There
were a lot of shortcuts taken as this was the first project developed and not
much infrastructure ready to use.

## Owner

Stafrænt Ísland owns this system.

## Maintainers

barabrian - Brian
dabbeg - Davíð Guðni
darrikonn - Darri Steinn
