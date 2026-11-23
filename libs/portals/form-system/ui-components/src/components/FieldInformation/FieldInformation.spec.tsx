import { FormSystemField } from '@island.is/api/schema'
import { render, screen } from '@testing-library/react'
import { InputHTMLAttributes, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { Checkbox } from '../FieldComponents/Checkbox/Checkbox'
import { MessageWithLink } from '../FieldComponents/MessageWithLink/MessageWithLink'
import { NumberInput } from '../FieldComponents/NumberInput/NumberInput'
import { TextInput } from '../FieldComponents/TextInput/TextInput'
import { FieldInformation } from './FieldInformation'

let mockLang = 'is'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: mockLang,
    formatMessage: (message: { defaultMessage: string }) =>
      message.defaultMessage,
  }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  Tooltip: ({ text }: { text: string }) => <span title={text}>Help</span>,
  Input: ({
    label,
    tooltip,
    backgroundColor,
    errorMessage,
    textarea,
    ...props
  }: InputHTMLAttributes<HTMLInputElement> & {
    label: string
    tooltip?: string
    backgroundColor?: string
    errorMessage?: string
    textarea?: boolean
  }) => <input {...props} aria-label={label} title={tooltip} />,
  Checkbox: ({
    label,
    subLabel,
    tooltip,
    checked,
    onChange,
  }: {
    label: ReactNode
    subLabel?: string
    tooltip?: string
    checked?: boolean
    onChange: InputHTMLAttributes<HTMLInputElement>['onChange']
  }) => (
    <label>
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        title={tooltip}
      />
      {subLabel && <span>{subLabel}</span>}
    </label>
  ),
}))

const renderField = (
  fieldType: string,
  values: Partial<FormSystemField> = {},
) => {
  const item: FormSystemField = {
    id: 'field',
    name: { is: 'Field', en: 'Field' },
    isRequired: false,
    isPartOfMultiset: false,
    screenId: 'screen',
    fieldType,
    informationText: { is: 'Instructions', en: 'English instructions' },
    tooltip: { is: 'Help text', en: 'English help text' },
    fieldSettings: {
      isLarge: true,
      subLabel: { is: 'Sublabel', en: 'English sublabel' },
    },
    ...values,
  }
  const components = {
    TEXTBOX: TextInput,
    NUMBERBOX: NumberInput,
    CHECKBOX: Checkbox,
    MESSAGE: MessageWithLink,
  }
  const Component = components[fieldType as keyof typeof components]
  const Form = () => {
    const methods = useForm()
    return (
      <IntlProvider locale="is" messages={{}}>
        <FormProvider {...methods}>
          <FieldInformation item={item} />
          {Component ? (
            <Component item={item} />
          ) : (
            <input aria-label="Other field" />
          )}
        </FormProvider>
      </IntlProvider>
    )
  }
  return render(<Form />)
}

beforeEach(() => {
  mockLang = 'is'
})

it.each(['TEXTBOX', 'NUMBERBOX', 'CHECKBOX', 'BANK_ACCOUNT', 'DROPDOWN_LIST'])(
  'renders information above the %s input and displays its tooltip without a visibility flag',
  (fieldType) => {
    renderField(fieldType)
    const information = screen.getByText('Instructions')
    const input = screen.getByRole(
      fieldType === 'CHECKBOX'
        ? 'checkbox'
        : fieldType === 'NUMBERBOX'
        ? 'spinbutton'
        : 'textbox',
    )
    expect(information.compareDocumentPosition(input) & 4).toBe(4)
    expect(screen.getAllByTitle('Help text')).toHaveLength(1)
  },
)

it('renders message information as its body only once', () => {
  renderField('MESSAGE')
  expect(screen.getAllByText('Instructions')).toHaveLength(1)
})

it('omits applicant information text while preserving its tooltip', () => {
  renderField('APPLICANT')

  expect(screen.queryByText('Instructions')).toBeNull()
  expect(screen.getByTitle('Help text')).toBeTruthy()
})

it('renders localized information, tooltip and checkbox sublabel', () => {
  mockLang = 'en'
  renderField('CHECKBOX')
  expect(screen.getByText('English instructions')).toBeTruthy()
  expect(screen.getByTitle('English help text')).toBeTruthy()
  expect(screen.getByText('English sublabel')).toBeTruthy()
  expect(screen.queryByText('Instructions')).toBeNull()
})

it.each(['TEXTBOX', 'NUMBERBOX', 'CHECKBOX', 'BANK_ACCOUNT'])(
  'omits empty and whitespace-only content for %s',
  (fieldType) => {
    const { container } = renderField(fieldType, {
      informationText: { is: ' \n ', en: 'English instructions' },
      tooltip: { is: ' \t ', en: 'English help' },
      fieldSettings: {
        isLarge: true,
        subLabel: { is: ' \n ', en: 'English sublabel' },
      },
    })
    expect(container.querySelector('[title]')).toBeNull()
    expect(container.textContent).toBe(fieldType === 'CHECKBOX' ? 'Field' : '')
  },
)
