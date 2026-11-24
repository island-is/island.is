import { FormSystemField } from '@island.is/api/schema'
import {
  Checkbox,
  Input,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { expect, it, jest } from '@jest/globals'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  ComponentProps,
  ReactNode,
  useContext,
  useReducer,
  useRef,
} from 'react'
import { IntlProvider } from 'react-intl'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { controlReducer } from '../../../../../../../hooks/controlReducer'
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
  ToggleSwitchCheckbox: ({
    label,
    checked,
    disabled,
    onChange,
  }: ComponentProps<typeof ToggleSwitchCheckbox>) => (
    <label>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  ),
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
  content: Pick<FormSystemField, 'informationText' | 'tooltip'> = {
    informationText: { is: 'Information text', en: '' },
    tooltip: { is: 'Help text', en: '' },
  },
) => {
  const controlDispatch = jest.fn()
  const updateActiveItem = jest.fn()
  const setFocus = jest.fn()
  const getTranslation = jest.fn(async (_text: string) => ({
    translation: 'Translated text',
  }))
  const field = {
    id: 'field',
    fieldType,
    fieldSettings: { isLarge, subLabel },
    ...content,
  } as FormSystemField
  const otherField = { ...field, id: 'other-field' }
  let selectField: (field: FormSystemField) => void
  let removeOriginalField: () => void
  let changeOriginalInformation: (text: string) => void
  const Settings = () => {
    const defaults = useContext(ControlContext)
    const [control, dispatch] = useReducer(controlReducer, {
      ...defaults.control,
      activeItem: {
        ...defaults.control.activeItem,
        data: field,
      },
      form: { ...defaults.control.form, fields: [field, otherField] },
      isReadOnly,
    })
    const controlRef = useRef(control)
    controlRef.current = control
    selectField = (data) =>
      dispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: { activeItem: { type: 'Field', data } },
      })
    removeOriginalField = () =>
      dispatch({
        type: 'REMOVE_FIELD',
        payload: { id: field.id, skipActiveItem: true },
      })
    changeOriginalInformation = (newValue) =>
      dispatch({
        type: 'CHANGE_FIELD_TEXT',
        payload: {
          fieldId: field.id,
          property: 'informationText',
          lang: 'is',
          newValue,
        },
      })
    return (
      <ControlContext.Provider
        value={{
          ...defaults,
          control,
          controlDispatch: (action) => {
            controlDispatch(action)
            dispatch(action)
          },
          updateActiveItem,
          setFocus,
          focus: '',
          getTranslation,
          getField: (fieldId) =>
            controlRef.current.form.fields?.find(
              (item) => item?.id === fieldId,
            ) ?? undefined,
        }}
      >
        <IntlProvider locale="is" defaultLocale="is" messages={{}}>
          <BaseInput />
          {fieldType === 'TEXTBOX' && <TextFieldSettings />}
          {fieldType === 'CHECKBOX' && <CheckboxSettings />}
        </IntlProvider>
      </ControlContext.Provider>
    )
  }
  render(<Settings />)
  return {
    controlDispatch,
    updateActiveItem,
    setFocus,
    getTranslation,
    selectOtherField: () => selectField(otherField),
    selectOriginalField: () => selectField(field),
    removeOriginalField: () => removeOriginalField(),
    changeOriginalInformation: (text: string) =>
      changeOriginalInformation(text),
  }
}

