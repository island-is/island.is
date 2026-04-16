'use client'

import React, { useCallback, useMemo } from 'react'
import type {
  SdfComponentData,
  SdfValidationError,
  ClientCondition,
} from '../lib/graphql'
import { evaluateClientCondition } from '../lib/evaluateClientCondition'
import {
  getCustomComponent,
  validateCustomComponentProps,
} from './registry'
import {
  AlertMessage,
  AccordionCard,
  Accordion,
  AccordionItem,
  Box,
  Text,
  Button,
  Icon,
  Input,
  Select,
  RadioButton,
  Checkbox,
  DatePicker,
  Divider,
  BulletList,
  LinkV2,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

const FULL_ROW_TYPES = new Set([
  'SdfRadioField',
  'SdfCheckboxField',
  'SdfDisplayField',
  'SdfAlertMessageField',
  'SdfExpandableDescriptionField',
  'SdfAccordionField',
  'SdfStaticTableField',
  'SdfFileUploadField',
  'SdfSliderField',
  'SdfDividerField',
  'SdfTitleField',
  'SdfDescriptionField',
  'SdfExternalDataProviderField',
])

const isHalfWidthCandidate = (comp: SdfComponentData): boolean =>
  comp.width === 'HALF' && !FULL_ROW_TYPES.has(comp.__typename)

const groupComponentsIntoRows = (
  components: SdfComponentData[],
): SdfComponentData[][] => {
  const rows: SdfComponentData[][] = []
  let i = 0

  while (i < components.length) {
    const comp = components[i]
    if (isHalfWidthCandidate(comp)) {
      const row: SdfComponentData[] = [comp]
      if (
        i + 1 < components.length &&
        isHalfWidthCandidate(components[i + 1])
      ) {
        row.push(components[i + 1])
        i += 2
      } else {
        i += 1
      }
      rows.push(row)
    } else {
      rows.push([comp])
      i += 1
    }
  }

  return rows
}

export type SdfFormDispatch = (
  actionType: string,
  extraAnswers?: Record<string, unknown>,
  fieldIds?: string[],
  event?: string,
  refetchTemplateApiActions?: string[],
) => void | Promise<void>

interface FormRendererProps {
  components: SdfComponentData[]
  errors: SdfValidationError[]
  answers: Record<string, unknown>
  onAnswerChange: (fieldId: string, value: unknown) => void
  dispatch?: SdfFormDispatch
}

export const FormRenderer = ({
  components,
  errors,
  answers,
  onAnswerChange,
  dispatch,
}: FormRendererProps) => {
  const errorMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const err of errors) {
      map[err.componentId] = err.message
    }
    return map
  }, [errors])

  const rows = groupComponentsIntoRows(components)

  return (
    <Box>
      {rows.map((row, rowIdx) => {
        if (row.length === 1 && row[0].width !== 'HALF') {
          const component = row[0]
          return (
            <ComponentSwitch
              key={component.id ?? `component-${rowIdx}`}
              component={component}
              error={component.id ? errorMap[component.id] : undefined}
              answers={answers}
              onAnswerChange={onAnswerChange}
              dispatch={dispatch}
            />
          )
        }

        return (
          <GridRow key={`row-${rowIdx}`}>
            {row.map((component, colIdx) => (
              <GridColumn
                key={component.id ?? `col-${rowIdx}-${colIdx}`}
                span={['1/1', '1/2']}
                paddingBottom={2}
              >
                <ComponentSwitch
                  component={component}
                  error={component.id ? errorMap[component.id] : undefined}
                  answers={answers}
                  onAnswerChange={onAnswerChange}
                  dispatch={dispatch}
                />
              </GridColumn>
            ))}
          </GridRow>
        )
      })}
    </Box>
  )
}

interface ComponentSwitchProps {
  component: SdfComponentData
  error?: string
  answers: Record<string, unknown>
  onAnswerChange: (fieldId: string, value: unknown) => void
  dispatch?: SdfFormDispatch
}

