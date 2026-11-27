# Inheritance Report

## Business rules

- **Loan number on debts:** "Auðkenni / Lánsnúmer" is required for every debt
  type except Tryggingastofnun ríkisins, where it is optional. A loan number is
  not needed for debts to Tryggingastofnun, and requiring one led applicants
  to contact Tryggingastofnun for it. Implemented in the
  `debts.domesticAndForeignDebts.data` refine in `src/lib/dataSchema.ts`.
