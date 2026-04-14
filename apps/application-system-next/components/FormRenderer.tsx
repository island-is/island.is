'use client'

import React, { useCallback, useMemo } from 'react'
import type { SdfComponentData, SdfValidationError, ClientCondition } from '../lib/graphql'
import { evaluateClientCondition } from '../lib/evaluateClientCondition'
import {
  getCustomComponent,
  validateCustomComponentProps,
} from './registry'

interface FormRendererProps {
  components: SdfComponentData[]
  errors: SdfValidationError[]
  answers: Record<string, unknown>
  onAnswerChange: (fieldId: string, value: unknown) => void
}

export function FormRenderer({
  components,
  errors,
  answers,
  onAnswerChange,
}: FormRendererProps) {
  const errorMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const err of errors) {
      map[err.componentId] = err.message
    }
    return map
  }, [errors])

  return (
    <div className="sdf-form-renderer">
      {components.map((component, index) => (
        <ComponentSwitch
          key={component.id ?? `component-${index}`}
          component={component}
          error={component.id ? errorMap[component.id] : undefined}
          answers={answers}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </div>
  )
}

interface ComponentSwitchProps {
  component: SdfComponentData
  error?: string
  answers: Record<string, unknown>
  onAnswerChange: (fieldId: string, value: unknown) => void
}

function ComponentSwitch({
  component,
  error,
  answers,
  onAnswerChange,
}: ComponentSwitchProps) {
  const visible = evaluateClientCondition(
    component.clientCondition as ClientCondition | null | undefined,
    answers,
  )

  if (!visible) return null

  const handleChange = useCallback(
    (value: unknown) => {
      if (component.id) {
        onAnswerChange(component.id, value)
      }
    },
    [component.id, onAnswerChange],
  )

  const currentValue = component.id ? answers[component.id] : undefined

  switch (component.__typename) {
    case 'SdfTextField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={component.id}
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}
          >
            {component.label}
            {component.required && <span style={{ color: '#B30038' }}> *</span>}
          </label>
          <input
            id={component.id}
            type="text"
            placeholder={component.placeholder ?? ''}
            disabled={component.disabled}
            maxLength={component.maxLength ?? undefined}
            defaultValue={
              (currentValue as string) ?? component.defaultValue ?? ''
            }
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: component.width === 'HALF' ? '50%' : '100%',
              padding: '0.75rem',
              border: error ? '2px solid #B30038' : '1px solid #ccdfff',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
          {error && (
            <p style={{ color: '#B30038', fontSize: '14px', marginTop: '0.25rem' }}>
              {error}
            </p>
          )}
        </div>
      )

    case 'SdfSelectField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={component.id}
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}
          >
            {component.label}
            {component.required && <span style={{ color: '#B30038' }}> *</span>}
          </label>
          <select
            id={component.id}
            disabled={component.disabled}
            defaultValue={(currentValue as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: component.width === 'HALF' ? '50%' : '100%',
              padding: '0.75rem',
              border: error ? '2px solid #B30038' : '1px solid #ccdfff',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          >
            <option value="">{component.placeholder ?? 'Select...'}</option>
            {component.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && (
            <p style={{ color: '#B30038', fontSize: '14px', marginTop: '0.25rem' }}>
              {error}
            </p>
          )}
        </div>
      )

    case 'SdfRadioField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              {component.label}
              {component.required && (
                <span style={{ color: '#B30038' }}> *</span>
              )}
            </legend>
            {component.options?.map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  border:
                    currentValue === opt.value
                      ? '2px solid #0061ff'
                      : '1px solid #ccdfff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: currentValue === opt.value ? '#f0f6ff' : 'white',
                }}
              >
                <input
                  type="radio"
                  name={component.id}
                  value={opt.value}
                  checked={currentValue === opt.value}
                  disabled={component.disabled}
                  onChange={() => handleChange(opt.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                {opt.label}
              </label>
            ))}
          </fieldset>
          {error && (
            <p style={{ color: '#B30038', fontSize: '14px', marginTop: '0.25rem' }}>
              {error}
            </p>
          )}
        </div>
      )

    case 'SdfCheckboxField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              {component.label}
              {component.required && (
                <span style={{ color: '#B30038' }}> *</span>
              )}
            </legend>
            {component.options?.map((opt) => {
              const checked =
                Array.isArray(currentValue) &&
                (currentValue as string[]).includes(opt.value)
              return (
                <label
                  key={opt.value}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                    border: checked
                      ? '2px solid #0061ff'
                      : '1px solid #ccdfff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: checked ? '#f0f6ff' : 'white',
                  }}
                >
                  <input
                    type="checkbox"
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
                    style={{ marginRight: '0.5rem' }}
                  />
                  {opt.label}
                </label>
              )
            })}
          </fieldset>
          {error && (
            <p style={{ color: '#B30038', fontSize: '14px', marginTop: '0.25rem' }}>
              {error}
            </p>
          )}
        </div>
      )

    case 'SdfDateField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={component.id}
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}
          >
            {component.label}
            {component.required && <span style={{ color: '#B30038' }}> *</span>}
          </label>
          <input
            id={component.id}
            type="date"
            disabled={component.disabled}
            min={component.minDate ?? undefined}
            max={component.maxDate ?? undefined}
            defaultValue={(currentValue as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: component.width === 'HALF' ? '50%' : '100%',
              padding: '0.75rem',
              border: error ? '2px solid #B30038' : '1px solid #ccdfff',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
          {error && (
            <p style={{ color: '#B30038', fontSize: '14px', marginTop: '0.25rem' }}>
              {error}
            </p>
          )}
        </div>
      )

    case 'SdfPhoneField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={component.id}
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}
          >
            {component.label}
            {component.required && <span style={{ color: '#B30038' }}> *</span>}
          </label>
          <input
            id={component.id}
            type="tel"
            placeholder={component.placeholder ?? ''}
            disabled={component.disabled}
            defaultValue={(currentValue as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: component.width === 'HALF' ? '50%' : '100%',
              padding: '0.75rem',
              border: error ? '2px solid #B30038' : '1px solid #ccdfff',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
          {error && (
            <p style={{ color: '#B30038', fontSize: '14px', marginTop: '0.25rem' }}>
              {error}
            </p>
          )}
        </div>
      )

    case 'SdfNationalIdField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={component.id}
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}
          >
            {component.label}
            {component.required && <span style={{ color: '#B30038' }}> *</span>}
          </label>
          <input
            id={component.id}
            type="text"
            placeholder="000000-0000"
            disabled={component.disabled}
            defaultValue={(currentValue as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: '50%',
              padding: '0.75rem',
              border: error ? '2px solid #B30038' : '1px solid #ccdfff',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
          {error && (
            <p style={{ color: '#B30038', fontSize: '14px', marginTop: '0.25rem' }}>
              {error}
            </p>
          )}
        </div>
      )

    case 'SdfFileUploadField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={component.id}
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}
          >
            {component.label}
            {component.required && <span style={{ color: '#B30038' }}> *</span>}
          </label>
          <input
            id={component.id}
            type="file"
            disabled={component.disabled}
            accept={component.accept ?? undefined}
            style={{ fontSize: '16px' }}
          />
          {error && (
            <p style={{ color: '#B30038', fontSize: '14px', marginTop: '0.25rem' }}>
              {error}
            </p>
          )}
        </div>
      )

    case 'SdfDescriptionField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>{component.label}</h3>
          {component.description && (
            <p style={{ color: '#555', lineHeight: 1.6 }}>
              {component.description}
            </p>
          )}
        </div>
      )

    case 'SdfDividerField':
      return (
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid #e6e6e6',
            margin: '1.5rem 0',
          }}
        />
      )

    case 'SdfKeyValueField':
      return (
        <div
          className="sdf-field"
          style={{
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderBottom: '1px solid #f2f2f2',
          }}
        >
          <span style={{ fontWeight: 600 }}>{component.label}</span>
          <span>{component.value}</span>
        </div>
      )

    case 'SdfAlertMessageField':
      return (
        <div
          className="sdf-field"
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '8px',
            border: `1px solid ${alertColor(component.alertType)}`,
            background: `${alertColor(component.alertType)}10`,
          }}
        >
          <strong>{component.title}</strong>
          {component.message && (
            <p style={{ marginTop: '0.5rem' }}>{component.message}</p>
          )}
        </div>
      )

    case 'SdfLinkField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1rem' }}>
          <a
            href={component.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0061ff', textDecoration: 'underline' }}
          >
            {component.label}
          </a>
        </div>
      )

    case 'SdfDisplayField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1rem' }}>
          <strong>{component.label}</strong>
          {component.value && (
            <p style={{ marginTop: '0.25rem' }}>{component.value}</p>
          )}
        </div>
      )

    case 'SdfSliderField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={component.id}
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}
          >
            {component.label}
          </label>
          <input
            id={component.id}
            type="range"
            min={component.min}
            max={component.max}
            step={component.step ?? 1}
            defaultValue={
              (currentValue as string) ??
              String(component.min ?? 0)
            }
            onChange={(e) => handleChange(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: '#666',
            }}
          >
            <span>{component.min}</span>
            <span>{String(currentValue ?? component.min ?? 0)}</span>
            <span>{component.max}</span>
          </div>
        </div>
      )

    case 'SdfSubmitField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          {component.actions?.map((action) => (
            <button
              key={action.event}
              type="button"
              style={{
                padding: '0.75rem 2rem',
                marginRight: '0.5rem',
                borderRadius: '8px',
                border:
                  action.type === 'primary'
                    ? 'none'
                    : '1px solid #0061ff',
                background:
                  action.type === 'primary' ? '#0061ff' : 'transparent',
                color:
                  action.type === 'primary' ? 'white' : '#0061ff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {action.name}
            </button>
          ))}
        </div>
      )

    case 'SdfImageField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            {component.label}
          </p>
          {component.imageUrl && (
            <img
              src={component.imageUrl}
              alt={component.label}
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
          )}
        </div>
      )

    case 'SdfBankAccountField':
      return (
        <div className="sdf-field" style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={component.id}
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}
          >
            {component.label}
          </label>
          <input
            id={component.id}
            type="text"
            placeholder="0000-00-000000"
            disabled={component.disabled}
            defaultValue={(currentValue as string) ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: error ? '2px solid #B30038' : '1px solid #ccdfff',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
          {error && (
            <p style={{ color: '#B30038', fontSize: '14px', marginTop: '0.25rem' }}>
              {error}
            </p>
          )}
        </div>
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
        <div
          className="sdf-field"
          style={{
            marginBottom: '1.5rem',
            border: '1px solid #e6e6e6',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: '1rem' }}>
            {component.addItemLabel ?? 'Items'}
          </p>
          {/* Repeater items are JSON-serialized by the backend */}
          <p style={{ color: '#888', fontSize: '14px' }}>
            Repeater rendering handled by the backend. Items are re-evaluated
            on REFETCH.
          </p>
        </div>
      )

    case 'SdfHiddenInputField':
    case 'SdfHiddenInputWithWatchedValueField':
    case 'SdfRedirectToServicePortalField':
    case 'SdfPaymentPendingField':
    case 'SdfCompanySearchField':
    case 'SdfAsyncSelectField':
    case 'SdfExpandableDescriptionField':
    case 'SdfAccordionField':
    case 'SdfActionCardListField':
    case 'SdfTableRepeaterField':
    case 'SdfStaticTableField':
    case 'SdfFindVehicleField':
    case 'SdfMessageWithLinkButtonField':
      return (
        <div
          className="sdf-field"
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            background: '#f8f8f8',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          [{component.__typename}] {component.label ?? component.id}
        </div>
      )

    default:
      return null
  }
}

function CustomComponentRenderer({
  componentName,
  rawProps,
  onAnswerChange,
}: {
  componentName: string
  rawProps: string
  onAnswerChange: (fieldId: string, value: unknown) => void
}) {
  const { component: Component } = getCustomComponent(componentName)
  const { parsed } = validateCustomComponentProps(componentName, rawProps)

  const DynComponent = Component as React.ComponentType<Record<string, unknown>>

  return (
    <DynComponent
      componentName={componentName}
      onAnswerChange={onAnswerChange}
      {...parsed}
    />
  )
}

function alertColor(alertType?: string): string {
  switch (alertType) {
    case 'error':
      return '#B30038'
    case 'warning':
      return '#F5A623'
    case 'success':
      return '#00B85C'
    case 'info':
    default:
      return '#0061FF'
  }
}
