import { ApolloLink } from '@apollo/client'
import { MockedProvider, MockLink } from '@apollo/client/testing'
import { FormSystemField } from '@island.is/api/schema'
import {
  ApplicantTypesEnum,
  FamilyTypes,
  FieldTypesEnum,
} from '@island.is/form-system/enums'
import {
  GET_CUSTODY_CHILDREN,
  GET_FAMILY_MEMBERS,
} from '@island.is/form-system/graphql'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import {
  ReactNode,
  InputHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { ApplicationState } from '../../../lib'
import { hasFieldValueError } from '../../../lib/hasFieldValueError'
import { initializeField } from '../../../lib/fieldTypes'
import { NationalIdDisplay } from '../../DisplayComponents/NationalIdDisplay/NationalIdDisplay'
import { Family } from './Family'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) =>
      defaultMessage,
  }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  GridColumn: ({
    children,
    span,
  }: {
    children: ReactNode
    span?: string | string[]
  }) => <div data-grid-span={JSON.stringify(span)}>{children}</div>,
  GridRow: ({ children }: { children: ReactNode }) => <>{children}</>,
  Stack: ({ children }: { children: ReactNode }) => <>{children}</>,
  Box: ({ children }: { children: ReactNode }) => <>{children}</>,
  LoadingDots: () => null,
  SkeletonLoader: () => null,
  Checkbox: ({
    ariaLabel,
    name,
    checked,
    onChange,
  }: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'name' | 'checked' | 'onChange'
  > & {
    ariaLabel: string
  }) => (
    <input
      type="checkbox"
      aria-label={ariaLabel}
      name={name}
      checked={checked}
      onChange={onChange}
    />
  ),
  Text: ({
    children,
    as: Component = 'p',
  }: {
    children: ReactNode
    as?: 'p' | 'span'
  }) => <Component>{children}</Component>,
  AlertMessage: ({ title }: { title: string }) => (
    <div role="alert">{title}</div>
  ),
  InputError: ({ errorMessage }: { errorMessage: string }) => (
    <div role="alert">{errorMessage}</div>
  ),
  Table: {
    Table: ({ children, ...props }: TableHTMLAttributes<HTMLTableElement>) => (
      <table {...props}>{children}</table>
    ),
    Head: ({ children }: { children: ReactNode }) => <thead>{children}</thead>,
    Body: ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>,
    Row: ({ children }: { children: ReactNode }) => <tr>{children}</tr>,
    HeadData: ({
      children,
      ...props
    }: ThHTMLAttributes<HTMLTableCellElement>) => (
      <th {...props}>{children}</th>
    ),
    Data: ({ children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
      <td {...props}>{children}</td>
    ),
  },
  Select: ({
    label,
    options,
    onChange,
    hasError,
    errorMessage,
  }: {
    label: string
    options: { label: string; value: { nationalId: string; name: string } }[]
    onChange: (option: typeof options[number] | undefined) => void
    hasError: boolean
    errorMessage?: string
  }) => (
    <>
      <select
        aria-label={label}
        onChange={(event) =>
          onChange(
            options.find(
              (option) => option.value.nationalId === event.target.value,
            ),
          )
        }
      >
        {options.map((option) => (
          <option key={option.value.nationalId} value={option.value.nationalId}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && <span role="alert">{errorMessage}</span>}
    </>
  ),
  Input: ({
    label,
    value,
    readOnly,
  }: {
    label: string
    value: string
    readOnly?: boolean
  }) => <input aria-label={label} value={value ?? ''} readOnly={readOnly} />,
}))

