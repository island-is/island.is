import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import { ApplicationState } from '@island.is/form-system/ui'
import { beforeEach, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { ComponentProps, ReactNode } from 'react'
import { Display } from '../Display/Display'
import { Summary } from './Summary'

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
jest.mock('../../../../utils/validation', () => ({ hasError: () => false }))
jest.mock('../../../../utils/payment', () => ({
  getVisiblePaymentFields: () => [],
}))
jest.mock('../Payment/Payment', () => ({ Payment: () => null }))
jest.mock('../Display/Display', () => ({
  Display: ({ field, valueIndex = 0 }: ComponentProps<typeof Display>) => (
    <output>{`${field.id}:${valueIndex}`}</output>
  ),
}))

beforeEach(() => jest.clearAllMocks())

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
