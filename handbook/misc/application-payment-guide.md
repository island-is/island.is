# Guide: Adding a Payment Step to an Application

This document describes how you can go about implementing a payment step in an application
template library.

### Notes:

- You might want to skip down to the [FAQ](#faq--glossary) section and familiarize yourself with some of the
  terms used here.
- Payments in the applications were implemented pretty hastily, and the whole thing
  really should be refactored and updated to make it easier to reuse.

## Prerequisites

Payments in the application system are fully processed and paid for in the account of the
institution accepting the payment. This means you need to know:

- What the charge item code is of the fee you want to charge.
- What the national ID is of the institution accepting the payment
- You need to have the x-road proxy running

## Overview / User flow

So the payment flow goes as follows:

1. First an application needs to get the prices of the fee(s) it intends to charge
2. Then an aplication needs to create the charge in FJR's API, and create a DB entry
   for the application payment.
3. FJR's API responds with a document ID, which we use to create URL to send the user to
4. Once they have paid in the ARK quick pay UI it takes a few seconds for us to know,
   so the user gets redirected to your application again, where they wait for the payment
   to be completed.
5. In order for the payment to be marked as paid, FJR's servers will query the island.is
   x-road API with the ID of the charge and payment ID that was created earlier
6. The charge gets marked as completed, and the UI thus gets updated, and in our case we
   then programmatically submit the application from the user's perspective.
7. As the very last step the api action should check for whether the intended payment
   was indeed successfully paid.

## Implementation

Best thing you can do is look at the driving license application state management for figuring
out how to implement payments. Here comes a brief overview of the main parts:

### 1. FeeInfoProvider

First step is to figure out what fee to charge. There's a graphql query you can use to
retrieve the charges. In the DLA we implemented a `FeeInfoProvider`, extending a
`PaymentCatalogProvider` that returns the exact charge item codes we want to use along with
the prices.

```typescript
export class FeeInfoProvider extends PaymentCatalogProvider {
  type = 'FeeInfoProvider'

  async provide(): Promise<PaymentCatalogItem[]> {
    const items =
      (await this.getCatalogForOrganization(SYSLUMADUR_NATIONAL_ID)) || []

    return items.filter(({ chargeItemCode }) =>
      CHARGE_ITEM_CODES.includes(chargeItemCode),
    )
  }
```

### 2. Payment states

The easiest way to block steps and guarantee that you always end up on the right step for
us was to implement the payment pending stage of the application as its own state in the
application.

This payment stage has an onEntry and onExit hooks that we use to trigger the appropriate
api actions on the application. This step also has a custom component that listens for
updates to the payment that was created and charged. Both of those are specific calls for
the driving license application, so for now you'd need to create similar api actions for
creating the charge and handling the post-payment stage.

```typescript
  [States.PAYMENT]: {
    meta: {
      ...etc,
      onEntry: {
        apiModuleAction: ApiActions.createCharge,
      },
      onExit: {
        apiModuleAction: ApiActions.submitApplication,
      },
      ...etc,
  },
```

### 3. Insuring payment has been completed

Both in terms of past-application history compatibility and in terms of absolute safety
that something unpaid doesn't go, we'd recommend that you check whether the application
payment has been fulfilled in your final application submission step.

```typescript
  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { answers } = application
    const nationalId = application.applicant

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (isPayment.fulfilled) {
      const result = await this.submitSomethign(nationalId, answers)
      // etc
    }
```

## FJS / Fjarsýsla ríkisins API

FJS has an openAPI document for their API, however the definition is not yet in x-road.

Reference: https://island.is/s/stafraent-island/vefthjonustur/SVNfR09WXzU0MDI2OTc1MDlfRkpTLVB1YmxpY19jaGFyZ2VGSlNfdjE

## FAQ / glossary

- **FJR** = Fjársýsla Ríkisins - They handle all billing and accounting for most of the
  government institutions in Iceland.
- **Charge item code** - Identifier used by FJR to identify different types of fees. All
  charge item codes have a price, an owner, category etc. Eg. `AY114` is the charge item code
  for a fee that you need to pay for the driving license application.
- **ARK** = Payment gateway for the government instituions - a part of that is _Ark Quick Pay_,
  which is a standalone UI flow for performing the payment.
- **Greiðslumiðlun** = Institution/company owned by Seðlabankinn responsible for ARK

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/kosmos-kaos/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
