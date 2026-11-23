import { Checkbox, Input } from '@island.is/island-ui/core'
import { expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ComponentProps, ReactNode, useContext } from 'react'
import { IntlProvider } from 'react-intl'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { BaseInput } from '../../BaseInput'
import { CheckboxSettings } from './CheckboxSettings'
import { TextFieldSettings } from './TextFieldSettings'

jest.mock('@island.is/form-system/ui', () => ({
  m: {
    type: { id: 'type', defaultMessage: 'Type' },
    chooseType: { id: 'chooseType', defaultMessage: 'Choose type' },
    name: { id: 'name', defaultMessage: 'Name' },
    nameEnglish: { id: 'nameEnglish', defaultMessage: 'English name' },
    required: { id: 'required', defaultMessage: 'Required' },
    informationText: { id: 'informationText', defaultMessage: 'Information' },
    informationTextEnglish: {
      id: 'informationTextEnglish',
      defaultMessage: 'English information',
    },
    tooltip: { id: 'tooltip', defaultMessage: 'Tooltip' },
    tooltipEnglish: { id: 'tooltipEnglish', defaultMessage: 'English tooltip' },
    subLabel: { id: 'subLabel', defaultMessage: 'Sublabel' },
    subLabelEnglish: {
      id: 'subLabelEnglish',
      defaultMessage: 'English sublabel',
    },
    largeTextArea: { id: 'largeTextArea', defaultMessage: 'Large text area' },
    largeCheckbox: { id: 'largeCheckbox', defaultMessage: 'Large checkbox' },
  },
}))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    formatMessage: (message: { defaultMessage: string }) =>
      message.defaultMessage,
  }),
}))

jest.mock('./ToggleConnection', () => ({ ToggleConnection: () => null }))

jest.mock('@island.is/island-ui/core', () => ({
  GridColumn: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridRow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Stack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Inline: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Select: () => null,
  Checkbox: ({
    label,
    checked,
    disabled,
    onChange,
  }: ComponentProps<typeof Checkbox>) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {label}
    </label>
  ),
  Input: ({
    label,
    name,
    value,
    readOnly,
    onChange,
    onFocus,
    onBlur,
  }: ComponentProps<typeof Input>) => (
    <label>
      {label}
      <input
        name={name}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </label>
  ),
}))

const renderSettings = (
  fieldType = 'TEXTBOX',
  isReadOnly = false,
  subLabel = { is: '', en: '' },
  isLarge = false,
) => {
  const controlDispatch = jest.fn()
  const updateActiveItem = jest.fn()
  const setFocus = jest.fn()
  const getTranslation = jest.fn(async (_text: string) => ({
    translation: 'Translated text',
  }))
  const Settings = () => {
    const defaults = useContext(ControlContext)
    return (
      <ControlContext.Provider
        value={{
          ...defaults,
          control: {
            ...defaults.control,
            activeItem: {
              ...defaults.control.activeItem,
              data: {
                id: 'field',
                fieldType,
                fieldSettings: { isLarge, subLabel },
                informationText: { is: 'Information text', en: '' },
                tooltip: { is: 'Help text', en: '' },
              },
            },
            form: { ...defaults.control.form },
            isReadOnly,
          },
          controlDispatch,
          updateActiveItem,
          setFocus,
          focus: '',
          getTranslation,
        }}
      >
        <IntlProvider locale="is" messages={{}}>
          <BaseInput />
          {fieldType === 'TEXTBOX' && <TextFieldSettings />}
          {fieldType === 'CHECKBOX' && <CheckboxSettings />}
        </IntlProvider>
      </ControlContext.Provider>
    )
  }
  render(<Settings />)
  return { controlDispatch, updateActiveItem, setFocus, getTranslation }
}