const renderFamily = (
  familyType: string,
  isPreview?: boolean,
  state?: ApplicationState,
  valueIndex = 0,
  registryData?: Record<string, unknown>,
  fieldSettings?: FormSystemField['fieldSettings'],
  list?: FormSystemField['list'],
  registryError?: Error,
  values?: FormSystemField['values'],
  isRequired = false,
) => {
  const dispatch = jest.fn()
  const registryRequest = jest.fn()
  const validationResult = jest.fn()
  const link = new ApolloLink((operation, forward) => {
    registryRequest()
    return forward(operation)
  }).concat(
    new MockLink(
      [
        {
          request: {
            query:
              familyType === FamilyTypes.CHILD
                ? GET_CUSTODY_CHILDREN
                : GET_FAMILY_MEMBERS,
          },
          result: {
            data:
              registryData ??
              (familyType === FamilyTypes.CHILD
                ? { formSystemCustodyChildren: [] }
                : { nationalRegistryPerson: null }),
          },
          error: registryError,
          delay: 0,
        },
      ],
      false,
    ),
  )
  const item = {
    id: 'family',
    fieldType: FieldTypesEnum.FAMILY,
    isRequired,
    name: { is: 'Family' },
    fieldSettings: { familyType, ...fieldSettings },
    list,
    values:
      values ??
      (familyType === FamilyTypes.CHILD
        ? [{ json: { nationalId: '', name: '' } }]
        : [
            {
              json: {
                nationalId: '0101302989',
                name: 'Preview spouse',
                maritalStatus: 'Married',
              },
            },
          ]),
  } as FormSystemField
  const Form = () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <Family
          item={item}
          dispatch={dispatch}
          isPreview={isPreview}
          state={state}
          valueIndex={valueIndex}
        />
        <button
          type="button"
          onClick={async () => validationResult(await methods.trigger())}
        >
          Validate
        </button>
      </FormProvider>
    )
  }
  const { unmount } = render(
    <MockedProvider link={link} addTypename={false}>
      <IntlProvider locale="is" defaultLocale="is" messages={{}}>
        <Form />
      </IntlProvider>
    </MockedProvider>,
  )
  return { dispatch, registryRequest, validationResult, unmount }
}

it.each([FamilyTypes.APPLICANT_INFO, FamilyTypes.CHILD, FamilyTypes.SPOUSE])(
  'does not fetch registry data for %s in preview',
  (familyType) => {
    const { dispatch, registryRequest } = renderFamily(familyType, true)

    expect(registryRequest).not.toHaveBeenCalled()
    if (familyType === FamilyTypes.CHILD) {
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SET_FIELD_VALUES' }),
      )
    } else {
      expect(dispatch).not.toHaveBeenCalled()
    }
    if (familyType === FamilyTypes.APPLICANT_INFO) {
      expect(screen.getByDisplayValue('Preview spouse')).toBeTruthy()
      expect(screen.getByDisplayValue('0101302989')).toBeTruthy()
      expect(screen.queryByDisplayValue('Married')).toBeNull()
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs.map((input) => input.value)).toEqual([
        'Preview spouse',
        '0101302989',
      ])
      expect(
        inputs[0].closest('[data-grid-span]')?.getAttribute('data-grid-span'),
      ).toBe(JSON.stringify('10/10'))
      expect(
        inputs[1].closest('[data-grid-span]')?.getAttribute('data-grid-span'),
      ).toBe(JSON.stringify(['1/1', '1/1', '5/10']))
    }
    if (familyType === FamilyTypes.SPOUSE) {
      expect(screen.getByDisplayValue('Preview spouse')).toBeTruthy()
      expect(screen.getByDisplayValue('0101302989')).toBeTruthy()
      expect(screen.getByDisplayValue('Married')).toBeTruthy()
    }
  },
)

it.each([FamilyTypes.CHILD, FamilyTypes.SPOUSE])(
  'still fetches registry data for %s outside preview',
  async (familyType) => {
    const { registryRequest, dispatch } = renderFamily(familyType)

    expect(registryRequest).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(dispatch).toHaveBeenCalled())
  },
)

