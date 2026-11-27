# Inheritance Report

## Business rules

- **Loan number on debts:** "Auðkenni / Lánsnúmer" is required for every debt
  type except Tryggingastofnun ríkisins, where it is optional. A loan number is
  not needed for debts to Tryggingastofnun, and requiring one led applicants
  to contact Tryggingastofnun for it. Implemented in the
  `debts.domesticAndForeignDebts.data` refine in `src/lib/dataSchema.ts`.
- **Disabled debts:** debts prefilled from Sýslumenn can be disabled. A
  disabled debt is not validated, is left out of the total and the overview,
  and is sent to Sýslumenn with `enabled: false`, the same as disabled assets.
