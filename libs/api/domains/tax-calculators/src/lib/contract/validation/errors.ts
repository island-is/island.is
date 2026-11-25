import type { CalculatorKey } from '@island.is/clients/rsk/calculators'

/* Contract-definition violation. Throwing prevents a malformed contract from
 * being published. */
export const fail = (calculatorKey: CalculatorKey, message: string): never => {
  throw new Error(
    `Unpublishable tax calculator contract for ${calculatorKey}: ${message}`,
  )
}