it.each([
  {
    children: [
      { nationalId: '0101202989', fullName: 'First custody child' },
      { nationalId: '0101212989', fullName: 'Second custody child' },
      { nationalId: '0101222989', fullName: null },
    ],
  },
  { children: [] },
])(
  'displays and caches the MidlunUmsoknir custody list (case $#)',
  async ({ children }) => {
    const { dispatch } = renderFamily(FamilyTypes.CHILD, false, undefined, 0, {
      formSystemCustodyChildren: children,
    })

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_FIELD_LIST',
        payload: {
          id: 'family',
          list: children.map(({ nationalId, fullName }) => ({
            id: nationalId,
            label: {
              is: fullName ?? nationalId,
              en: fullName ?? nationalId,
            },
            value: nationalId,
            isSelected: false,
          })),
          placeholder: null,
        },
      })
    })
    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.queryAllByRole('checkbox')).toHaveLength(children.length)
  },
)

it.each([undefined, null, true, false])(
  'always uses the child table, ignoring legacy isDropdown=%s',
  async (isDropdown) => {
    const { dispatch } = renderFamily(
      FamilyTypes.CHILD,
      false,
      undefined,
      1,
      {
        formSystemCustodyChildren: [
          { nationalId: '0101202989', fullName: 'First custody child' },
          { nationalId: '0101212989', fullName: 'Second custody child' },
        ],
      },
      { isDropdown },
    )

    await screen.findByRole('table', { name: 'Family' })
    expect(screen.queryByRole('combobox')).toBeNull()
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_FIELD_VALUES',
      payload: {
        id: 'family',
        values: [
          {
            id: expect.any(String),
            order: 0,
            json: { name: 'First custody child', nationalId: '0101202989' },
          },
          {
            id: expect.any(String),
            order: 1,
            json: { name: 'Second custody child', nationalId: '0101212989' },
          },
        ],
      },
    })
  },
)

it.each([undefined, false])(
  'shows lookup errors in the table body without changing values for isDropdown=%s',
  async (isDropdown) => {
    const { dispatch } = renderFamily(
      FamilyTypes.CHILD,
      false,
      undefined,
      0,
      undefined,
      { isDropdown },
      undefined,
      new Error('Registry unavailable'),
    )

    const table = await screen.findByRole('table', { name: 'Family' })
    expect(screen.getByText('Family')).toBeTruthy()
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((header) => header.textContent),
    ).toEqual(['Nafn', 'Kennitala', 'Veldu'])
    expect((await within(table).findByRole('alert')).textContent).toBe(
      'Villa kom upp',
    )
    expect(screen.queryByText('Engin börn í forsjá fundust.')).toBeNull()
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_FIELD_LOADING',
      payload: { id: 'family', loading: true },
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_FIELD_LOADING',
      payload: { id: 'family', loading: false },
    })
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_FIELD_LIST' }),
    )
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_FIELD_VALUES' }),
    )
  },
)

it.each([
  {
    children: [
      { nationalId: '0101202989', fullName: 'First custody child' },
      { nationalId: '0101212989', fullName: 'Second custody child' },
      { nationalId: '0101222989', fullName: null },
    ],
  },
  { children: [] },
])(
  'displays all custody children with checked selection boxes (case %#)',
  async ({ children }) => {
    const { dispatch } = renderFamily(
      FamilyTypes.CHILD,
      false,
      undefined,
      0,
      { formSystemCustodyChildren: children },
      undefined,
    )

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_FIELD_LOADING',
      payload: { id: 'family', loading: true },
    })
    const table = await screen.findByRole('table', { name: 'Family' })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_FIELD_LOADING',
      payload: { id: 'family', loading: false },
    })
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((header) => header.textContent),
    ).toEqual(['Nafn', 'Kennitala', 'Veldu'])
    if (children.length) {
      expect(
        within(table)
          .getAllByRole('row')
          .slice(1)
          .map((row) =>
            within(row)
              .getAllByRole('cell')
              .map((cell) => cell.textContent),
          ),
      ).toEqual(
        children.map((child) => [
          child.fullName ?? child.nationalId,
          child.nationalId,
          '',
        ]),
      )
    } else {
      expect(
        within(table).getByText('Engin börn í forsjá fundust.'),
      ).toBeTruthy()
    }
    expect(screen.queryByRole('combobox')).toBeNull()
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    expect(screen.queryAllByRole('checkbox')).toHaveLength(children.length)
    screen.queryAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toHaveProperty('checked', true)
    })
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_FIELD_LIST' }),
    )
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_FIELD_VALUES',
      payload: {
        id: 'family',
        values: children.map((child, order) => ({
          id: expect.any(String),
          order,
          json: {
            nationalId: child.nationalId,
            name: child.fullName ?? child.nationalId,
          },
        })),
      },
    })
  },
)

