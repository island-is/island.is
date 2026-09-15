import type { CalculatorConfig } from '@island.is/tax-calculators'
import { collectOutputItemFieldKeys } from '@island.is/tax-calculators'
import { TaxCalculatorOutputFieldType } from '@island.is/web/graphql/schema'

import type { OutputFieldContract } from './contract'
import type { CalculatorLabelledRow } from './text'

/* Pure: no React, no console. The output half of the config is joined to the
 * metadata here so the join is testable on its own, and so the components that
 * will eventually render output values can reuse it unchanged. Warnings are
 * formatted and emitted by `diagnostics.ts` -- this file only finds them. */
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

  /* Deliberately deduped -- `collectOutputFieldKeys` is not used here because
   * the per-field walk below needs each row's own `itemFields`, and a key
   * legally repeats across sections. Every check asks only "is this stale",
   * which is a property of the key, not of the row. */
  const seenFieldKeys = new Set<string>()
  const seenItemFieldKeys = new Set<string>()

  for (const section of config.outputSections) {
    for (const field of section.fields) {
      const contractField = contract.get(field.key)

      if (!contractField) {
        if (!seenFieldKeys.has(field.key)) staleFieldKeys.push(field.key)
        seenFieldKeys.add(field.key)
        continue
      }
      seenFieldKeys.add(field.key)

      if (!field.itemFields?.length) continue

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
      stale.forEach((itemKey) =>
        seenItemFieldKeys.add(`${field.key}.${itemKey}`),
      )

      if (stale.length > 0) {
        staleItemFieldKeys.push({ fieldKey: field.key, itemKeys: stale })
      }
    }
  }

  return { staleFieldKeys, staleItemFieldKeys, itemFieldsOnScalarKeys }
}

/* The output half's contribution to the unlabelled-field check. Emitting no
 * warning of its own is the point: `collectUnlabelledKeys` is the single owner
 * of that warning, so an unlabelled output row is reported once, not twice. */
export const collectOutputLabelledRows = (
  config: CalculatorConfig,
): CalculatorLabelledRow[] =>
  config.outputSections.flatMap((section) =>
    section.fields.flatMap((field) => [
      { key: field.key, label: field.label },
      ...(field.itemFields ?? []).map((itemField) => ({
        key: `${field.key}.${itemField.key}`,
        label: itemField.label,
      })),
    ]),
  )
