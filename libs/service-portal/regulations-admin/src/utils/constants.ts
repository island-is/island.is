import { RegulationType } from '@island.is/regulations'

/** List of labelled regulation types.
 *
 * Fit for use in Select boxes
 */
export const regulationTypes: Array<{
  label: string
  value: RegulationType
}> = [
  { label: 'Stofnreglugerð', value: 'base' },
  { label: 'Breytingareglugerð', value: 'amending' },
]
