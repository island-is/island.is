import { FormControl, Select, Stack, Subheading } from '@contentful/f36-components'

import type { CalculatorOutputTotal } from '@island.is/tax-calculators'

import { OutputFieldContract } from '../types'
import { LocalizedTextFields } from './LocalizedTextFields'

interface Props {
  total: CalculatorOutputTotal
  contract: OutputFieldContract
  isLoading: boolean
  isDisabled?: boolean
  issues?: string[]
  onChange: (patch: Partial<CalculatorOutputTotal>) => void
}

export const OutputTotalEditor = ({
  total,
  contract,
  isLoading,
  isDisabled,
  issues,
  onChange,
}: Props) => {
  const isMissing = Boolean(total.key) && !contract.get(total.key)
  const isStaleKey = isMissing && !isLoading
  const hasKeyError = !total.key || isStaleKey
  const hasLabelError = !total.label?.is?.trim()

  return (
    <Stack
      flexDirection="column"
      alignItems="stretch"
      spacing="spacingS"
      style={{ border: '1px solid #d3dce0', borderRadius: 6, padding: 16 }}
    >
      <Subheading marginBottom="none">Result total</Subheading>

      <FormControl
        isRequired
        isInvalid={hasKeyError || Boolean(issues?.length)}
        marginBottom="none"
      >
        <FormControl.Label>Output field</FormControl.Label>
        <Select
          value={total.key}
          isDisabled={isLoading || isDisabled}
          onChange={(ev) => onChange({ key: ev.target.value })}
        >
          <Select.Option value="" isDisabled>
            {isLoading ? 'Loading fields…' : 'Select an output field'}
          </Select.Option>
          {isMissing && (
            <Select.Option value={total.key}>
              {isStaleKey ? `${total.key} — not in this calculator` : total.key}
            </Select.Option>
          )}
          {[...contract.values()].map((candidate) => (
            <Select.Option key={candidate.key} value={candidate.key}>
              {candidate.semantic
                ? `${candidate.key} · ${candidate.type} · ${candidate.semantic}`
                : `${candidate.key} · ${candidate.type}`}
            </Select.Option>
          ))}
        </Select>
        {isStaleKey && (
          <FormControl.ValidationMessage>
            This calculator no longer returns &quot;{total.key}&quot;.
          </FormControl.ValidationMessage>
        )}
        {issues?.map((issue) => (
          <FormControl.ValidationMessage key={issue}>
            {issue}
          </FormControl.ValidationMessage>
        ))}
      </FormControl>

      <FormControl isRequired isInvalid={hasLabelError} marginBottom="none">
        <LocalizedTextFields
          label="Heading"
          value={total.label}
          isDisabled={isDisabled}
          onChange={(next) => onChange({ label: next ?? { is: '' } })}
        />
        {hasLabelError && (
          <FormControl.ValidationMessage>
            The result heading is required.
          </FormControl.ValidationMessage>
        )}
      </FormControl>
    </Stack>
  )
}