it.each([false, true])(
  'uses cached children or preview mocks in table mode with isPreview=%s',
  (isPreview) => {
    const { registryRequest, dispatch } = renderFamily(
      FamilyTypes.CHILD,
      isPreview,
      undefined,
      0,
      undefined,
      undefined,
      [
        {
          id: 'cached-child',
          label: { is: 'Cached child' },
          value: '0101232989',
        },
      ],
    )

    expect(screen.getByRole('table')).toBeTruthy()
    if (isPreview) {
      expect(screen.getByText('Barn í forsjá 1 (mock)')).toBeTruthy()
      expect(screen.getByText('Barn í forsjá 2 (mock)')).toBeTruthy()
      expect(screen.queryByText('Cached child')).toBeNull()
    } else {
      expect(screen.getByText('Cached child')).toBeTruthy()
      expect(screen.getByText('0101232989')).toBeTruthy()
    }
    expect(registryRequest).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_FIELD_LOADING' }),
    )
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_FIELD_VALUES' }),
    )
  },
)

it('clears the child loading guard when leaving before the lookup finishes', () => {
  const { dispatch, unmount } = renderFamily(FamilyTypes.CHILD)

  expect(dispatch).toHaveBeenCalledWith({
    type: 'SET_FIELD_LOADING',
    payload: { id: 'family', loading: true },
  })

  unmount()

  expect(dispatch).toHaveBeenLastCalledWith({
    type: 'SET_FIELD_LOADING',
    payload: { id: 'family', loading: false },
  })
})

it.each([undefined, null, true, false])(
  'rejects an empty required child selection regardless of obsolete isDropdown=%s',
  (isDropdown) => {
    const field: FormSystemField = {
      id: 'family',
      screenId: 'screen',
      name: { is: 'Children' },
      isPartOfMultiset: false,
      fieldType: FieldTypesEnum.FAMILY,
      isRequired: true,
      fieldSettings: { familyType: FamilyTypes.CHILD, isDropdown },
      values: [],
    }

    expect(hasFieldValueError(field)).toBe(true)
    expect(
      hasFieldValueError({
        ...field,
        fieldSettings: { familyType: FamilyTypes.SPOUSE, isDropdown },
      }),
    ).toBe(true)
  },
)

it.each<{
  values: FormSystemField['values']
  invalid: boolean
}>([
  { values: undefined, invalid: true },
  { values: [{ json: { name: '', nationalId: '' } }], invalid: true },
  {
    values: [
      { json: { name: '', nationalId: '' } },
      { json: { name: 'Selected child', nationalId: '0101232989' } },
    ],
    invalid: false,
  },
])(
  'validates the whole child selection with values=$values',
  ({ values, invalid }) => {
    expect(
      hasFieldValueError({
        id: 'family',
        screenId: 'screen',
        name: { is: 'Children' },
        isPartOfMultiset: false,
        fieldType: FieldTypesEnum.FAMILY,
        isRequired: true,
        fieldSettings: { familyType: FamilyTypes.CHILD },
        values,
      }),
    ).toBe(invalid)
  },
)

