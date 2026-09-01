import { CalculatorConfig } from '@island.is/tax-calculators'

// Persisted: a section's `key` and a field's `uid` are written into the
// entry and referenced by other sections, so this needs real uniqueness,
// not just per-render distinctness.
export const generateKey = () => crypto.randomUUID()

export const createEmptyConfig = (): CalculatorConfig => ({ sections: [] })
