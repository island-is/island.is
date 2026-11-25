# application-templates-transport-authority-transfer-of-vehicle-ownership

This library was generated with [Nx](https://nx.dev).

## Review and approval

- In `review` the buyer, the buyer's co-owners and operators, and the
  seller's co-owners must approve.
- An approval counts only when the server records it. On `APPROVE` the
  state machine adds `{ nationalId, role }` for the logged-in user to the
  `approvedBy` answer (`src/utils/approvals.ts`). No role can write
  `approvedBy`, and each reviewer's `approved` flag is re-synced from it.
  Someone whose role changes, or who replaces another reviewer, must approve
  again.
- `approvedBy` is reset when the application enters `review` from `payment`.
- An approval from a buyer co-owner or operator is tied to its row in
  `buyerCoOwnerAndOperator`. Answer saves do not go through the state
  machine, so in `review` an answer validator only lets the buyer add rows
  or remove them: rows cannot be dropped or restored, and an approved row
  keeps its person and role. Someone who is removed and added again gets a
  new row and must approve again. A row also cannot be saved as `approved`
  unless the server has recorded that approval.
- `SUBMIT` in `review` moves to `completed` only when every current reviewer
  has approved.
- Applications that entered `review` before `approvedBy` existed fall back to
  the `approved` flags.
- In `review` the seller and the other reviewers can only write `rejecter`.
  The buyer can write their co-owners and operators, main operator,
  insurance and `rejecter`.

## Decisions

- **The seller keeps `SUBMIT` in `review` (24.11.2026).** It was opened so an
  application stuck in review, where every reviewer has approved but the
  submit to Samgöngustofa failed, can be pushed through with "Reyna aftur".
  It is used about 416 times a year, so it stays, guarded by the approval
  check above instead of being removed.

## Running unit tests

Run `nx test application-templates-transport-authority-transfer-of-vehicle-ownership` to execute the unit tests via [Jest](https://jestjs.io).
