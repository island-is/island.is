# [DEPRECATED] Gjafakort

This project should be considered as deprecated and should only be updated with
bugfixes.

## About

Registers a user as a participant in Ferðagjöf by creating a gift in the Yay
system.

The webpage supports the same functionality as the Ferðagjöf app. Like using the
gift and giving another user your gift.

## URLs

- [Dev](https://gjafakort.dev01.devland.is)
- [Staging](https://gjafakort.staging01.devland.is)
- [Production](https://ferdagjof.island.is)

Next start the **api** and **web** with:

## Application

Start all services related to the web application with:

```bash
make services
```

## API

```bash
make api
```

## Web

Visit [http://localhost:4200/](http://localhost:4200/) to view the application.

```bash
make web
```

## Queue listener

TODO

### User Frontend

The user frontend has information about the initiative, legal terms, a way for users to register for Ferðagjöf and use their Ferðagjöf.

[Dev](https://gjafakort.dev01.devland.is)

### Company Frontend

The company frontend has information about the initiative, legal terms, a way for companies to register to take part in Ferðagjöf.

By registering they will be created in [Ferðamálastofnun](https://ferdalag.is) and [Yay](https://yay.is).

[Fyrirtæki](https://gjafakort.dev01.devland.is/fyrirtaeki)

## Integrations

- [Ferðamálastofnun](https://ferdalag.is): To register companies in their database, their website is the main place to view what companies are a part of Ferðagjöf.
- [Yay](https://yay.is): To manage gifts. The Yay system has a way to distribute gifts to users and a backend for companies to use those gifts.
- [Skatturinn](https://rsk.is): To get basic information about companies and verify that they are eligible to take part in Ferðagjöf.
- [Nova](https://nova.is): To send SMS in order to confirm phone numbers.

## Shortcuts

This project had a very short timeline and will be thrown out eventually. There
were a lot of shortcuts taken as this was the first project developed and not
much infrastructure ready to use.

## Project owner

- [Stafrænt Ísland](https://stafraent.island.is)

## Code owners and maintainers

- [Brian - @barabrian](https://github.com/barabrian)
- [Davíð Guðni - @dabbeg](https://github.com/dabbeg)
- [Darri Steinn - @darrikonn](https://github.com/darrikonn)
