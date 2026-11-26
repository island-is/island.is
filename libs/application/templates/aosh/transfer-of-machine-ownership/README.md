# application-templates-aosh-transfer-of-machine-ownership

This library was generated with [Nx](https://nx.dev).

## Review and approval

- In `review` only the buyer can approve (`SUBMIT`) or reject (`REJECT`).

## Decisions

- **The seller sends no event in `review` (24.11.2026).** The seller's
  `SUBMIT` action, added in #24214, was removed. The seller's review form is
  a static conclusion page that never sends it, so it only let the seller
  complete the transfer through the API without the buyer's approval.

## Running unit tests

Run `nx test application-templates-aosh-transfer-of-machine-ownership` to execute the unit tests via [Jest](https://jestjs.io).
