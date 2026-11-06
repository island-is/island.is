import {
  FormSystemField,
  FormSystemForm,
  FormSystemSection,
} from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { PreviewStepOrGroup } from './PreviewStepOrGroup'

jest.mock('./PreviewStepOrGroup.css', () => ({}))
jest.mock('@apollo/client/react', () => ({ useQuery: () => ({}) }))
jest.mock('@island.is/localization', () => ({
  LocaleContext: jest.requireActual('react').createContext({
    loadedNamespaces: [],
    lang: 'is',
    messages: {},
  }),
  useLocale: () => ({
    lang: 'is',
    formatMessage: (message: { defaultMessage: string }) =>
      message.defaultMessage,
    changeLanguage: jest.fn(),
  }),
}))
jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  IntlProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))
jest.mock('@island.is/form-system/ui', () => ({
  SectionTypes: jest.requireActual('@island.is/form-system/enums').SectionTypes,
  FormStepper: () => null,
  m: {
    continue: { defaultMessage: 'Continue' },
    back: { defaultMessage: 'Back' },
    preview: { defaultMessage: 'Preview' },
  },
}))
jest.mock('@island.is/island-ui/core', () => {
  const Container = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
  return {
    Box: Container,
    GridColumn: Container,
    GridContainer: Container,
    GridRow: Container,
    Text: Container,
    Header: () => null,
    ModalBase: ({
      children,
    }: {
      children: (args: { closeModal: () => void }) => ReactNode
    }) => <>{children({ closeModal: jest.fn() })}</>,
    Button: ({
      children,
      onClick,
      disabled,
    }: ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
  }
})
jest.mock('./components/PreviewSections', () => ({
  PreviewPremises: () => null,
  PreviewSummary: ({
    sections,
    hasValidationError,
    onNavigate,
  }: {
    sections: FormSystemSection[]
    hasValidationError: (field: FormSystemField, valueIndex: number) => boolean
    onNavigate: (sectionId: string, screenId?: string) => void
  }) => (
    <>
      {sections.flatMap((section) =>
        (section.screens ?? []).flatMap((step) =>
          (step?.fields ?? []).map((field) =>
            field && hasValidationError(field, 0) ? (
              <span key={field.id}>Vantar gildi</span>
            ) : null,
          ),
        ),
      )}
      <button onClick={() => onNavigate('input', 'first')}>
        Edit first screen
      </button>
    </>
  ),
}))
jest.mock('./components/PreviewCompleted', () => ({
  PreviewCompleted: () => null,
}))
jest.mock('./components/MultiSet', () => ({ MultiSet: () => null }))
jest.mock('../Preview/Preview', () => {
  const { Controller, useFormContext } =
    jest.requireActual<typeof import('react-hook-form')>('react-hook-form')
  return {
    Preview: ({
      data,
      dispatch,
    }: {
      data: FormSystemField
      dispatch: (action: unknown) => void
    }) => {
      const { control } = useFormContext()
      if (data.fieldType === 'CHECKBOX') {
        return (
          <input
            type="checkbox"
            aria-label={data.id}
            checked={data.values?.[0]?.json?.checkboxValue ?? false}
            onChange={(event) =>
              dispatch({
                type: 'SET_CHECKBOX_VALUE',
                payload: { id: data.id, value: event.target.checked },
              })
            }
          />
        )
      }
      return (
        <Controller
          name={`${data.id}.0`}
          control={control}
          defaultValue={data.values?.[0]?.json?.text ?? ''}
          rules={{
            required: data.isRequired ?? false,
            validate: (value) =>
              !data.fieldSettings?.minLength ||
              !value ||
              value.length >= data.fieldSettings.minLength ||
              'Too short',
          }}
          render={({ field, fieldState }) => (
            <>
              <input
                aria-label={data.id}
                {...field}
                onChange={(event) => {
                  field.onChange(event)
                  dispatch({
                    type: 'SET_TEXT',
                    payload: { id: data.id, value: event.target.value },
                  })
                }}
              />
              {fieldState.error && <span role="alert">Required</span>}
            </>
          )}
        />
      )
    },
  }
})

const form = {
  sections: [
    { id: 'applicants', sectionType: SectionTypes.PARTIES },
    { id: 'input', sectionType: SectionTypes.INPUT },
  ],
  screens: [
    {
      id: 'applicant-screen',
      sectionId: 'applicants',
      name: { is: 'Applicants' },
    },
    { id: 'first', sectionId: 'input', name: { is: 'First screen' } },
    {
      id: 'conditional',
      sectionId: 'input',
      name: { is: 'Conditional screen' },
    },
    { id: 'last', sectionId: 'input', name: { is: 'Last screen' } },
  ],
  fields: [
    {
      id: 'required',
      screenId: 'first',
      fieldType: FieldTypesEnum.TEXTBOX,
      isRequired: true,
    },
    { id: 'parent', screenId: 'first', fieldType: FieldTypesEnum.CHECKBOX },
  ],
  dependencies: [
    { parentProp: 'parent', childProps: ['conditional'], isSelected: false },
  ],
} as unknown as FormSystemForm

const renderPreview = (
  enforceRestrictions: boolean,
  allowProceedOnValidationFail?: boolean,
  previewForm = form,
) =>
  render(
    <ControlContext.Provider
      value={
        {
          control: {
            form: { ...previewForm, allowProceedOnValidationFail },
            activeItem: { type: 'Screen', data: { id: 'last' } },
          },
          setSelectStatus: jest.fn(),
        } as unknown as React.ContextType<typeof ControlContext>
      }
    >
      <PreviewStepOrGroup
        enforceRestrictions={enforceRestrictions}
        setOpenPreview={jest.fn()}
      />
    </ControlContext.Provider>,
  )

it.each([false, undefined])(
  'starts after applicants and reveals dependent screens with bypass=%s',
  async (allowProceedOnValidationFail) => {
    renderPreview(true, allowProceedOnValidationFail)
    expect(screen.getByText('First screen')).toBeTruthy()
    fireEvent.change(screen.getByRole('textbox', { name: 'required' }), {
      target: { value: 'Valid' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'parent' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() =>
      expect(screen.getByText('Conditional screen')).toBeTruthy(),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('textbox', { name: 'required' })).toHaveProperty(
      'value',
      'Valid',
    )
    fireEvent.click(screen.getByRole('checkbox', { name: 'parent' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(screen.getByText('Last screen')).toBeTruthy())
  },
)

it.each([
  { selected: false, bypass: false },
  { selected: true, bypass: false },
  { selected: false, bypass: true },
  { selected: true, bypass: true },
  { selected: false, bypass: undefined },
  { selected: true, bypass: undefined },
])(
  'allows invalid fields with bypass=$bypass and respects dependencies with selected=$selected',
  async ({ selected, bypass }) => {
    renderPreview(true, bypass)
    expect(screen.getByText('First screen')).toBeTruthy()
    expect(screen.getByRole('textbox', { name: 'required' })).toHaveProperty(
      'value',
      '',
    )
    if (selected) {
      fireEvent.click(screen.getByRole('checkbox', { name: 'parent' }))
    }
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() =>
      expect(
        screen.getByText(selected ? 'Conditional screen' : 'Last screen'),
      ).toBeTruthy(),
    )
  },
)

it('keeps ordinary preview at the selected screen and does not block invalid fields', async () => {
  renderPreview(false)
  expect(screen.getByText('Last screen')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
  expect(screen.getByText('First screen')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  await waitFor(() =>
    expect(screen.getByText('Conditional screen')).toBeTruthy(),
  )
})

it.each([false, true, undefined])(
  'preserves optional rule failures in summary with bypass=%s and clears them after correction',
  async (bypass) => {
    renderPreview(true, bypass, {
      ...form,
      sections: [
        ...(form.sections ?? []),
        {
          id: 'summary',
          sectionType: SectionTypes.SUMMARY,
          name: { is: 'Summary' },
        },
      ],
      fields: [
        {
          id: 'optional',
          screenId: 'first',
          fieldType: FieldTypesEnum.TEXTBOX,
          isRequired: false,
          fieldSettings: { minLength: 3 },
        },
      ],
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'optional' }), {
      target: { value: '12' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(screen.getByText('Last screen')).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(screen.getByText('Vantar gildi')).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: 'Edit first screen' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'optional' }), {
      target: { value: '123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(screen.getByText('Last screen')).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Edit first screen' }),
      ).toBeTruthy(),
    )
    expect(screen.queryByText('Vantar gildi')).toBeNull()
  },
)
