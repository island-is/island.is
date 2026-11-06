import { FormSystemField, FormSystemSection } from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import { expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { PreviewSummary } from './PreviewSections'

jest.mock('@island.is/form-system/ui', () => ({
  ...jest.requireActual<typeof import('@island.is/form-system/enums')>(
    '@island.is/form-system/enums',
  ),
  hasFieldValueError: jest.requireActual<
    typeof import('../../../../../../../../form-system/ui-components/src/lib/hasFieldValueError')
  >(
    '../../../../../../../../form-system/ui-components/src/lib/hasFieldValueError',
  ).hasFieldValueError,
  m: { reviewApplication2: 'Review', edit: 'Edit' },
  DefaultDisplay: ({
    item,
    valueIndex,
    requiredMissing,
  }: {
    item: FormSystemField
    valueIndex: number
    requiredMissing?: boolean
  }) => (
    <output>
      {`${item.id}:${valueIndex}`}
      {requiredMissing && <span>Vantar gildi</span>}
    </output>
  ),
}))
jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (message: string) => message,
  }),
}))
jest.mock('@island.is/shared/components', () => ({ Markdown: () => null }))
jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridRow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridColumn: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  Button: ({ children }: { children: ReactNode }) => (
    <button>{children}</button>
  ),
  Divider: () => null,
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
  fieldType: FieldTypesEnum.TEXTBOX,
  isPartOfMultiset,
  values: Array.from({ length: count }, () => ({ json: { text: 'value' } })),
})

it.each([true, false])(
  'matches preview screen ordering with multiset=%s',
  (isMulti) => {
    const fields = [
      field('leading', false, 4),
      field('first', true, 2),
      field('interleaved', false),
      field('second', true, 2),
      field('trailing', false),
    ]
    const sections = [
      {
        id: 'section',
        sectionType: SectionTypes.INPUT,
        screens: [{ id: 'screen', isMulti, fields }],
      },
    ] as unknown as FormSystemSection[]
    render(<PreviewSummary sections={sections} onNavigate={jest.fn()} />)

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

it('marks invalid standalone and repeated values without marking valid or hidden fields', () => {
  const sections = [
    {
      id: 'section',
      sectionType: SectionTypes.INPUT,
      screens: [
        {
          id: 'screen',
          isMulti: true,
          fields: [
            field('leading', false),
            field('repeated', true, 2),
            field('trailing', false),
            { ...field('hidden', false), isHidden: true },
          ],
        },
      ],
    },
  ] as unknown as FormSystemSection[]
  render(
    <PreviewSummary
      sections={sections}
      onNavigate={jest.fn()}
      hasValidationError={(item, index) =>
        item.id !== 'repeated' || index === 1
      }
    />,
  )
  const outputs = screen.getAllByRole('status')
  expect(outputs.map((output) => output.textContent)).toEqual([
    'leading:0Vantar gildi',
    'repeated:0',
    'repeated:1Vantar gildi',
    'trailing:0Vantar gildi',
  ])
})

it('uses application missing-value validation for required fields even without captured errors', () => {
  const sections = [
    {
      id: 'section',
      sectionType: SectionTypes.INPUT,
      screens: [
        {
          id: 'screen',
          fields: [
            { ...field('required', false), isRequired: true, values: [] },
            {
              ...field('email', false),
              isRequired: true,
              fieldType: FieldTypesEnum.EMAIL,
              values: [{ json: { email: 'invalid' } }],
            },
            { ...field('optional', false), values: [] },
            { ...field('valid', false), isRequired: true },
          ],
        },
      ],
    },
  ] as unknown as FormSystemSection[]
  render(<PreviewSummary sections={sections} onNavigate={jest.fn()} />)
  expect(
    screen.getAllByRole('status').map((output) => output.textContent),
  ).toEqual([
    'required:0Vantar gildi',
    'email:0Vantar gildi',
    'optional:0',
    'valid:0',
  ])
})
