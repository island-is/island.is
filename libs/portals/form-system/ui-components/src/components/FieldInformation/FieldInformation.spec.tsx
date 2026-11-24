import { FormSystemField } from '@island.is/api/schema'
import { render, screen } from '@testing-library/react'
import { InputHTMLAttributes, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { Checkbox } from '../FieldComponents/Checkbox/Checkbox'
import { Email } from '../FieldComponents/Email/Email'
import { MessageWithLink } from '../FieldComponents/MessageWithLink/MessageWithLink'
import { NumberInput } from '../FieldComponents/NumberInput/NumberInput'
import { PhoneNumber } from '../FieldComponents/PhoneNumber/PhoneNumber'
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
  GridColumn: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridRow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Stack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  Tooltip: ({ text }: { text: string }) => <span title={text}>Help</span>,
  PhoneInput: ({
    label,
    tooltip,
    name,
    value,
  }: {
    label: string
    tooltip?: string
    name: string
    value: string
  }) => (
    <input
      aria-label={label}
      title={tooltip}
      name={name}
      value={value}
      readOnly
    />
  ),
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
    EMAIL: Email,
    PHONE_NUMBER: PhoneNumber,
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

it.each([
  'TEXTBOX',
  'NUMBERBOX',
  'CHECKBOX',
  'EMAIL',
  'BANK_ACCOUNT',
  'DROPDOWN_LIST',
])(
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

it.each(['is', 'en'])(
  'renders nested strong and em information text in %s',
  (lang) => {
    mockLang = lang
    renderField('TEXTBOX', {
      informationText: {
        is: 'A <strong>bold <em>instruction</em></strong>.',
        en: 'An <em>English <strong>instruction</strong></em>.',
      },
    })

    const instruction = screen.getByText('instruction')
    expect(instruction.tagName).toBe(lang === 'is' ? 'EM' : 'STRONG')
    expect(instruction.parentElement?.tagName).toBe(
      lang === 'is' ? 'STRONG' : 'EM',
    )
    expect(instruction.closest('p')?.textContent).toBe(
      lang === 'is' ? 'A bold instruction.' : 'An English instruction.',
    )
  },
)

it.each(['\n', '\n\n', '\r\n'])(
  'preserves line breaks between formatted information text: %j',
  (separator) => {
    renderField('TEXTBOX', {
      informationText: {
        is: `<strong>First</strong>${separator}<em>Second</em>`,
      },
    })

    expect(screen.getByText('First').closest('p')?.textContent).toBe(
      `First${separator}Second`,
    )
  },
)

it('removes unsupported HTML and attributes from information text', () => {
  const { container } = renderField('TEXTBOX', {
    informationText: {
      is: '<script>alert(1)</script><img src="x" onerror="alert(1)"><strong onclick="alert(1)" style="color:red">Safe</strong><em class="unsafe">emphasis</em><a href="javascript:alert(1)">text</a>',
    },
  })

  expect(container.querySelector('script, img, a')).toBeNull()
  expect(container.textContent).not.toContain('alert(1)')
  expect(screen.getByText('Safe').attributes).toHaveLength(0)
  expect(screen.getByText('emphasis').attributes).toHaveLength(0)
  expect(screen.getByText('Safe').closest('p')?.textContent).toBe(
    'Safeemphasistext',
  )
})

it.each(['Instructions', ''])(
  'omits the national ID tooltip above the input while preserving information text: %j',
  (informationText) => {
    renderField('NATIONAL_ID', {
      informationText: { is: informationText },
    })

    expect(screen.queryByTitle('Help text')).toBeNull()
    expect(screen.queryByText('Instructions') !== null).toBe(
      Boolean(informationText),
    )
  },
)

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

it.each(['is', 'en'])('omits saved phone tooltips in %s', (lang) => {
  mockLang = lang
  const { container } = renderField('PHONE_NUMBER')

  expect(container.querySelector('[title]')).toBeNull()
  expect(
    screen.getByText(lang === 'is' ? 'Instructions' : 'English instructions'),
  ).toBeTruthy()
})

it.each(['is', 'en'])(
  'renders the localized email tooltip only inside the input in %s',
  (lang) => {
    mockLang = lang
    renderField('EMAIL', {
      tooltip: { is: '  Help text  ', en: '  English help text  ' },
    })

    expect(
      screen.getAllByTitle(lang === 'is' ? 'Help text' : 'English help text'),
    ).toEqual([screen.getByRole('textbox', { name: 'Field' })])
  },
)

it.each([
  'TEXTBOX',
  'NUMBERBOX',
  'CHECKBOX',
  'PHONE_NUMBER',
  'EMAIL',
  'BANK_ACCOUNT',
])('omits empty and whitespace-only content for %s', (fieldType) => {
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
})
