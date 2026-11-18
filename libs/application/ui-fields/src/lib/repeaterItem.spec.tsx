import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  buildFieldsRepeaterField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import {
  FieldsRepeaterField,
  RepeaterItem,
  Schema,
  TableRepeaterField,
} from '@island.is/application/types'
import { z } from 'zod'
import { renderRepeater } from '../test-utils/repeaterHarness'
import { FieldsRepeaterFormField } from './FieldsRepeaterFormField/FieldsRepeaterFormField'
import { TableRepeaterFormField } from './TableRepeaterFormField/TableRepeaterFormField'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    formatMessage: jest.requireActual('../test-utils/repeaterHarness')
      .formatMessage,
    lang: 'is',
  }),
}))

jest.mock('@island.is/react-spa/bff', () => ({
  useUserInfo: () => undefined,
}))

type Items = Record<string, RepeaterItem>
type Harness = ReturnType<typeof renderRepeater>

const repeaters = [
  {
    name: 'TableRepeater' as const,
    open: async (fields: Items, dataSchema?: Schema) => {
      const harness = renderRepeater({
        Component: TableRepeaterFormField,
        field: buildTableRepeaterField({
          id: 'people',
          fields,
        }) as TableRepeaterField,
        dataSchema,
      })
      await userEvent.click(screen.getByRole('button', { name: /Bæta við/ }))
      return harness
    },
    validate: async (_harness: Harness) => {
      await userEvent.click(screen.getByRole('button', { name: 'Vista' }))
    },
  },
  {
    name: 'FieldsRepeater' as const,
    open: async (fields: Items, dataSchema?: Schema) =>
      renderRepeater({
        Component: FieldsRepeaterFormField,
        field: buildFieldsRepeaterField({
          id: 'people',
          fields,
        }) as FieldsRepeaterField,
        dataSchema,
      }),
    validate: async (harness: Harness) => {
      await harness.submit()
    },
  },
]

describe.each(repeaters)('$name row fields', ({ open, validate }) => {
  it('I10: field errors show on the row', async () => {
    const harness = await open(
      { name: { component: 'input', label: 'Heiti' } },
      z.object({ people: z.array(z.object({ name: z.string().min(1) })) }),
    )

    await validate(harness)

    expect(await screen.findByText('Ógilt gildi')).toBeInTheDocument()
  })

  it('I10: errors on a nested item id', async () => {
    const harness = await open(
      { 'address.street': { component: 'input', label: 'Gata' } },
      z.object({
        people: z.array(
          z.object({ address: z.object({ street: z.string().min(1) }) }),
        ),
      }),
    )

    await validate(harness)

    expect(await screen.findByText('Ógilt gildi')).toBeInTheDocument()
  })
})
