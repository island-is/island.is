import type { CalculatorConfig } from '@island.is/tax-calculators'

import { TaxCalculatorOutputFieldType } from '../../../graphql/schema'
import type { InputFieldContract, OutputFieldContract } from './contract'

export const hasMetadataValidationError = (
  config: CalculatorConfig,
  inputContract: InputFieldContract,
  outputContract: OutputFieldContract,
) => {
  const placedInputKeys = new Set(
    (config.inputSections ?? []).flatMap((section) =>
      section.fields.map((field) => field.key).filter(Boolean),
    ),
  )

  if (
    [...inputContract.values()].some(
      (field) => field.required && !placedInputKeys.has(field.key),
    )
  ) {
    return true
  }

  if (
    (config.inputSections ?? []).some((section) =>
      section.fields.some((field) => field.key && !inputContract.has(field.key)),
    )
  ) {
    return true
  }

  return (config.outputSections ?? []).some((section) =>
    section.fields.some((field) => {
      if (field.kind !== 'value' || !field.key) return false
      const metadata = outputContract.get(field.key)
      if (!metadata) return true
      const itemFields = field.itemFields ?? []
      if (itemFields.length === 0) return false
      if (metadata.type !== TaxCalculatorOutputFieldType.Array) return true
      const allowedKeys = new Set(
        (metadata.itemFields ?? []).map((item) => item.key),
      )
      return itemFields.some((item) => item.key && !allowedKeys.has(item.key))
    }),
  )
}