it.each(['TEXTBOX', 'NUMBERBOX', 'CHECKBOX', 'NATIONAL_ID', 'EMAIL'])(
  'exposes localized editors for populated information and tooltip content for %s',
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

it.each(['MESSAGE', 'BANK_ACCOUNT', 'PHONE_NUMBER'])(
  'omits the tooltip toggle and both inputs for %s without hiding information text',
  (fieldType) => {
    renderSettings(fieldType)

    expect(screen.queryByRole('switch', { name: 'Tooltip' })).toBeNull()
    expect(screen.queryByRole('textbox', { name: 'Tooltip' })).toBeNull()
    expect(
      screen.queryByRole('textbox', { name: 'English tooltip' }),
    ).toBeNull()
    expect(screen.getByRole('textbox', { name: 'Information' })).toBeTruthy()
    expect(
      screen.getByRole('textbox', { name: 'English information' }),
    ).toBeTruthy()
  },
)

it.each([false, true])(
  'always shows both message information inputs without a toggle (read-only: %s)',
  (isReadOnly) => {
    renderSettings('MESSAGE', isReadOnly, undefined, false, {})

    expect(screen.queryByRole('switch', { name: 'Information' })).toBeNull()
    expect(screen.getAllByText(/Upplýsingatextinn getur/)).toHaveLength(1)
    for (const name of ['Information', 'English information']) {
      expect(screen.getByRole('textbox', { name })).toHaveProperty(
        'readOnly',
        isReadOnly,
      )
    }
  },
)

it('shows HTML guidance above information inputs only while they are visible', () => {
  renderSettings('TEXTBOX', false, undefined, false, {})

  expect(screen.queryByText(/Upplýsingatextinn getur/)).toBeNull()
  fireEvent.click(screen.getByRole('switch', { name: 'Tooltip' }))
  expect(screen.queryByText(/Upplýsingatextinn getur/)).toBeNull()

  fireEvent.click(screen.getByRole('switch', { name: 'Information' }))
  const guidance = screen.getByText(/Upplýsingatextinn getur/)
  for (const name of ['Information', 'English information']) {
    expect(
      guidance.compareDocumentPosition(screen.getByRole('textbox', { name })) &
        4,
    ).toBe(4)
  }

  fireEvent.click(screen.getByRole('switch', { name: 'Information' }))
  expect(screen.queryByText(/Upplýsingatextinn getur/)).toBeNull()
})

it.each([
  { is: 'Icelandic text', en: '' },
  { is: '', en: 'English text' },
  { is: ' ', en: '\n' },
  null,
  undefined,
])('initializes the content toggles from both languages: %j', (text) => {
  renderSettings('TEXTBOX', false, undefined, false, {
    informationText: text,
    tooltip: text,
  })
  const hasText = Boolean(text?.is?.trim() || text?.en?.trim())
  expect(screen.queryByText(/Upplýsingatextinn getur/) !== null).toBe(hasText)
  for (const label of ['Information', 'Tooltip']) {
    const toggle = screen.getByRole('switch', { name: label })
    expect(toggle).toHaveProperty('checked', hasText)
    expect(toggle).toHaveProperty('disabled', hasText)
    expect(screen.queryByRole('textbox', { name: label }) !== null).toBe(
      hasText,
    )
    expect(
      screen.queryByRole('textbox', {
        name: `English ${label.toLowerCase()}`,
      }) !== null,
    ).toBe(hasText)
  }
})

it.each(['Information', 'Tooltip'])(
  'toggles both %s language inputs independently and prevents disabling populated text',
  (label) => {
    const { controlDispatch } = renderSettings(
      'TEXTBOX',
      false,
      undefined,
      false,
      {
        informationText: { is: '', en: '' },
        tooltip: { is: '', en: '' },
      },
    )
    const toggle = screen.getByRole('switch', { name: label })
    fireEvent.click(toggle)
    expect(toggle).toHaveProperty('checked', true)
    expect(
      screen.getByRole('switch', {
        name: label === 'Information' ? 'Tooltip' : 'Information',
      }),
    ).toHaveProperty('checked', false)
    expect(controlDispatch).not.toHaveBeenCalled()

    for (const name of [label, `English ${label.toLowerCase()}`]) {
      const input = screen.getByRole('textbox', { name })
      fireEvent.change(input, { target: { value: 'Text' } })
      expect(toggle).toHaveProperty('disabled', true)
      expect(toggle).toHaveProperty('checked', true)

      fireEvent.change(input, { target: { value: '' } })
      expect(toggle).toHaveProperty('disabled', false)
      expect(toggle).toHaveProperty('checked', true)
    }

    fireEvent.click(toggle)
    expect(toggle).toHaveProperty('checked', false)
    expect(screen.queryByRole('textbox', { name: label })).toBeNull()
    expect(
      screen.queryByRole('textbox', {
        name: `English ${label.toLowerCase()}`,
      }),
    ).toBeNull()
  },
)

it('disables empty content toggles in read-only forms', () => {
  renderSettings('TEXTBOX', true, undefined, false, {})
  for (const label of ['Information', 'Tooltip']) {
    const toggle = screen.getByRole('switch', { name: label })
    expect(toggle).toHaveProperty('disabled', true)
    expect(screen.queryByRole('textbox', { name: label })).toBeNull()
  }
})

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
      payload: {
        property,
        lang: 'is',
        newValue: 'Edited text',
        fieldId: 'field',
      },
    })
    fireEvent.blur(input, { target: { value: 'Edited text' } })
    expect(updateActiveItem).toHaveBeenCalledTimes(1)

    fireEvent.focus(
      screen.getByRole('textbox', { name: `English ${label.toLowerCase()}` }),
    )
    await waitFor(() =>
      expect(controlDispatch).toHaveBeenCalledWith({
        type: 'CHANGE_FIELD_TEXT',
        payload: {
          property,
          lang: 'en',
          newValue: 'Translated text',
          fieldId: 'field',
        },
      }),
    )
    expect(getTranslation).toHaveBeenCalledWith('Edited text')
    expect(updateActiveItem).toHaveBeenLastCalledWith({
      type: 'Field',
      data: expect.objectContaining({
        id: 'field',
        ...(property === 'subLabel'
          ? {
              fieldSettings: expect.objectContaining({
                isLarge: true,
                subLabel: { is: 'Edited text', en: 'Translated text' },
              }),
            }
          : { [property]: { is: 'Edited text', en: 'Translated text' } }),
      }),
    })
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

