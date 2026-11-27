# application-templates-transport-authority-change-operator-of-vehicle

This library was generated with [Nx](https://nx.dev).

## Review and approval

- In `review` the owner's co-owners and the new operators must approve.
  Removing an operator from a vehicle with no co-owners skips `review`.
- An approval counts only when the server records it. On `APPROVE` the
  state machine adds `{ nationalId, role }` for the logged-in user to the
  `approvedBy` answer (`src/utils/approvals.ts`). No role can write
  `approvedBy`, and each reviewer's `approved` flag is re-synced from it.
  Someone whose role changes, or who replaces another reviewer, must approve
  again.
- `approvedBy` is reset when the application enters `review` from `payment`.
- `SUBMIT` in `review` moves to `completed` only when every current reviewer
  has approved.
- Applications that entered `review` before `approvedBy` existed fall back to
  the `approved` flags.
- In `review` the owner can write nothing and the reviewers can only write
  `rejecter`.

## Decisions

- **The owner keeps `SUBMIT` in `review` (24.11.2026).** It was opened so an
  application stuck in review, where every reviewer has approved but the
  submit to Samgöngustofa failed, can be pushed through with "Reyna aftur".
  It is used about 416 times a year, so it stays, guarded by the approval
  check above instead of being removed.

## Running unit tests

Run `nx test application-templates-transport-authority-change-operator-of-vehicle` to execute the unit tests via [Jest](https://jestjs.io).
