import {
  FormSystemField,
  FormSystemForm,
  FormSystemSection,
} from '@island.is/api/schema'
import {
  ApplicantTypesEnum,
  FieldTypesEnum,
  SectionTypes,
} from '@island.is/form-system/enums'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
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
  FormStepper: ({ sections }: { sections: FormSystemSection[] }) => (
    <div data-testid="applicant-steps">
      {sections
        .filter(
          (section) =>
            section.sectionType ===
            jest.requireActual('@island.is/form-system/enums').SectionTypes
              .PARTIES,
        )
        .flatMap((section) => section.screens ?? [])
        .map((step) => (
          <span key={step?.id}>{step?.id}</span>
        ))}
    </div>
  ),
  m: {
    continue: { defaultMessage: 'Continue' },
    back: { defaultMessage: 'Back' },
    preview: { defaultMessage: 'Preview' },
    relevantParties: { defaultMessage: 'Applicants' },
    individual: { defaultMessage: 'Einstaklingur (innskráður)' },
    individualWithPowerOfAttorney: {
      defaultMessage: 'Einstaklingur með prókúru',
    },
    individualOnBehalfPerson: {
      defaultMessage: 'Einstaklingur í umboði annars einstaklings',
    },
    individualOnBehalfLegalEntity: {
      defaultMessage: 'Einstaklingur í umboði lögaðila',
    },
    legalGuardian: { defaultMessage: 'Forsjáraðili' },
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
    Stack: Container,
    Header: () => null,
    RadioButton: ({
      label,
      ...props
    }: InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
      <label>
        {label}
        <input
          type="radio"
          name={props.name}
          value={props.value}
          checked={props.checked}
          onChange={props.onChange}
        />
      </label>
    ),
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
            field?.fieldType === 'APPLICANT' ? (
              <span key={field.id}>{field.id}</span>
            ) : field && hasValidationError(field, 0) ? (
              <span key={field.id}>Vantar gildi</span>
            ) : null,
          ),
        ),
      )}
      <button onClick={() => onNavigate('input', 'first')}>
        Edit first screen
      </button>
      <button onClick={() => onNavigate('applicants', 'applicant-screen')}>
        Edit applicants
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

const loginForm = {
  ...form,
  sections: [
    {
      id: 'applicants',
      sectionType: SectionTypes.PARTIES,
      name: { is: 'Applicants' },
    },
    {
      id: 'summary',
      sectionType: SectionTypes.SUMMARY,
      name: { is: 'Summary' },
    },
  ],
  screens: Object.values(ApplicantTypesEnum).map((applicantType) => ({
    id: `screen-${applicantType}`,
    sectionId: 'applicants',
  })),
  fields: Object.values(ApplicantTypesEnum).map((applicantType) => ({
    id: `applicant-${applicantType}`,
    screenId: `screen-${applicantType}`,
    fieldType: FieldTypesEnum.APPLICANT,
    fieldSettings: { applicantType },
  })),
  dependencies: [],
} as unknown as FormSystemForm

it.each([
  {
    label: 'Einstaklingur (innskráður)',
    types: [ApplicantTypesEnum.INDIVIDUAL],
  },
  {
    label: 'Einstaklingur með prókúru',
    types: [
      ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
      ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER,
    ],
  },
  {
    label: 'Einstaklingur í umboði annars einstaklings',
    types: [
      ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
      ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
    ],
  },
  {
    label: 'Einstaklingur í umboði lögaðila',
    types: [
      ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
      ApplicantTypesEnum.LEGAL_ENTITY,
    ],
  },
  {
    label: 'Forsjáraðili',
    types: [
      ApplicantTypesEnum.LEGAL_GUARDIAN,
      ApplicantTypesEnum.WARD_OF_LEGAL_GUARDIAN,
    ],
  },
])(
  'shows one login screen and only the $label applicants in summary',
  async ({ label, types }) => {
    renderPreview(true, undefined, loginForm)
    expect(screen.getAllByRole('radio')).toHaveLength(5)
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.getByTestId('applicant-steps').textContent).toBe(
      'preview-applicant-login',
    )
    fireEvent.click(screen.getByRole('radio', { name: label }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(screen.getByText('Summary')).toBeTruthy())
    for (const applicantType of Object.values(ApplicantTypesEnum)) {
      if ((types as string[]).includes(applicantType)) {
        expect(screen.getByText(`applicant-${applicantType}`)).toBeTruthy()
      } else {
        expect(screen.queryByText(`applicant-${applicantType}`)).toBeNull()
      }
    }
    fireEvent.click(screen.getByRole('button', { name: 'Edit applicants' }))
    expect(screen.getByRole('radio', { name: label })).toHaveProperty(
      'checked',
      true,
    )
    fireEvent.click(
      screen.getByRole('radio', { name: 'Einstaklingur (innskráður)' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() =>
      expect(
        screen.getByText(`applicant-${ApplicantTypesEnum.INDIVIDUAL}`),
      ).toBeTruthy(),
    )
    expect(
      screen.queryByText(
        `applicant-${ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER}`,
      ),
    ).toBeNull()
  },
)

it('only offers login groups enabled in the form', () => {
  renderPreview(true, undefined, {
    ...loginForm,
    fields: loginForm.fields?.filter(
      (field) =>
        field?.fieldSettings?.applicantType === ApplicantTypesEnum.INDIVIDUAL,
    ),
  })
  expect(screen.getAllByRole('radio')).toHaveLength(1)
  expect(
    screen.getByRole('radio', { name: 'Einstaklingur (innskráður)' }),
  ).toHaveProperty('checked', true)
})
