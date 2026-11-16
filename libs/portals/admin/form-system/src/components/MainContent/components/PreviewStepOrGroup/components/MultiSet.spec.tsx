import { FormSystemScreen } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Preview } from '../../Preview/Preview'
import { MultiSet } from './MultiSet'

jest.mock('@island.is/form-system/ui', () => ({
  FieldTypesEnum: jest.requireActual<
    typeof import('@island.is/form-system/enums')
  >('@island.is/form-system/enums').FieldTypesEnum,
  m: { addMulti: 'Add', removeMulti: 'Remove' },
}))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ formatMessage: (message: string) => message }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
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

jest.mock('../../Preview/Preview', () => ({
  Preview: jest.fn(
    ({ data, valueIndex = 0 }: ComponentProps<typeof Preview>) => (
      <output data-testid={data.id} data-value-index={valueIndex} />
    ),
  ),
}))

it('keeps multiset fields contiguous and moves interleaved standalone fields below the controls', () => {
  const previewScreen: FormSystemScreen = {
    id: 'screen',
    sectionId: 'section',
    isMulti: true,
    multiMax: 3,
    fields: [
      {
        id: 'top-message',
        screenId: 'screen',
        name: { is: 'Top message' },
        isRequired: false,
        fieldType: FieldTypesEnum.MESSAGE,
        isPartOfMultiset: false,
      },
      {
        id: 'currency',
        screenId: 'screen',
        name: { is: 'Currency' },
        isRequired: false,
        fieldType: FieldTypesEnum.ISK_NUMBERBOX,
        isPartOfMultiset: true,
        values: [
          { json: { iskNumber: '1.000' } },
          { json: { iskNumber: '2.000' } },
        ],
      },
      {
        id: 'interleaved-message',
        screenId: 'screen',
        name: { is: 'Interleaved message' },
        isRequired: false,
        fieldType: FieldTypesEnum.MESSAGE,
        isPartOfMultiset: false,
      },
      {
        id: 'row-sum',
        screenId: 'screen',
        name: { is: 'Row sum' },
        isRequired: false,
        fieldType: FieldTypesEnum.ISK_SUMBOX,
        isPartOfMultiset: true,
      },
      {
        id: 'aggregate-sum',
        screenId: 'screen',
        name: { is: 'Aggregate sum' },
        isRequired: false,
        fieldType: FieldTypesEnum.ISK_SUMBOX,
        isPartOfMultiset: false,
      },
      {
        id: 'bottom-message',
        screenId: 'screen',
        name: { is: 'Bottom message' },
        isRequired: false,
        fieldType: FieldTypesEnum.MESSAGE,
        isPartOfMultiset: false,
      },
    ],
  }
  const state = { currentScreen: { index: 0, data: previewScreen } }
  const dispatch = jest.fn()
  const Form = () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <MultiSet screen={previewScreen} state={state} dispatch={dispatch} />
      </FormProvider>
    )
  }
  render(<Form />)

  expect(
    screen
      .getAllByRole('status')
      .map((output) => output.getAttribute('data-testid')),
  ).toEqual([
    'top-message',
    'currency',
    'row-sum',
    'currency',
    'row-sum',
    'interleaved-message',
    'aggregate-sum',
    'bottom-message',
  ])
  expect(
    Array.from(document.querySelectorAll('output, button')).map(
      (element) => element.getAttribute('data-testid') ?? element.textContent,
    ),
  ).toEqual([
    'top-message',
    'currency',
    'row-sum',
    'currency',
    'row-sum',
    'Remove',
    'Add',
    'interleaved-message',
    'aggregate-sum',
    'bottom-message',
  ])
  expect(
    screen
      .getAllByTestId('row-sum')
      .map((output) => output.getAttribute('data-value-index')),
  ).toEqual(['0', '1'])
  expect(screen.getAllByTestId('aggregate-sum')).toHaveLength(1)
  expect(
    jest
      .mocked(Preview)
      .mock.calls.some(
        ([props]) =>
          props.data.id === 'row-sum' &&
          props.valueIndex === 1 &&
          props.state === state &&
          props.dispatch === dispatch,
      ),
  ).toBe(true)

  fireEvent.click(screen.getByRole('button', { name: 'Add' }))
  expect(
    screen
      .getAllByTestId('row-sum')
      .map((output) => output.getAttribute('data-value-index')),
  ).toEqual(['0', '1', '2'])
  expect(screen.getAllByTestId('aggregate-sum')).toHaveLength(1)

  fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
  expect(screen.getAllByTestId('row-sum')).toHaveLength(2)
  expect(screen.getAllByTestId('aggregate-sum')).toHaveLength(1)
})
