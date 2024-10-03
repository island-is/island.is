# Zendesk Client

## About

This is used to connect to a Zendesk API by using the subdomain such as `http://{subdomain}.zendesk.com/api/v2` using an API token created by a Zendesk admin.

Add these values to your .env or .env.secret file to try it out locally.

```bash
export ZENDESK_CONTACT_FORM_EMAIL={your_zendesk_email}
export ZENDESK_CONTACT_FORM_TOKEN={your_zendesk_token}
export ZENDESK_CONTACT_FORM_SUBDOMAIN={your_zendesk_subdomain}
```

## Running unit tests

Run `nx test clients-zendesk` to execute the unit tests via [Jest](https://jestjs.io).