it.each([false, true])(
  'requires at least one child and clears the error after selection in preview=%s',
  async (isPreview) => {
    const { dispatch, validationResult } = renderFamily(
      FamilyTypes.CHILD,
      isPreview,
      undefined,
      0,
      undefined,
      undefined,
      [
        {
          id: 'cached-child',
          label: { is: 'Cached child' },
          value: '0101232989',
        },
      ],
      undefined,
      undefined,
      true,
    )

    expect(screen.getByText('Family *')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    await waitFor(() => expect(validationResult).toHaveBeenLastCalledWith(true))

    screen.getAllByRole('checkbox').forEach((checkbox) => {
      fireEvent.click(checkbox)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    await waitFor(() =>
      expect(validationResult).toHaveBeenLastCalledWith(false),
    )
    expect(screen.getByRole('alert').textContent).toBe(
      'Veldu að minnsta kosti eitt barn.',
    )
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'SET_FIELD_VALUES',
      payload: { id: 'family', values: [] },
    })

    fireEvent.click(screen.getAllByRole('checkbox')[0])
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    await waitFor(() => expect(validationResult).toHaveBeenLastCalledWith(true))
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'SET_FIELD_VALUES',
      payload: {
        id: 'family',
        values: [
          expect.objectContaining({
            json: expect.objectContaining({ nationalId: expect.any(String) }),
          }),
        ],
      },
    })
  },
)

