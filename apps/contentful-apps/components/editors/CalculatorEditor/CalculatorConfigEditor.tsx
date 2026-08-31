import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  Note,
  Paragraph,
  Select,
  Stack,
  Subheading,
  TextInput,
} from '@contentful/f36-components'
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'

import {
  CalculatorConfig,
  calculatorConfigSchema,
  CalculatorFieldSection,
  CalculatorLocalizedText,
  CalculatorSectionField,
  collectSectionToggles,
} from '@island.is/shared/calculator-config'

// Every piece of editor-authored display text is an inline bilingual pair --
// the backend has no opinion on this text at all, so both languages are
// authored directly here. Kept at module scope (not nested in
// TaxCalculatorConfigField) so its identity is stable across re-renders --
// a component redefined inside a parent's render body gets remounted by
// React on every parent re-render, which drops input focus on every
// keystroke.
const LocalizedTextFields = ({
  label,
  value,
  onChange,
  clearWhenEmpty,
}: {
  label: string
  value?: CalculatorLocalizedText
  onChange: (next: CalculatorLocalizedText | undefined) => void
  /* Drops the whole pair from the config once both languages are blank, so an
   * unset optional text stays absent rather than persisting as `{ is: '' }`. */
  clearWhenEmpty?: boolean
}) => {
  const is = value?.is ?? ''
  const en = value?.en ?? ''

  const update = (nextIs: string, nextEn: string) => {
    if (clearWhenEmpty && !nextIs && !nextEn) {
      onChange(undefined)
      return
    }
    onChange({ is: nextIs, en: nextEn || undefined })
  }

  return (
    <FormControl marginBottom="none">
      <FormControl.Label>{label}</FormControl.Label>
      <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
        <TextInput
          placeholder="Icelandic"
          value={is}
          onChange={(ev) => update(ev.target.value, en)}
        />
        <TextInput
          placeholder="English"
          value={en}
          onChange={(ev) => update(is, ev.target.value)}
        />
      </Stack>
    </FormControl>
  )
}

// The sole field editor for the `calculator` content type's config JSON
// field -- every entry of this content type IS a calculator, so (unlike
// ConnectedComponent's shared configJson field, which also serves unrelated
// embed types) no sibling `type` field gate or plain-JSON fallback is
// needed here.

const GET_TAX_CALCULATOR_FIELDS = gql`
  query GetTaxCalculatorFieldsForContentfulApp(
    $calculatorType: TaxCalculatorType!
  ) {
    taxCalculatorFields(calculatorType: $calculatorType) {
      key
      label
    }
  }
`

const CALCULATOR_TYPE_TO_ENUM: Record<string, string> = {
  withholdingTaxOnWages: 'WITHHOLDING_TAX_ON_WAGES',
  childBenefit: 'CHILD_BENEFIT',
  vehicleTax: 'VEHICLE_TAX',
  vehicleBenefit: 'VEHICLE_BENEFIT',
}

const DEBOUNCE_TIME = 150

const generateKey = () => Math.random().toString(36).slice(2, 10)

const emptyConfig: CalculatorConfig = { sections: [] }

