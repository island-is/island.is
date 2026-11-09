import { FormSystemField } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import { beforeEach, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { Field } from './components/Field/Field'
import { Screen } from './Screen'

jest.mock('../../context/ApplicationProvider', () => ({
  useApplicationContext: jest.fn(),
}))
jest.mock('@island.is/form-system/ui', () => ({
  SectionTypes: jest.requireActual<
    typeof import('@island.is/form-system/enums')
  >('@island.is/form-system/enums').SectionTypes,
  m: { addMulti: 'Add', removeMulti: 'Remove' },
}))
jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is' }),
}))
jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (message: string) => message }),
}))
jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridColumn: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  AlertMessage: () => null,
  Button: ({
    children,
    onClick,
    disabled,
  }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))
jest.mock('../Footer/Footer', () => ({ Footer: () => null }))
jest.mock('./components/Applicants/Applicants', () => ({
  Applicants: () => null,
}))
jest.mock('./components/Completed/Completed', () => ({ Completed: () => null }))
jest.mock('./components/ExternalData/ExternalData', () => ({
  ExternalData: () => null,
}))
jest.mock('./components/Payment/Payment', () => ({ Payment: () => null }))
jest.mock('./components/Summary/Summary', () => ({ Summary: () => null }))
jest.mock('./components/Field/Field', () => ({
  Field: ({ field, valueIndex = 0 }: ComponentProps<typeof Field>) => (
    <output>{`${field.id}:${valueIndex}`}</output>
  ),
}))

const field = (
  id: string,
  isPartOfMultiset: boolean,
  count = 1,
): FormSystemField => ({
  id,
  screenId: 'screen',
  name: { is: id },
  isRequired: false,
  isPartOfMultiset,
  values: Array.from({ length: count }, () => ({ json: { text: 'value' } })),
})
const dispatch = jest.fn()

beforeEach(() => jest.clearAllMocks())

const renderScreen = (isMulti = true) => {
  const fields = [
    field('standalone-first', false, 4),
    field('repeated-first', true, 2),
    field('standalone-second', false),
    field('repeated-second', true, 2),
    field('standalone-last', false),
  ]
  const section = { sectionType: SectionTypes.INPUT, isCompleted: false }
  jest.mocked(useApplicationContext).mockReturnValue({
    state: {
      currentScreen: { data: { id: 'screen', isMulti, multiMax: 3, fields } },
      currentSection: { index: 0, data: section },
      sections: [section],
      application: {},
    },
    dispatch,
  } as unknown as ReturnType<typeof useApplicationContext>)
  render(<Screen />)
}

it('keeps leading fields above the multiset and moves interleaved standalone fields below its controls', () => {
  renderScreen()
  expect(
    Array.from(document.querySelectorAll('output, button')).map(
      (element) => element.textContent,
    ),
  ).toEqual([
    'standalone-first:0',
    'repeated-first:0',
    'repeated-second:0',
    'repeated-first:1',
    'repeated-second:1',
    'Remove',
    'Add',
    'standalone-second:0',
    'standalone-last:0',
  ])

  fireEvent.click(screen.getByRole('button', { name: 'Add' }))
  expect(screen.getByText('repeated-second:2')).toBeTruthy()
  expect(dispatch).toHaveBeenCalledWith({
    type: 'ADD_MULTISET_ITEM',
    payload: {},
  })
  expect(
    screen.getByRole('button', { name: 'Add' }).hasAttribute('disabled'),
  ).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
  expect(screen.queryByText('repeated-second:2')).toBeNull()
  expect(dispatch).toHaveBeenCalledWith({
    type: 'REMOVE_MULTISET_ITEM',
    payload: {},
  })
})

it('preserves field order and renders no multiset controls on ordinary screens', () => {
  renderScreen(false)
  expect(
    screen.getAllByRole('status').map((element) => element.textContent),
  ).toEqual([
    'standalone-first:0',
    'repeated-first:0',
    'standalone-second:0',
    'repeated-second:0',
    'standalone-last:0',
  ])
  expect(screen.queryByRole('button')).toBeNull()
})