it.each(['TEXTBOX', 'NUMBERBOX', 'MESSAGE', 'CHECKBOX', 'BANK_ACCOUNT'])(
  'always exposes localized information and tooltip editors for %s',
  (fieldType) => {
    renderSettings(fieldType)
    expect(
      screen.getAllByRole('textbox', { name: 'Information' }),
    ).toHaveLength(1)
    expect(
      screen.getByRole('textbox', { name: 'English information' }),
    ).toBeTruthy()
    expect(screen.getAllByRole('textbox', { name: 'Tooltip' })).toHaveLength(1)
    expect(
      screen.getByRole('textbox', { name: 'English tooltip' }),
    ).toBeTruthy()
  },
)

it.each([
  {
    property: 'informationText',
    label: 'Information',
    text: 'Information text',
  },
  { property: 'tooltip', label: 'Tooltip', text: 'Help text' },
  { property: 'subLabel', label: 'Sublabel', text: 'Checkbox text' },
])(
  'edits, translates and saves $property',
  async ({ property, label, text }) => {
    const { controlDispatch, updateActiveItem, setFocus, getTranslation } =
      renderSettings('CHECKBOX', false, { is: 'Checkbox text', en: '' }, true)
    const input = screen.getByRole('textbox', { name: label })
    fireEvent.focus(input)
    expect(setFocus).toHaveBeenCalledWith(text)
    fireEvent.change(input, { target: { value: 'Edited text' } })
    expect(controlDispatch).toHaveBeenCalledWith({
      type: 'CHANGE_FIELD_TEXT',
      payload: { property, lang: 'is', newValue: 'Edited text' },
    })
    fireEvent.blur(input, { target: { value: 'Edited text' } })
    expect(updateActiveItem).toHaveBeenCalledTimes(1)

    fireEvent.focus(
      screen.getByRole('textbox', { name: `English ${label.toLowerCase()}` }),
    )
    await waitFor(() =>
      expect(controlDispatch).toHaveBeenCalledWith({
        type: 'CHANGE_FIELD_TEXT',
        payload: { property, lang: 'en', newValue: 'Translated text' },
      }),
    )
    expect(getTranslation).toHaveBeenCalledWith(text)
  },
)

it.each([
  { is: 'Sublabel', en: '' },
  { is: '', en: 'English sublabel' },
])('prevents disabling large checkboxes with sublabel %j', (subLabel) => {
  renderSettings('CHECKBOX', false, subLabel, true)
  expect(
    screen
      .getByRole('checkbox', { name: 'Large checkbox' })
      .hasAttribute('disabled'),
  ).toBe(true)
})

it('omits the information editor for applicants while preserving the tooltip editor', () => {
  renderSettings('APPLICANT')

  expect(screen.queryByRole('textbox', { name: 'Information' })).toBeNull()
  expect(
    screen.queryByRole('textbox', { name: 'English information' }),
  ).toBeNull()
  expect(screen.getByRole('textbox', { name: 'Tooltip' })).toBeTruthy()
})

it('preserves the large-checkbox setting and exposes sublabel editors only when enabled', () => {
  const { controlDispatch, updateActiveItem } = renderSettings('CHECKBOX')
  expect(screen.queryByRole('textbox', { name: 'Sublabel' })).toBeNull()
  fireEvent.click(screen.getByRole('checkbox', { name: 'Large checkbox' }))
  expect(controlDispatch).toHaveBeenCalledWith({
    type: 'SET_FIELD_SETTINGS',
    payload: { property: 'isLarge', value: true, update: updateActiveItem },
  })
})

it('keeps content editors read-only without translating on focus', () => {
  const { getTranslation } = renderSettings('TEXTBOX', true)
  for (const name of [
    'Information',
    'English information',
    'Tooltip',
    'English tooltip',
  ]) {
    const input = screen.getByRole('textbox', { name })
    expect(input.hasAttribute('readonly')).toBe(true)
    fireEvent.focus(input)
  }
  expect(getTranslation).not.toHaveBeenCalled()
})
