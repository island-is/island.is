# housing-benefits

This application allows users to apply for housing benefits to HMS. The application fetches if tax returns have been filed, users children, rental agreements and more.

Everyone that is registered as a household member has to approve datafetching and fill out needed info. Assignees see different forms by role-transitioning to mimic a prereq->draft->done statemachine without state transfering the application.
This way many assignees can simultainiously fill out the same application.

Orignal applicant has to finally submit the application to HMS where it's processed. HMS Can approve, reject and ask for additional information.

The application goes to a dead end if the tax return has not been filed. There is also a no-contract state but you can get out of it if you apply for an exemption

## Gervimenn

You can use any gervimaður that has a lögheimili in Iceland, Eðvarð (130-1479) for example. Rental agreements have to be mocked, or contact HMS to create a dev rental agreement.

## Running unit tests

Run `nx test housing-benefits` to execute the unit tests via [Jest](https://jestjs.io).
