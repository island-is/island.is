import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import { ApplicationState } from '@island.is/form-system/ui'
import { beforeEach, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { ComponentProps, ReactNode } from 'react'
import { Display } from '../Display/Display'
import { Summary } from './Summary'
import { hasError } from '../../../../utils/validation'

jest.mock('@apollo/client', () => ({ useMutation: () => [] }))
jest.mock('@island.is/form-system/graphql', () => ({
  UPDATE_APPLICATION_SETTINGS: {},
}))
jest.mock('@island.is/form-system/ui', () => ({
  ...jest.requireActual<typeof import('@island.is/form-system/enums')>(
    '@island.is/form-system/enums',
  ),
  m: { reviewApplication2: 'Review', edit: 'Edit' },
}))
jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is' }),
}))
jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (message: string) => message }),
}))
jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridContainer: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  GridRow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridColumn: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  Button: ({ children }: { children: ReactNode }) => (
    <button>{children}</button>
  ),
  Divider: () => null,
}))
const mockDispatch = jest.fn()
jest.mock('../../../../context/ApplicationProvider', () => ({
  useApplicationContext: () => ({ dispatch: mockDispatch }),
}))
jest.mock('../../../../utils/validation', () => ({
  hasError: jest.fn(() => false),
}))
jest.mock('../../../../utils/payment', () => ({
  getVisiblePaymentFields: () => [],
}))
jest.mock('../Payment/Payment', () => ({ Payment: () => null }))
jest.mock('../Display/Display', () => ({
  Display: ({ field, valueIndex = 0 }: ComponentProps<typeof Display>) => (
    <output>{`${field.id}:${valueIndex}`}</output>
  ),
}))

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(hasError).mockReturnValue(false)
})

const field = (
  id: string,
  isPartOfMultiset: boolean,
  count = 1,
): FormSystemField => ({
  id,
  screenId: 'screen',
  name: { is: id },
  isRequired: false,
  fieldType: FieldTypesEnum.TEXTBOX,
  isPartOfMultiset,
  values: Array.from({ length: count }, () => ({ json: { text: 'value' } })),
})

it('omits hidden dependent rows from summaries and required-field validation', () => {
  jest
    .mocked(hasError)
    .mockImplementation((item, index = 0) => item.id === 'child' && index === 1)
  const parent: FormSystemField = {
    ...field('parent', true, 2),
    fieldType: FieldTypesEnum.CHECKBOX,
    values: [
      { json: { checkboxValue: true } },
      { json: { checkboxValue: false } },
    ],
  }
  const state: ApplicationState = {
    application: {
      id: 'application',
      hasPayment: false,
      dependencies: [
        { parentProp: 'parent', childProps: ['child'], isSelected: true },
      ],
    },
    sections: [
      {
        id: 'section',
        sectionType: SectionTypes.INPUT,
        screens: [
          {
            id: 'screen',
            sectionId: 'section',
            isMulti: true,
            fields: [parent, { ...field('child', true), isRequired: true }],
          },
        ],
      },
    ],
    screens: [],
    currentSection: { index: 0, data: { id: 'section' } },
  }
  const { rerender } = render(<Summary state={state} />)
  expect(screen.getByText('child:0')).toBeTruthy()
  expect(screen.queryByText('child:1')).toBeNull()
  expect(mockDispatch).toHaveBeenLastCalledWith({
    type: 'SET_VALIDITY',
    payload: { isValid: true },
  })

  const sections = state.sections.map((section) => ({
    ...section,
    screens: section.screens?.map((screen) =>
      screen
        ? {
            ...screen,
            fields: screen?.fields?.map((item) =>
              item?.id === parent.id
                ? {
                    ...parent,
                    values: [
                      { json: { checkboxValue: true } },
                      { json: { checkboxValue: true } },
                    ],
                  }
                : item,
            ),
          }
        : screen,
    ),
  }))
  rerender(<Summary state={{ ...state, sections }} />)
  expect(screen.getByText('child:1')).toBeTruthy()
  expect(mockDispatch).toHaveBeenLastCalledWith({
    type: 'SET_VALIDITY',
    payload: { isValid: false },
  })
})

it.each([true, false])(
  'matches screen ordering with multiset=%s',
  (isMulti) => {
    const fields = [
      field('leading', false, 4),
      field('first', true, 2),
      field('interleaved', false),
      field('second', true, 2),
      field('trailing', false),
    ]
    const state = {
      application: { hasPayment: false },
      sections: [
        {
          id: 'section',
          sectionType: SectionTypes.INPUT,
          screens: [{ id: 'screen', isMulti, fields }],
        },
      ],
    } as unknown as ApplicationState
    render(<Summary state={state} />)

    expect(
      screen.getAllByRole('status').map((output) => output.textContent),
    ).toEqual(
      isMulti
        ? [
            'leading:0',
            'first:0',
            'second:0',
            'first:1',
            'second:1',
            'interleaved:0',
            'trailing:0',
          ]
        : ['leading:0', 'first:0', 'interleaved:0', 'second:0', 'trailing:0'],
    )
  },
)
