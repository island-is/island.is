import { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { useDebounce } from 'react-use'
import { useQuery } from '@apollo/client'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Button,
  Checkbox,
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
  CalculatorFieldSection,
  CalculatorSectionField,
  calculatorConfigSchema,
} from '@island.is/shared/calculator-config'

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

// Contentful-facing values -- kept camelCase/English so they read cleanly in
// the config JSON, independent of the GraphQL enum's wire format below.
const CALCULATOR_TYPE_OPTIONS = [
  { value: 'withholdingTaxOnWages', label: 'Staðgreiðsla launa' },
  { value: 'childBenefit', label: 'Barnabætur' },
]

const CALCULATOR_TYPE_TO_ENUM: Record<string, string> = {
  withholdingTaxOnWages: 'WITHHOLDING_TAX_ON_WAGES',
  childBenefit: 'CHILD_BENEFIT',
}

const generateKey = () => Math.random().toString(36).slice(2, 10)

const emptyConfig: CalculatorConfig = { sections: [] }

const TaxCalculatorConfigField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [config, setConfig] = useState<CalculatorConfig>(
    sdk.field.getValue() ?? emptyConfig,
  )
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useDebounce(
    () => {
      const result = calculatorConfigSchema.safeParse(config)
      if (result.success) {
        setSaveError(false)
        sdk.field.setValue(result.data)
      } else {
        setSaveError(true)
      }
    },
    150,
    [config],
  )

  const { data, loading } = useQuery(GET_TAX_CALCULATOR_FIELDS, {
    variables: {
      calculatorType: CALCULATOR_TYPE_TO_ENUM[config.calculatorType ?? ''],
    },
    skip: !config.calculatorType,
  })

  const availableFields = data?.taxCalculatorFields ?? []
  const availableFieldKeys: string[] = availableFields.map(
    (field: { key: string }) => field.key,
  )

  const sections = config.sections ?? []

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
    updateSections(
      sections.concat({ key: generateKey(), title: '', fields: [] }),
    )
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

  // Minimal first cut: a single flat AND/OR list of leaf {field, equals}
  // conditions. The schema supports arbitrary nesting; this UI deliberately
  // doesn't expose that -- only hand-editing the raw JSON can express it.
  const getConditionRows = (
    field: CalculatorSectionField,
  ): {
    rows: { field: string; equals: string }[]
    combinator: 'all' | 'any'
  } => {
    const condition = field.visibleWhen
    if (!condition) return { rows: [], combinator: 'all' }
    if ('field' in condition) return { rows: [condition], combinator: 'all' }
    if ('all' in condition) {
      return {
        rows: condition.all.filter(
          (c): c is { field: string; equals: string } => 'field' in c,
        ),
        combinator: 'all',
      }
    }
    return {
      rows: condition.any.filter(
        (c): c is { field: string; equals: string } => 'field' in c,
      ),
      combinator: 'any',
    }
  }

  const setConditionRows = (
    sectionIndex: number,
    fieldIndex: number,
    rows: { field: string; equals: string }[],
    combinator: 'all' | 'any',
  ) => {
    if (rows.length === 0) {
      updateField(sectionIndex, fieldIndex, { visibleWhen: undefined })
      return
    }
    if (rows.length === 1) {
      updateField(sectionIndex, fieldIndex, { visibleWhen: rows[0] })
      return
    }
    updateField(sectionIndex, fieldIndex, {
      visibleWhen: {
        [combinator]: rows,
      } as CalculatorSectionField['visibleWhen'],
    })
  }

  return (
    <Stack flexDirection="column" alignItems="stretch" spacing="spacingM">
      <Select
        value={config.calculatorType ?? ''}
        onChange={(ev) =>
          setConfig((prev) => ({ ...prev, calculatorType: ev.target.value }))
        }
      >
        <Select.Option value="" isDisabled>
          Select a calculator type
        </Select.Option>
        {CALCULATOR_TYPE_OPTIONS.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>

      {saveError && (
        <Note variant="negative">
          This configuration is invalid and has not been saved -- check that
          every section has fields with a key selected.
        </Note>
      )}

      {config.calculatorType &&
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
            <TextInput
              placeholder="Section title"
              value={section.title}
              onChange={(ev) =>
                updateSection(sectionIndex, { title: ev.target.value })
              }
            />
            <TextInput
              placeholder="Section description (optional)"
              value={section.description ?? ''}
              onChange={(ev) =>
                updateSection(sectionIndex, { description: ev.target.value })
              }
            />

            {section.fields.map((field, fieldIndex) => {
              const { rows, combinator } = getConditionRows(field)
              const hasCondition = rows.length > 0

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
                    alignItems="center"
                    spacing="spacingXs"
                  >
                    <Select
                      value={field.key}
                      onChange={(ev) =>
                        updateField(sectionIndex, fieldIndex, {
                          key: ev.target.value,
                        })
                      }
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
                    <TextInput
                      type="number"
                      inputMode="numeric"
                      aria-label="Column span (1-12)"
                      value={String(field.span)}
                      onChange={(ev) => {
                        const span = Number(ev.target.value)
                        if (Number.isNaN(span)) return
                        updateField(sectionIndex, fieldIndex, {
                          span: Math.min(12, Math.max(1, span)),
                        })
                      }}
                      style={{ width: 80 }}
                    />
                    <IconButton
                      aria-label="Remove field"
                      icon={<DeleteIcon />}
                      onClick={() => removeField(sectionIndex, fieldIndex)}
                    />
                  </Stack>

                  <Checkbox
                    isChecked={hasCondition}
                    onChange={() =>
                      setConditionRows(
                        sectionIndex,
                        fieldIndex,
                        hasCondition ? [] : [{ field: '', equals: '' }],
                        combinator,
                      )
                    }
                  >
                    Conditional visibility
                  </Checkbox>

                  {hasCondition && (
                    <Stack
                      flexDirection="column"
                      alignItems="stretch"
                      spacing="spacingXs"
                    >
                      {rows.length > 1 && (
                        <Select
                          value={combinator}
                          onChange={(ev) =>
                            setConditionRows(
                              sectionIndex,
                              fieldIndex,
                              rows,
                              ev.target.value as 'all' | 'any',
                            )
                          }
                        >
                          <Select.Option value="all">
                            Show when ALL conditions match
                          </Select.Option>
                          <Select.Option value="any">
                            Show when ANY condition matches
                          </Select.Option>
                        </Select>
                      )}
                      {rows.map((row, rowIndex) => (
                        <Stack
                          key={rowIndex}
                          flexDirection="row"
                          alignItems="center"
                          spacing="spacingXs"
                        >
                          <Select
                            value={row.field}
                            onChange={(ev) => {
                              const updated = rows.map((r, i) =>
                                i === rowIndex
                                  ? { ...r, field: ev.target.value }
                                  : r,
                              )
                              setConditionRows(
                                sectionIndex,
                                fieldIndex,
                                updated,
                                combinator,
                              )
                            }}
                          >
                            <Select.Option value="" isDisabled>
                              Select a field
                            </Select.Option>
                            {availableFieldKeys.map((key) => (
                              <Select.Option key={key} value={key}>
                                {key}
                              </Select.Option>
                            ))}
                          </Select>
                          <TextInput
                            placeholder="equals"
                            value={row.equals}
                            onChange={(ev) => {
                              const updated = rows.map((r, i) =>
                                i === rowIndex
                                  ? { ...r, equals: ev.target.value }
                                  : r,
                              )
                              setConditionRows(
                                sectionIndex,
                                fieldIndex,
                                updated,
                                combinator,
                              )
                            }}
                          />
                          <IconButton
                            aria-label="Remove condition"
                            icon={<DeleteIcon />}
                            onClick={() =>
                              setConditionRows(
                                sectionIndex,
                                fieldIndex,
                                rows.filter((_, i) => i !== rowIndex),
                                combinator,
                              )
                            }
                          />
                        </Stack>
                      ))}
                      <Button
                        size="small"
                        startIcon={<PlusIcon />}
                        onClick={() =>
                          setConditionRows(
                            sectionIndex,
                            fieldIndex,
                            rows.concat({ field: '', equals: '' }),
                            combinator,
                          )
                        }
                      >
                        Add condition
                      </Button>
                    </Stack>
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

      {config.calculatorType && (
        <Button startIcon={<PlusIcon />} onClick={addSection}>
          Add section
        </Button>
      )}

      {!config.calculatorType && (
        <Paragraph>Select a calculator type to configure sections.</Paragraph>
      )}
    </Stack>
  )
}

export default TaxCalculatorConfigField