it('omits applicant tooltip and information editors', () => {
  renderSettings('APPLICANT')

  expect(screen.queryByRole('textbox', { name: 'Information' })).toBeNull()
  expect(
    screen.queryByRole('textbox', { name: 'English information' }),
  ).toBeNull()
  expect(screen.queryByRole('switch', { name: 'Tooltip' })).toBeNull()
  expect(screen.queryByRole('textbox', { name: 'Tooltip' })).toBeNull()
  expect(screen.queryByRole('textbox', { name: 'English tooltip' })).toBeNull()
})

it.each(['Typed translation', ''])(
  'does not overwrite an English edit made during translation: %j',
  async (value) => {
    const { getTranslation, controlDispatch, updateActiveItem } =
      renderSettings()
    let resolveTranslation!: (value: { translation: string }) => void
    getTranslation.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveTranslation = resolve
        }),
    )
    const input = screen.getByRole('textbox', { name: 'English information' })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Typed translation' } })
    if (!value) fireEvent.change(input, { target: { value: '' } })
    controlDispatch.mockClear()

    await act(async () =>
      resolveTranslation({ translation: 'Late translation' }),
    )

    expect(input).toHaveProperty('value', value)
    expect(controlDispatch).not.toHaveBeenCalled()
    expect(updateActiveItem).not.toHaveBeenCalled()
  },
)

it('applies and saves a completed translation using the originating field current data after selection changes', async () => {
  const {
    getTranslation,
    controlDispatch,
    updateActiveItem,
    selectOtherField,
    changeOriginalInformation,
  } = renderSettings()
  let resolveTranslation!: (value: { translation: string }) => void
  getTranslation.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveTranslation = resolve
      }),
  )
  fireEvent.focus(screen.getByRole('textbox', { name: 'English information' }))
  act(() => {
    selectOtherField()
    changeOriginalInformation('Current instructions')
  })
  controlDispatch.mockClear()

  await act(async () =>
    resolveTranslation({ translation: 'Original field translation' }),
  )

  expect(controlDispatch).toHaveBeenCalledWith({
    type: 'CHANGE_FIELD_TEXT',
    payload: {
      fieldId: 'field',
      property: 'informationText',
      lang: 'en',
      newValue: 'Original field translation',
    },
  })
  expect(
    screen.getByRole('textbox', { name: 'English information' }),
  ).toHaveProperty('value', '')
  expect(updateActiveItem).toHaveBeenCalledWith({
    type: 'Field',
    data: expect.objectContaining({
      id: 'field',
      informationText: {
        is: 'Current instructions',
        en: 'Original field translation',
      },
    }),
  })
})

it('preserves English edits made after returning to a field with a pending translation', async () => {
  const {
    getTranslation,
    controlDispatch,
    updateActiveItem,
    selectOtherField,
    selectOriginalField,
  } = renderSettings()
  let resolveTranslation!: (value: { translation: string }) => void
  getTranslation.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveTranslation = resolve
      }),
  )
  fireEvent.focus(screen.getByRole('textbox', { name: 'English information' }))
  act(selectOtherField)
  act(selectOriginalField)
  const input = screen.getByRole('textbox', { name: 'English information' })
  fireEvent.change(input, { target: { value: 'User translation' } })
  controlDispatch.mockClear()

  await act(async () => resolveTranslation({ translation: 'Late translation' }))

  expect(input).toHaveProperty('value', 'User translation')
  expect(controlDispatch).not.toHaveBeenCalled()
  expect(updateActiveItem).not.toHaveBeenCalled()
})

it('discards a pending translation when its field is deleted', async () => {
  const {
    getTranslation,
    controlDispatch,
    updateActiveItem,
    selectOtherField,
    removeOriginalField,
  } = renderSettings()
  let resolveTranslation!: (value: { translation: string }) => void
  getTranslation.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveTranslation = resolve
      }),
  )
  fireEvent.focus(screen.getByRole('textbox', { name: 'English information' }))
  act(() => {
    selectOtherField()
    removeOriginalField()
  })
  controlDispatch.mockClear()

  await act(async () => resolveTranslation({ translation: 'Late translation' }))

  expect(controlDispatch).not.toHaveBeenCalled()
  expect(updateActiveItem).not.toHaveBeenCalled()
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
