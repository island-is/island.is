import type { ZodIssue } from 'zod'

import type { Locale } from '@island.is/shared/types'
import type { CalculatorConfig } from '@island.is/tax-calculators'
import { collectInputFieldKeys } from '@island.is/tax-calculators'
import type { TaxCalculatorType } from '@island.is/web/graphql/schema'

import type { InputFieldContract, OutputFieldContract } from './contract'
import {
  collectOutputConfigIssues,
  collectOutputLabelledRows,
} from './outputDiagnostics'
import type { CalculatorLabelledRow } from './text'
import { localized } from './text'

const isDevelopment = () => process.env.NODE_ENV !== 'production'

export const collectUnlabelledKeys = (
  config: CalculatorConfig,
  locale: Locale,
): string[] => {
  const rows: CalculatorLabelledRow[] = [
    ...config.inputSections.flatMap((section) =>
      section.fields.map((field) => ({ key: field.key, label: field.label })),
    ),
    ...collectOutputLabelledRows(config),
  ]

  return [
    ...new Set(
      rows.filter((row) => !localized(row.label, locale)).map((row) => row.key),
    ),
  ]
}

export const collectUnplacedRequiredKeys = (
  config: CalculatorConfig,
  contract: InputFieldContract,
): string[] => {
  const placed = new Set(collectInputFieldKeys(config))

  return [...contract.values()]
    .filter((field) => field.required && !placed.has(field.key))
    .map((field) => field.key)
}

export const collectStaleInputKeys = (
  config: CalculatorConfig,
  contract: InputFieldContract,
): string[] => [
  ...new Set(collectInputFieldKeys(config).filter((key) => !contract.has(key))),
]

export const reportConfigParseIssues = (
  slice: string,
  issues: readonly ZodIssue[],
) => {
  if (!isDevelopment() || issues.length === 0) return

  console.warn(
    `Calculator slice "${slice}": configJson did not parse, so the slice renders nothing:\n${issues
      .map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')}`,
  )
}

interface ContractDiagnosticsInput {
  calculatorType: TaxCalculatorType
  config: CalculatorConfig
  inputContract: InputFieldContract
  outputContract: OutputFieldContract
  locale: Locale
}

export const reportContractDiagnostics = ({
  calculatorType,
  config,
  inputContract,
  outputContract,
  locale,
}: ContractDiagnosticsInput) => {
  if (!isDevelopment()) return

  const prefix = `Calculator "${calculatorType}":`
  const warn = (message: string, keys: string[]) => {
    if (keys.length > 0)
      console.warn(`${prefix} ${message}: ${keys.join(', ')}`)
  }

  warn(
    'required fields are in no section and will not render',
    collectUnplacedRequiredKeys(config, inputContract),
  )
  warn(
    'configured fields are absent from the calculator and are omitted',
    collectStaleInputKeys(config, inputContract),
  )
  warn(
    'configured fields have no label and are omitted from public rendering',
    collectUnlabelledKeys(config, locale),
  )

  const output = collectOutputConfigIssues(config, outputContract)

  warn(
    'configured output fields are absent from the calculator',
    output.staleFieldKeys,
  )
  warn(
    'output fields carry an itemFields block but are not arrays',
    output.itemFieldsOnScalarKeys,
  )
  output.staleItemFieldKeys.forEach(({ fieldKey, itemKeys }) =>
    warn(`configured item fields of "${fieldKey}" are absent`, itemKeys),
  )
}

/* `message` is developer-facing English, deliberately never rendered -- it is
 * neither localized nor stable, and `code` is the contract the renderer
 * switches on. This is the one place it is read, so that a calculation RSK
 * refused says something specific in a development console.
 *
 * Called from the submit handler rather than from an effect: it fires once per
 * response, which StrictMode does not repeat. */
export const reportCalculationErrors = (
  calculatorType: TaxCalculatorType,
  errors: readonly { code: string; key?: string | null; message: string }[],
) => {
  if (!isDevelopment() || errors.length === 0) return

  errors.forEach(({ code, key, message }) =>
    console.warn(
      `Calculator "${calculatorType}": calculation rejected [${code}]${
        key ? ` on "${key}"` : ''
      }: ${message}`,
    ),
  )
}
