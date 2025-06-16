# Payments service

This service handles the creation and fetching of payment flows

Payment flows are initialised by either processes (like an application from the application system) or people working for organizations.

Payment flows are fetched by the payments web app (apps/payments) and rendered to the end user.

## Gotchas

When integrating to create a payment flow, be sure to check the Organization model in Contentful and make sure "kennitala" is not empty. This model is used to fetch the name and logo of the organization in the payment flow.
