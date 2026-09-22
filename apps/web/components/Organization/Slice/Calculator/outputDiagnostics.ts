import type { CalculatorConfig } from '@island.is/tax-calculators'
import {
  collectOutputItemFieldKeys,
  isOutputValueField,
} from '@island.is/tax-calculators'
import { TaxCalculatorOutputFieldType } from '@island.is/web/graphql/schema'

import type { OutputFieldContract } from './contract'
import type { CalculatorLabelledRow } from './text'

/* Collects CMS and output-contract mismatches. */
export interface OutputConfigIssues {
  /** Configured output keys the calculator's metadata no longer carries. */
  staleFieldKeys: string[]
  /** Configured item keys absent from their array field's `itemFields`. */
  staleItemFieldKeys: { fieldKey: string; itemKeys: string[] }[]
  /** Fields configured with an `itemFields` block that are not arrays. */
  itemFieldsOnScalarKeys: string[]
}

export const collectOutputConfigIssues = (
  config: CalculatorConfig,
  contract: OutputFieldContract,
): OutputConfigIssues => {
  const staleFieldKeys: string[] = []
  const staleItemFieldKeys: { fieldKey: string; itemKeys: string[] }[] = []
  const itemFieldsOnScalarKeys: string[] = []

  /* Deduplicates issues while retaining row-specific item fields. */
  const seenFieldKeys = new Set<string>()
  const seenItemFieldKeys = new Set<string>()

  const valueRows = [
    config.outputTotal,
    ...config.outputSections.flatMap((section) =>
      section.fields.filter(isOutputValueField),
    ),
  ]

  for (const field of valueRows) {
    const contractField = contract.get(field.key)

    if (!contractField) {
      if (!seenFieldKeys.has(field.key)) staleFieldKeys.push(field.key)
      seenFieldKeys.add(field.key)
      continue
    }
    seenFieldKeys.add(field.key)

    if (!('itemFields' in field) || !field.itemFields?.length) continue

    if (contractField.type !== TaxCalculatorOutputFieldType.Array) {
      if (!itemFieldsOnScalarKeys.includes(field.key)) {
        itemFieldsOnScalarKeys.push(field.key)
      }
      continue
    }

    const itemKeys = new Set(
      (contractField.itemFields ?? []).map((itemField) => itemField.key),
    )
    const stale = collectOutputItemFieldKeys(field).filter(
      (itemKey) =>
        !itemKeys.has(itemKey) &&
        !seenItemFieldKeys.has(`${field.key}.${itemKey}`),
    )
    stale.forEach((itemKey) => seenItemFieldKeys.add(`${field.key}.${itemKey}`))

    if (stale.length > 0) {
      staleItemFieldKeys.push({ fieldKey: field.key, itemKeys: stale })
    }
  }

  return { staleFieldKeys, staleItemFieldKeys, itemFieldsOnScalarKeys }
}

/* Supplies output rows to the shared label diagnostic. */
export const collectOutputLabelledRows = (
  config: CalculatorConfig,
): CalculatorLabelledRow[] => [
  { key: config.outputTotal.key, label: config.outputTotal.label },
  ...config.outputSections.flatMap((section) =>
    section.fields.filter(isOutputValueField).flatMap((field) => [
      { key: field.key, label: field.label },
      ...(field.itemFields ?? []).map((itemField) => ({
        key: `${field.key}.${itemField.key}`,
        label: itemField.label,
      })),
    ]),
  ),
]
