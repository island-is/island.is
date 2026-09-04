import {
  Checkbox,
  FormControl,
  Select,
  Stack,
} from '@contentful/f36-components'

import type {
  CalculatorFieldSection,
  CalculatorLocalizedText,
  CalculatorSectionToggle,
} from '@island.is/tax-calculators'

import { LocalizedTextFields } from './LocalizedTextFields'

interface Props {
  toggle?: CalculatorSectionToggle
  gate?: CalculatorFieldSection['gate']
  otherToggles: CalculatorSectionToggle[]
  onEnable: () => void
  onDisable: () => void
  onSelectGate: (toggleKey: string) => void
  onLabelChange: (label: CalculatorLocalizedText | undefined) => void
  onToggleDisableOnly: () => void
}

// A section is either controlled by a toggle it owns (the switch reveals it) or
// by one another section owns (the vehicle-tax design greys out Bílnúmer while
// "Slá inn þyngd og losun" is on) -- never both, so one checkbox covers the
// pair.
export const SectionToggleControl = ({
  toggle,
  gate,
  otherToggles,
  onEnable,
  onDisable,
  onSelectGate,
  onLabelChange,
  onToggleDisableOnly,
}: Props) => {
  const isControlled = Boolean(toggle || gate)

  return (
    <Stack flexDirection="column" alignItems="stretch" spacing="spacingXs">
      <Checkbox
        isChecked={isControlled}
        onChange={() => (isControlled ? onDisable() : onEnable())}
      >
        Controlled by a toggle switch
      </Checkbox>

      {isControlled && (
        <>
          {otherToggles.length > 0 && (
            <FormControl marginBottom="none">
              <FormControl.Label>Toggle switch</FormControl.Label>
              <Select
                value={gate?.toggle ?? ''}
                onChange={(ev) => onSelectGate(ev.target.value)}
              >
                <Select.Option value="">
                  New toggle switch, revealing this section
                </Select.Option>
                {otherToggles.map((other) => (
                  <Select.Option key={other.key} value={other.key}>
                    {other.label.is || '(unlabelled toggle)'}
                  </Select.Option>
                ))}
              </Select>
            </FormControl>
          )}

          {toggle && (
            <LocalizedTextFields
              label="Toggle label"
              value={toggle.label}
              onChange={onLabelChange}
            />
          )}

          {gate && (
            <Checkbox
              isChecked={Boolean(gate.disableOnly)}
              onChange={onToggleDisableOnly}
            >
              Grey out instead of hiding
            </Checkbox>
          )}
        </>
      )}
    </Stack>
  )
}