it.each([false, true])(
  'validates an empty child list with required=%s',
  async (isRequired) => {
    const { validationResult } = renderFamily(
      FamilyTypes.CHILD,
      false,
      undefined,
      0,
      { formSystemCustodyChildren: [] },
      undefined,
      undefined,
      undefined,
      [],
      isRequired,
    )

    await screen.findByRole('table')
    expect(screen.getByText(isRequired ? 'Family *' : 'Family')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    await waitFor(() =>
      expect(validationResult).toHaveBeenLastCalledWith(!isRequired),
    )
    if (isRequired) {
      expect(screen.getByRole('alert').textContent).toBe(
        'Veldu að minnsta kosti eitt barn.',
      )
    } else {
      expect(screen.queryByRole('alert')).toBeNull()
    }
  },
)

it('renders only selected children using national-ID summary blocks', () => {
  const item: FormSystemField = {
    id: 'family',
    screenId: 'screen',
    isRequired: false,
    name: { is: 'Children' },
    isPartOfMultiset: false,
    fieldType: FieldTypesEnum.FAMILY,
    fieldSettings: { familyType: FamilyTypes.CHILD },
    values: [
      { json: { name: 'First selected child', nationalId: '0101232989' } },
      { json: { name: 'Second selected child', nationalId: '0101212989' } },
    ],
    list: [
      {
        id: 'unselected',
        label: { is: 'Unselected child' },
        value: '0101252989',
      },
    ],
  }

  render(<NationalIdDisplay item={item} valueIndex={0} />)

  expect(screen.queryByRole('table')).toBeNull()
  expect(screen.getAllByText('Nafn:')).toHaveLength(2)
  expect(screen.getAllByText('Kennitala:')).toHaveLength(2)
  screen.getAllByText('Nafn:').forEach((name, index) => {
    expect(
      name.compareDocumentPosition(screen.getAllByText('Kennitala:')[index]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
  expect(screen.getAllByText('Children')).toHaveLength(1)
  expect(screen.getByText('First selected child')).toBeTruthy()
  expect(screen.getByText('Second selected child')).toBeTruthy()
  expect(screen.getByText('0101232989')).toBeTruthy()
  expect(screen.getByText('0101212989')).toBeTruthy()
  expect(screen.queryByText('Unselected child')).toBeNull()
  expect(screen.queryByText('0101252989')).toBeNull()
  expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
})

it.each([FieldTypesEnum.NATIONAL_ID, FieldTypesEnum.FAMILY])(
  'retains a single national-ID summary for %s',
  (fieldType) => {
    const item: FormSystemField = {
      id: 'person',
      screenId: 'screen',
      isRequired: false,
      name: { is: 'Person' },
      fieldType,
      isPartOfMultiset: false,
      fieldSettings: { familyType: FamilyTypes.CHILD, showAddress: true },
      values: [
        {
          json: {
            name: 'Selected person',
            nationalId: '0101232989',
            address: 'Example address',
            postalCode: '101',
            municipality: 'Example city',
          },
        },
      ],
    }

    render(<NationalIdDisplay item={item} valueIndex={0} />)

    expect(screen.getByText('Person')).toBeTruthy()
    expect(screen.getByText('Nafn:')).toBeTruthy()
    expect(screen.getByText('Kennitala:')).toBeTruthy()
    expect(
      screen
        .getByText('Nafn:')
        .compareDocumentPosition(screen.getByText('Kennitala:')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(screen.getByText('Selected person')).toBeTruthy()
    expect(screen.getByText('0101232989')).toBeTruthy()
    expect(screen.queryByRole('table')).toBeNull()
    if (fieldType === FieldTypesEnum.NATIONAL_ID) {
      expect(screen.getByText('Example address')).toBeTruthy()
      expect(screen.getByText('101')).toBeTruthy()
      expect(screen.getByText('Example city')).toBeTruthy()
    } else {
      expect(screen.queryByText('Example address')).toBeNull()
      expect(screen.queryByText('101')).toBeNull()
      expect(screen.queryByText('Example city')).toBeNull()
    }
  },
)

it.each<{
  isRequired: boolean
  values: FormSystemField['values']
}>([
  { isRequired: false, values: [] },
  { isRequired: true, values: [] },
  { isRequired: true, values: undefined },
  {
    isRequired: true,
    values: [{ json: { name: '', nationalId: '' } }],
  },
])(
  'shows the empty child summary with required=$isRequired and values=$values',
  ({ isRequired, values }) => {
    const item: FormSystemField = {
      id: 'family',
      screenId: 'screen',
      name: { is: 'Children' },
      fieldType: FieldTypesEnum.FAMILY,
      fieldSettings: { familyType: FamilyTypes.CHILD },
      isPartOfMultiset: false,
      values,
      isRequired,
    }

    render(
      <NationalIdDisplay
        item={item}
        valueIndex={0}
        requiredMissing={isRequired && hasFieldValueError(item)}
      />,
    )

    expect(
      screen.getByText(isRequired ? 'Vantar gildi' : 'Engin börn valin.'),
    ).toBeTruthy()
    expect(
      screen.queryByText(isRequired ? 'Engin börn valin.' : 'Vantar gildi'),
    ).toBeNull()
    if (isRequired) {
      expect(screen.getByText('*')).toBeTruthy()
    } else {
      expect(screen.queryByText('*')).toBeNull()
    }
    expect(screen.queryByText('Nafn:')).toBeNull()
    expect(screen.queryByText('Kennitala:')).toBeNull()
  },
)

it('updates the values when children are unchecked and rechecked, including clearing every selection', async () => {
  const { dispatch } = renderFamily(
    FamilyTypes.CHILD,
    false,
    undefined,
    0,
    undefined,
    undefined,
    [
      { id: 'first', label: { is: 'First child' }, value: '0101202989' },
      { id: 'second', label: { is: 'Second child' }, value: '0101212989' },
    ],
  )

  const first = screen.getByRole('checkbox', {
    name: 'First child (0101202989)',
  })
  const second = screen.getByRole('checkbox', {
    name: 'Second child (0101212989)',
  })

  await act(async () => {
    fireEvent.click(first)
  })
  expect(first).toHaveProperty('checked', false)
  expect(dispatch).toHaveBeenLastCalledWith({
    type: 'SET_FIELD_VALUES',
    payload: {
      id: 'family',
      values: [
        {
          id: expect.any(String),
          order: 0,
          json: { name: 'Second child', nationalId: '0101212989' },
        },
      ],
    },
  })

  await act(async () => {
    fireEvent.click(second)
  })
  expect(second).toHaveProperty('checked', false)
  expect(dispatch).toHaveBeenLastCalledWith({
    type: 'SET_FIELD_VALUES',
    payload: { id: 'family', values: [] },
  })

  await act(async () => {
    fireEvent.click(first)
  })
  expect(first).toHaveProperty('checked', true)
  expect(dispatch).toHaveBeenLastCalledWith({
    type: 'SET_FIELD_VALUES',
    payload: {
      id: 'family',
      values: [
        {
          id: expect.any(String),
          order: 0,
          json: { name: 'First child', nationalId: '0101202989' },
        },
      ],
    },
  })
})

it.each([
  {
    values: [
      {
        id: 'saved',
        order: 0,
        json: { name: 'Second child', nationalId: '0101212989' },
      },
    ],
  },
  { values: [] },
])(
  'restores saved selections, including no selected children (case %#)',
  ({ values }) => {
    renderFamily(
      FamilyTypes.CHILD,
      false,
      undefined,
      0,
      undefined,
      undefined,
      [
        { id: 'first', label: { is: 'First child' }, value: '0101202989' },
        { id: 'second', label: { is: 'Second child' }, value: '0101212989' },
      ],
      undefined,
      values,
    )

    expect(
      screen.getByRole('checkbox', { name: 'First child (0101202989)' }),
    ).toHaveProperty('checked', false)
    expect(
      screen.getByRole('checkbox', { name: 'Second child (0101212989)' }),
    ).toHaveProperty('checked', values.length > 0)
  },
)

it('preserves an explicitly empty child-table selection during application initialization', () => {
  const field: FormSystemField = {
    id: 'family',
    screenId: 'screen',
    isRequired: false,
    name: { is: 'Children' },
    isPartOfMultiset: false,
    fieldType: FieldTypesEnum.FAMILY,
    fieldSettings: { familyType: FamilyTypes.CHILD },
    values: [],
  }

  expect(initializeField(field).values).toEqual([])
  expect(
    initializeField({
      ...field,
      values: [{ id: 'initial', json: { nationalId: '', name: '' } }],
    }).values,
  ).toHaveLength(1)
  expect(
    initializeField({
      ...field,
      fieldSettings: { familyType: FamilyTypes.SPOUSE },
    }).values,
  ).toHaveLength(1)
})

it('uses mock custody children in preview without fetching or caching', () => {
  const { registryRequest, dispatch } = renderFamily(
    FamilyTypes.CHILD,
    true,
    undefined,
    0,
    undefined,
    undefined,
    [
      {
        id: 'existing-child',
        label: { is: 'Existing child' },
        value: '0101232989',
      },
    ],
  )

  expect(screen.getByRole('table')).toBeTruthy()
  expect(screen.getByText('Barn í forsjá 1 (mock)')).toBeTruthy()
  expect(screen.getByText('Barn í forsjá 2 (mock)')).toBeTruthy()
  expect(screen.queryByText('Existing child')).toBeNull()
  expect(registryRequest).not.toHaveBeenCalled()
  expect(dispatch).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'SET_FIELD_VALUES' }),
  )
})

it('keeps using cached real children outside preview', () => {
  const { registryRequest, dispatch } = renderFamily(
    FamilyTypes.CHILD,
    false,
    undefined,
    0,
    undefined,
    undefined,
    [
      {
        id: 'existing-child',
        label: { is: 'Existing child' },
        value: '0101232989',
      },
    ],
  )

  expect(screen.getByRole('table')).toBeTruthy()
  expect(screen.getByText('Existing child')).toBeTruthy()
  expect(screen.getByText('0101232989')).toBeTruthy()
  expect(registryRequest).not.toHaveBeenCalled()
  expect(dispatch).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'SET_FIELD_VALUES' }),
  )
})

it.each([0, 1])(
  'displays and persists the logged-in individual in read-only fields at value index %s without a registry request',
  async (valueIndex) => {
    const state = {
      sections: [
        {
          screens: [
            {
              fields: [
                {
                  fieldType: FieldTypesEnum.APPLICANT,
                  fieldSettings: {
                    applicantType: ApplicantTypesEnum.INDIVIDUAL,
                  },
                  values: [
                    {
                      json: {
                        nationalId: '0101902989',
                        name: 'Applicant',
                        isLoggedInUser: true,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    } as ApplicationState
    const { dispatch, registryRequest } = renderFamily(
      FamilyTypes.APPLICANT_INFO,
      false,
      state,
      valueIndex,
    )

    await waitFor(() => {
      expect(screen.getByDisplayValue('Applicant')).toBeTruthy()
      expect(screen.getByDisplayValue('0101902989')).toBeTruthy()
    })
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    screen.getAllByRole('textbox').forEach((input) => {
      expect((input as HTMLInputElement).readOnly).toBe(true)
    })
    expect(registryRequest).not.toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_NAME',
      payload: { id: 'family', value: 'Applicant', valueIndex },
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_NATIONAL_ID',
      payload: { id: 'family', value: '0101902989', valueIndex },
    })
  },
)

it.each([
  {
    actorType: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
    applicantType: ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
  },
  {
    actorType: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
    applicantType: ApplicantTypesEnum.LEGAL_ENTITY,
  },
  {
    actorType: ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
    applicantType: ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER,
  },
  {
    actorType: ApplicantTypesEnum.LEGAL_GUARDIAN,
    applicantType: ApplicantTypesEnum.WARD_OF_LEGAL_GUARDIAN,
  },
])(
  'displays and persists $applicantType instead of the logged-in $actorType',
  async ({ actorType, applicantType }) => {
    const state = {
      sections: [
        {
          screens: [
            {
              fields: [
                {
                  fieldType: FieldTypesEnum.APPLICANT,
                  fieldSettings: { applicantType: actorType },
                  values: [
                    {
                      json: {
                        nationalId: '0101802989',
                        name: 'Logged-in actor',
                        isLoggedInUser: true,
                      },
                    },
                  ],
                },
              ],
            },
            {
              fields: [
                {
                  fieldType: FieldTypesEnum.APPLICANT,
                  fieldSettings: { applicantType },
                  values: [
                    {
                      json: {
                        nationalId: '0101902989',
                        name: 'Represented applicant',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    } as ApplicationState
    const { dispatch, registryRequest } = renderFamily(
      FamilyTypes.APPLICANT_INFO,
      false,
      state,
    )

    await waitFor(() => {
      expect(screen.getByDisplayValue('Represented applicant')).toBeTruthy()
      expect(screen.getByDisplayValue('0101902989')).toBeTruthy()
    })
    expect(screen.queryByDisplayValue('Logged-in actor')).toBeNull()
    expect(screen.queryByDisplayValue('0101802989')).toBeNull()
    screen.getAllByRole('textbox').forEach((input) => {
      expect((input as HTMLInputElement).readOnly).toBe(true)
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_NAME',
      payload: { id: 'family', value: 'Represented applicant', valueIndex: 0 },
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_NATIONAL_ID',
      payload: { id: 'family', value: '0101902989', valueIndex: 0 },
    })
    expect(registryRequest).not.toHaveBeenCalled()
  },
)

it('keeps the saved applicant identity when application state is unavailable', () => {
  const { dispatch, registryRequest } = renderFamily(FamilyTypes.APPLICANT_INFO)

  expect(screen.getByDisplayValue('Preview spouse')).toBeTruthy()
  expect(screen.getByDisplayValue('0101302989')).toBeTruthy()
  expect(dispatch).not.toHaveBeenCalled()
  expect(registryRequest).not.toHaveBeenCalled()
})