const ComponentSwitch = ({
  component,
  error,
  answers,
  onAnswerChange,
  dispatch,
}: ComponentSwitchProps) => {
  const handleChange = useCallback(
    (value: unknown) => {
      if (component.id) {
        onAnswerChange(component.id, value)
      }
    },
    [component.id, onAnswerChange],
  )

  const visible = evaluateClientCondition(
    component.clientCondition as ClientCondition | null | undefined,
    answers,
  )

  if (!visible) return null

  const currentValue = component.id ? answers[component.id] : undefined

  switch (component.__typename) {
    case 'SdfTextField':
      return (
        <Box marginBottom={3}>
          <Input
            id={component.id ?? ''}
            name={component.id ?? ''}
            label={component.label ?? ''}
            placeholder={component.placeholder ?? ''}
            disabled={component.disabled}
            maxLength={component.maxLength ?? undefined}
            required={component.required}
            hasError={!!error}
            errorMessage={error}
            value={
              (currentValue as string) ?? component.defaultValue ?? ''
            }
            onChange={(e) => handleChange(e.target.value)}
            size="md"
          />
        </Box>
      )

    case 'SdfSelectField':
      return (
        <Box marginBottom={3}>
          <Select
            name={component.id ?? ''}
            label={component.label ?? ''}
            placeholder={component.placeholder ?? 'Select...'}
            isDisabled={component.disabled}
            required={component.required}
            hasError={!!error}
            errorMessage={error}
            options={
              component.options?.map((opt) => ({
                label: opt.label,
                value: opt.value,
              })) ?? []
            }
            value={
              component.options?.find(
                (opt) => opt.value === (currentValue as string),
              )
                ? {
                    label:
                      component.options.find(
                        (opt) => opt.value === (currentValue as string),
                      )?.label ?? '',
                    value: (currentValue as string) ?? '',
                  }
                : undefined
            }
            onChange={(opt) => {
              handleChange(opt?.value)
              if (
                component.onSelectRefetchTemplateApis?.length &&
                dispatch
              ) {
                void dispatch(
                  'REFETCH',
                  undefined,
                  undefined,
                  undefined,
                  component.onSelectRefetchTemplateApis,
                )
              }
            }}
          />
        </Box>
      )

    case 'SdfRadioField': {
      const radioSplit = component.width === 'HALF' ? '1/2' : '1/1'
      return (
        <Box marginBottom={3} paddingTop={2}>
          <Text variant="h4" as="h4" marginBottom={2}>
            {component.label}
          </Text>
          <GridRow>
            {component.options?.map((opt) => (
              <GridColumn
                key={opt.value}
                span={['1/1', radioSplit]}
                paddingBottom={2}
                paddingTop={2}
              >
                <RadioButton
                  id={`${component.id}-${opt.value}`}
                  name={component.id ?? ''}
                  label={opt.label}
                  value={opt.value}
                  checked={currentValue === opt.value}
                  disabled={component.disabled}
                  onChange={() => handleChange(opt.value)}
                  hasError={!!error}
                  large
                  backgroundColor="blue"
                />
              </GridColumn>
            ))}
          </GridRow>
          {error && (
            <Text variant="small" color="red600" marginTop={1}>
              {error}
            </Text>
          )}
        </Box>
      )
    }

    case 'SdfCheckboxField':
      return (
        <Box marginBottom={3}>
          <Text variant="h5" marginBottom={2}>
            {component.label}
            {component.required && (
              <Text as="span" color="red600">
                {' '}
                *
              </Text>
            )}
          </Text>
          {component.options?.map((opt) => {
            const checked =
              Array.isArray(currentValue) &&
              (currentValue as string[]).includes(opt.value)
            return (
              <Box key={opt.value} marginBottom={1}>
                <Checkbox
                  id={`${component.id}-${opt.value}`}
                  name={component.id ?? ''}
                  label={opt.label}
                  value={opt.value}
                  checked={checked}
                  disabled={component.disabled}
                  onChange={(e) => {
                    const current = Array.isArray(currentValue)
                      ? (currentValue as string[])
                      : []
                    if (e.target.checked) {
                      handleChange([...current, opt.value])
                    } else {
                      handleChange(current.filter((v) => v !== opt.value))
                    }
                  }}
                  hasError={!!error}
                />
              </Box>
            )
          })}
          {error && (
            <Text variant="small" color="red600" marginTop={1}>
              {error}
            </Text>
          )}
        </Box>
      )

    case 'SdfDateField':
      return (
        <Box marginBottom={3}>
          <DatePicker
            id={component.id ?? ''}
            label={component.label ?? ''}
            placeholderText={component.placeholder}
            disabled={component.disabled}
            minDate={component.minDate ? new Date(component.minDate) : undefined}
            maxDate={component.maxDate ? new Date(component.maxDate) : undefined}
            required={component.required}
            hasError={!!error}
            errorMessage={error}
            selected={currentValue ? new Date(currentValue as string) : undefined}
            handleChange={(date) => handleChange(date.toISOString().split('T')[0])}
            size="md"
          />
        </Box>
      )

    case 'SdfPhoneField':
      return (
        <Box marginBottom={3}>
          <Input
            id={component.id ?? ''}
            name={component.id ?? ''}
            label={component.label ?? ''}
            placeholder={component.placeholder ?? ''}
            disabled={component.disabled}
            required={component.required}
            hasError={!!error}
            errorMessage={error}
            type="tel"
            value={(currentValue as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            size={component.width === 'HALF' ? 'xs' : 'md'}
          />
        </Box>
      )

    case 'SdfNationalIdField':
      return (
        <Box marginBottom={3}>
          <Input
            id={component.id ?? ''}
            name={component.id ?? ''}
            label={component.label ?? ''}
            placeholder="000000-0000"
            disabled={component.disabled}
            required={component.required}
            hasError={!!error}
            errorMessage={error}
            value={(currentValue as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            size="xs"
          />
        </Box>
      )

    case 'SdfFileUploadField':
      return (
        <Box marginBottom={3}>
          <Input
            id={component.id ?? ''}
            name={component.id ?? ''}
            label={component.label ?? ''}
            disabled={component.disabled}
            required={component.required}
            hasError={!!error}
            errorMessage={error}
            type="file"
          />
        </Box>
      )

    case 'SdfDescriptionField':
      return (
        <Box marginBottom={3}>
          <Text variant="h3" marginBottom={1}>
            {component.label}
          </Text>
          {component.description && (
            <Text>{component.description}</Text>
          )}
        </Box>
      )

    case 'SdfDividerField':
      return (
        <Box marginY={3}>
          <Divider />
        </Box>
      )

    case 'SdfKeyValueField':
      return (
        <Box
          marginBottom={2}
          display="flex"
          justifyContent="spaceBetween"
          paddingY={2}
          borderBottomWidth="standard"
          borderColor="blue200"
        >
          <Text fontWeight="semiBold">{component.label}</Text>
          <Text>{component.value}</Text>
        </Box>
      )

    case 'SdfAlertMessageField':
      return (
        <Box marginBottom={3}>
          <AlertMessage
            type={(component.alertType as 'info' | 'error' | 'warning' | 'success') ?? 'info'}
            title={component.title ?? ''}
            message={component.message}
          />
        </Box>
      )

    case 'SdfLinkField':
      return (
        <Box marginBottom={2}>
          <LinkV2
            href={component.url ?? '#'}
            newTab
            color="blue400"
            underline="normal"
          >
            {component.label}
          </LinkV2>
        </Box>
      )

    case 'SdfDisplayField':
      return (
        <Box paddingY={3}>
          {component.label && (
            <Text variant="h4" paddingBottom={1}>
              {component.label}
            </Text>
          )}
          <Input
            id={component.id ?? ''}
            name={component.id ?? ''}
            label={component.description ?? ''}
            value={String(currentValue ?? component.value ?? '')}
            readOnly
            backgroundColor="blue"
            size="md"
          />
        </Box>
      )

    case 'SdfSliderField':
      return (
        <Box marginBottom={3}>
          <Text variant="h5" marginBottom={1}>
            {component.label}
          </Text>
          <input
            id={component.id}
            type="range"
            min={component.min}
            max={component.max}
            step={component.step ?? 1}
            defaultValue={
              (currentValue as string) ?? String(component.min ?? 0)
            }
            onChange={(e) => handleChange(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <Box display="flex" justifyContent="spaceBetween">
            <Text variant="small" color="dark300">
              {component.min}
            </Text>
            <Text variant="small" color="dark300">
              {String(currentValue ?? component.min ?? 0)}
            </Text>
            <Text variant="small" color="dark300">
              {component.max}
            </Text>
          </Box>
        </Box>
      )

    case 'SdfSubmitField':
      return (
        <Box marginBottom={3} display="flex" flexDirection="row" columnGap={2}>
          {component.actions?.map((action) => (
            <Button
              key={action.event}
              variant={action.type === 'primary' ? 'primary' : 'ghost'}
              size="default"
            >
              {action.name}
            </Button>
          ))}
        </Box>
      )

    case 'SdfImageField':
      return (
        <Box marginBottom={3}>
          <Text fontWeight="semiBold" marginBottom={1}>
            {component.label}
          </Text>
          {component.imageUrl && (
            <Box borderRadius="large" overflow="hidden">
              <img
                src={component.imageUrl}
                alt={component.label ?? ''}
                style={{ maxWidth: '100%', display: 'block' }}
              />
            </Box>
          )}
        </Box>
      )

    case 'SdfBankAccountField':
      return (
        <Box marginBottom={3}>
          <Input
            id={component.id ?? ''}
            name={component.id ?? ''}
            label={component.label ?? ''}
            placeholder="0000-00-000000"
            disabled={component.disabled}
            hasError={!!error}
            errorMessage={error}
            value={(currentValue as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        </Box>
      )

    case 'SdfCustomComponent':
      return (
        <CustomComponentRenderer
          componentName={component.componentName!}
          rawProps={component.props ?? '{}'}
          onAnswerChange={onAnswerChange}
        />
      )

    case 'SdfRepeaterComponent':
      return (
        <Box
          marginBottom={3}
          border="standard"
          borderRadius="large"
          padding={3}
        >
          <Text fontWeight="semiBold" marginBottom={2}>
            {component.addItemLabel ?? 'Items'}
          </Text>
          <Text variant="small" color="dark300">
            Repeater rendering handled by the backend. Items are re-evaluated
            on REFETCH.
          </Text>
        </Box>
      )

    case 'SdfExpandableDescriptionField':
      return (
        <Box marginTop={2} marginBottom={2}>
          <AccordionCard
            id={`expandable-${component.id}`}
            label={component.label ?? ''}
            labelVariant="h3"
          >
            {component.introText && (
              <Box marginBottom={4}>
                <Text>{component.introText}</Text>
              </Box>
            )}
            {component.description && (
              <BulletList space="gutter" type="ul">
                <Text>{component.description}</Text>
              </BulletList>
            )}
          </AccordionCard>
        </Box>
      )

    case 'SdfMessageWithLinkButtonField':
      return (
        <Box marginTop={2} marginBottom={2}>
          <Box
            borderRadius="standard"
            padding={4}
            background="blue100"
            display={['block', 'block', 'flex']}
            alignItems="center"
            justifyContent="spaceBetween"
            flexDirection={['column', 'column', 'row']}
            marginY={2}
          >
            <Box paddingRight={[0, 0, 4]}>
              <Text variant="small">
                {component.message}
              </Text>
            </Box>
            <Box marginTop={[3, 3, 0]} marginLeft={[0, 0, 3]}>
              <Button
                onClick={() => {
                  window.open(component.url ?? '#', '_blank')
                }}
                size="small"
                icon="arrowForward"
                nowrap
              >
                {component.buttonTitle}
              </Button>
            </Box>
          </Box>
        </Box>
      )

    case 'SdfAccordionField':
      return (
        <Box marginBottom={3}>
          {component.label && (
            <Text variant="h3" marginBottom={2}>
              {component.label}
            </Text>
          )}
          <Accordion>
            {(
              component.items as
                | { label: string; content: string }[]
                | undefined
            )?.map((item, i) => (
              <AccordionItem
                key={i}
                id={`accordion-${component.id}-${i}`}
                label={item.label}
              >
                <Text>{item.content}</Text>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )

    case 'SdfStaticTableField':
      return (
        <Box marginBottom={3}>
          {component.label && (
            <Text variant="h3" marginBottom={2}>
              {component.label}
            </Text>
          )}
          <Box overflow="auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {component.header && (
                <thead>
                  <tr>
                    {component.header.map((h: string, i: number) => (
                      <th key={i} style={{ textAlign: 'left' }}>
                        <Box paddingY={2} paddingX={3} borderBottomWidth="standard" borderColor="blue200">
                          <Text fontWeight="semiBold" variant="small">{h}</Text>
                        </Box>
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {component.rows?.map((row: string[], ri: number) => (
                  <tr key={ri}>
                    {row.map((cell: string, ci: number) => (
                      <td key={ci}>
                        <Box paddingY={2} paddingX={3} borderBottomWidth="standard" borderColor="blue100">
                          <Text variant="small">{cell}</Text>
                        </Box>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      )

    case 'SdfHiddenInputField':
    case 'SdfHiddenInputWithWatchedValueField':
      return null

    case 'SdfExternalDataProviderField': {
      const isApproved = currentValue === true
      return (
        <Box>
          <Box marginTop={2} marginBottom={5}>
            <Box display="flex" alignItems="center" justifyContent="flexStart">
              <Box marginRight={1}>
                <Icon
                  icon="fileTrayFull"
                  size="medium"
                  color="blue400"
                  type="outline"
                />
              </Box>
              <Text variant="h4">
                {component.subTitle ??
                  'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki'}
              </Text>
            </Box>
            {component.description && (
              <Box marginTop={4}>
                <Text>{component.description}</Text>
              </Box>
            )}
          </Box>
          <Box marginBottom={5}>
            {component.dataProviders?.map((dp: any) => (
              <Box key={dp.id} marginBottom={3}>
                <Text variant="h4" color="blue400">
                  {dp.title}
                </Text>
                {dp.subTitle && <Text>{dp.subTitle}</Text>}
              </Box>
            ))}
          </Box>
          <Checkbox
            name={component.id ?? ''}
            label={
              component.checkboxLabel ?? 'Ég samþykki'
            }
            checked={isApproved}
            onChange={(e) => handleChange(e.target.checked)}
            hasError={!!error}
            large
            backgroundColor="blue"
          />
          {error && (
            <Box marginTop={1}>
              <Text variant="small" color="red600">
                {error}
              </Text>
            </Box>
          )}
        </Box>
      )
    }

    case 'SdfRedirectToServicePortalField':
    case 'SdfPaymentPendingField':
    case 'SdfTitleField':
    case 'SdfPaginatedSearchableTableField':
    case 'SdfNationalIdWithNameField':
    case 'SdfFieldsRepeaterField':
    case 'SdfOverviewField':
    case 'SdfVehiclePermnoWithInfoField':
    case 'SdfCompanySearchField':
    case 'SdfAsyncSelectField':
    case 'SdfActionCardListField':
    case 'SdfTableRepeaterField':
    case 'SdfFindVehicleField':
      return (
        <Box
          marginBottom={2}
          padding={2}
          background="blue100"
          borderRadius="large"
        >
          <Text variant="small" color="dark300">
            [{component.__typename}] {component.label ?? component.id}
          </Text>
        </Box>
      )

    default:
      return null
  }
}

const CustomComponentRenderer = ({
  componentName,
  rawProps,
  onAnswerChange,
}: {
  componentName: string
  rawProps: string
  onAnswerChange: (fieldId: string, value: unknown) => void
}) => {
  const { component: Component } = getCustomComponent(componentName)
  const { parsed } = validateCustomComponentProps(componentName, rawProps)

  const DynComponent = Component as React.ComponentType<
    Record<string, unknown>
  >

  return (
    <DynComponent
      componentName={componentName}
      onAnswerChange={onAnswerChange}
      {...parsed}
    />
  )
}