export const CalculatorConfigEditor = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [config, setConfig] = useState<CalculatorConfig>(
    sdk.field.getValue() ?? emptyConfig,
  )
  const [saveError, setSaveError] = useState(false)
  // Set by the editor directly on the entry's `type` field, not by this
  // widget.
  const [calculatorTypeValue, setCalculatorTypeValue] = useState<string>(
    sdk.entry.fields.type?.getValue() ?? '',
  )

  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => sdk.window.stopAutoResizer()
  }, [sdk.window])

  useEffect(
    () =>
      sdk.entry.fields.type?.onValueChanged((value: string | undefined) =>
        setCalculatorTypeValue(value ?? ''),
      ),
    [sdk.entry.fields.type],
  )

  useDebounce(
    () => {
      const result = calculatorConfigSchema.safeParse(config)
      setSaveError(!result.success)
      sdk.field.setInvalid(!result.success)
      if (result.success) {
        sdk.field.setValue(result.data)
      }
    },
    DEBOUNCE_TIME,
    [config],
  )

  const { data, loading, error } = useQuery(GET_TAX_CALCULATOR_FIELDS, {
    variables: {
      calculatorType: CALCULATOR_TYPE_TO_ENUM[calculatorTypeValue],
    },
    skip: !CALCULATOR_TYPE_TO_ENUM[calculatorTypeValue],
  })

  const availableFields = data?.taxCalculatorFields ?? []

  const sections = config.sections ?? []

  // Give the editor a section to start from immediately, rather than
  // requiring an extra "Add section" click every time.
  useEffect(() => {
    if (calculatorTypeValue && sections.length === 0) {
      setConfig((prev) => ({
        ...prev,
        sections: [{ key: generateKey(), fields: [] }],
      }))
    }
  }, [calculatorTypeValue])

  const updateSections = (updatedSections: CalculatorFieldSection[]) => {
    setConfig((prev) => ({ ...prev, sections: updatedSections }))
  }

  const updateSection = (
    index: number,
    patch: Partial<CalculatorFieldSection>,
  ) => {
    updateSections(
      sections.map((section, i) =>
        i === index ? { ...section, ...patch } : section,
      ),
    )
  }

  const addSection = () => {
    updateSections(sections.concat({ key: generateKey(), fields: [] }))
  }

  const removeSection = (index: number) => {
    updateSections(sections.filter((_, i) => i !== index))
  }

  const addField = (sectionIndex: number) => {
    updateSection(sectionIndex, {
      fields: sections[sectionIndex].fields.concat({ key: '', span: 12 }),
    })
  }

  const updateField = (
    sectionIndex: number,
    fieldIndex: number,
    patch: Partial<CalculatorSectionField>,
  ) => {
    updateSection(sectionIndex, {
      fields: sections[sectionIndex].fields.map((field, i) =>
        i === fieldIndex ? { ...field, ...patch } : field,
      ),
    })
  }

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    updateSection(sectionIndex, {
      fields: sections[sectionIndex].fields.filter((_, i) => i !== fieldIndex),
    })
  }

  // Toggles are pure authoring constructs -- a switch the editor names here,
  // never a form field's value -- so a gate can always be authored no matter
  // what the calculator's backend field list contains. A section never gates
  // itself: its own toggle already controls it.
  const otherToggles = (sectionIndex: number) =>
    collectSectionToggles(config).filter(
      (toggle) => toggle.key !== sections[sectionIndex]?.toggle?.key,
    )

  return (
    <Stack flexDirection="column" alignItems="stretch" spacing="spacingM">
      {error && (
        <Note variant="negative">
          Could not load the field list for this calculator type:{' '}
          {error.message}
        </Note>
      )}

      {calculatorTypeValue && !CALCULATOR_TYPE_TO_ENUM[calculatorTypeValue] && (
        <Note variant="warning">
          Unknown calculator type &quot;{calculatorTypeValue}&quot; -- no field
          list exists for it.
        </Note>
      )}

      {saveError && (
        <Note variant="negative">
          This configuration is invalid and has not been saved -- check that
          every section has fields with a key selected.
        </Note>
      )}

      {calculatorTypeValue &&
        sections.map((section, sectionIndex) => (
          <Stack
            key={section.key}
            flexDirection="column"
            alignItems="stretch"
            spacing="spacingS"
            style={{
              border: '1px solid #d3dce0',
              borderRadius: 6,
              padding: 16,
            }}
          >
            <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
              <Subheading marginBottom="none" style={{ flex: 1 }}>
                Section {sectionIndex + 1}
              </Subheading>
              <IconButton
                aria-label="Remove section"
                icon={<DeleteIcon />}
                onClick={() => removeSection(sectionIndex)}
              />
            </Stack>
            <LocalizedTextFields
              label="Section title"
              value={section.title}
              onChange={(next) => updateSection(sectionIndex, { title: next })}
              clearWhenEmpty
            />
            <LocalizedTextFields
              label="Section description"
              value={section.description}
              onChange={(next) =>
                updateSection(sectionIndex, { description: next })
              }
              clearWhenEmpty
            />
            {/* A section is either controlled by a toggle it owns (the switch
                reveals it) or by one another section owns (the vehicle-tax
                design greys out Bílnúmer while "Slá inn þyngd og losun" is
                on) -- never both, so one checkbox covers the pair. */}
            <Stack
              flexDirection="column"
              alignItems="stretch"
              spacing="spacingXs"
            >
              <Checkbox
                isChecked={Boolean(section.toggle || section.gate)}
                onChange={() =>
                  updateSection(
                    sectionIndex,
                    section.toggle || section.gate
                      ? { toggle: undefined, gate: undefined }
                      : {
                          toggle: { key: generateKey(), label: { is: '' } },
                        },
                  )
                }
              >
                Controlled by a toggle switch
              </Checkbox>

              {(section.toggle || section.gate) && (
                <>
                  {otherToggles(sectionIndex).length > 0 && (
                    <FormControl marginBottom="none">
                      <FormControl.Label>Toggle switch</FormControl.Label>
                      <Select
                        value={section.gate?.toggle ?? ''}
                        onChange={(ev) =>
                          updateSection(
                            sectionIndex,
                            ev.target.value
                              ? {
                                  toggle: undefined,
                                  gate: { toggle: ev.target.value },
                                }
                              : {
                                  toggle: {
                                    key: generateKey(),
                                    label: { is: '' },
                                  },
                                  gate: undefined,
                                },
                          )
                        }
                      >
                        <Select.Option value="">
                          New toggle switch, revealing this section
                        </Select.Option>
                        {otherToggles(sectionIndex).map((toggle) => (
                          <Select.Option key={toggle.key} value={toggle.key}>
                            {toggle.label.is || '(unlabelled toggle)'}
                          </Select.Option>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {section.toggle && (
                    <LocalizedTextFields
                      label="Toggle label"
                      value={section.toggle.label}
                      onChange={(next) =>
                        updateSection(sectionIndex, {
                          toggle: {
                            // `key` is what other sections reference, so it
                            // has to survive relabelling.
                            key: section.toggle?.key ?? generateKey(),
                            label: next ?? { is: '' },
                          },
                        })
                      }
                    />
                  )}

                  {section.gate && (
                    <Checkbox
                      isChecked={Boolean(section.gate.disableOnly)}
                      onChange={() =>
                        updateSection(sectionIndex, {
                          gate: {
                            toggle: section.gate?.toggle ?? '',
                            disableOnly: !section.gate?.disableOnly,
                          },
                        })
                      }
                    >
                      Grey out instead of hiding
                    </Checkbox>
                  )}
                </>
              )}
            </Stack>

            {section.fields.map((field, fieldIndex) => {
              return (
                <Stack
                  key={fieldIndex}
                  flexDirection="column"
                  alignItems="stretch"
                  spacing="spacingXs"
                  style={{
                    border: '1px solid #e5e8eb',
                    borderRadius: 4,
                    padding: 8,
                  }}
                >
                  <Stack
                    flexDirection="row"
                    alignItems="flex-end"
                    spacing="spacingXs"
                  >
                    <FormControl
                      isRequired
                      marginBottom="none"
                      style={{ flex: 1 }}
                    >
                      <FormControl.Label>Field</FormControl.Label>
                      <Select
                        value={field.key}
                        onChange={(ev) => {
                          const key = ev.target.value
                          const patch: Partial<CalculatorSectionField> = {
                            key,
                          }
                          // Convenience prefill: an editor picking a field for
                          // the first time starts from the backend's default
                          // Icelandic label instead of a blank input.
                          if (!field.label) {
                            const matched = availableFields.find(
                              (available: { key: string; label: string }) =>
                                available.key === key,
                            )
                            if (matched) {
                              patch.label = { is: matched.label }
                            }
                          }
                          updateField(sectionIndex, fieldIndex, patch)
                        }}
                        isDisabled={loading}
                      >
                        <Select.Option value="" isDisabled>
                          {loading ? 'Loading fields…' : 'Select a field'}
                        </Select.Option>
                        {availableFields.map(
                          (availableField: { key: string; label: string }) => (
                            <Select.Option
                              key={availableField.key}
                              value={availableField.key}
                            >
                              {availableField.label}
                            </Select.Option>
                          ),
                        )}
                      </Select>
                    </FormControl>
                    <FormControl marginBottom="none" style={{ width: 96 }}>
                      <FormControl.Label>Span</FormControl.Label>
                      <TextInput
                        type="number"
                        inputMode="numeric"
                        value={String(field.span)}
                        onChange={(ev) => {
                          const span = Number(ev.target.value)
                          if (Number.isNaN(span)) return
                          updateField(sectionIndex, fieldIndex, {
                            span: Math.min(12, Math.max(1, span)),
                          })
                        }}
                      />
                    </FormControl>
                    <IconButton
                      aria-label="Remove field"
                      icon={<DeleteIcon />}
                      onClick={() => removeField(sectionIndex, fieldIndex)}
                    />
                  </Stack>

                  {field.key && (
                    <>
                      <LocalizedTextFields
                        label="Field label"
                        value={field.label}
                        onChange={(next) =>
                          updateField(sectionIndex, fieldIndex, {
                            label: next,
                          })
                        }
                        clearWhenEmpty
                      />
                      <LocalizedTextFields
                        label="Field placeholder"
                        value={field.placeholder}
                        onChange={(next) =>
                          updateField(sectionIndex, fieldIndex, {
                            placeholder: next,
                          })
                        }
                        clearWhenEmpty
                      />
                    </>
                  )}
                </Stack>
              )
            })}
            <Button
              size="small"
              startIcon={<PlusIcon />}
              onClick={() => addField(sectionIndex)}
            >
              Add field
            </Button>
          </Stack>
        ))}

      {calculatorTypeValue && (
        <Button startIcon={<PlusIcon />} onClick={addSection}>
          Add section
        </Button>
      )}

      {!calculatorTypeValue && (
        <Paragraph>
          Select a calculator type on this entry to configure sections.
        </Paragraph>
      )}
    </Stack>
  )
}
