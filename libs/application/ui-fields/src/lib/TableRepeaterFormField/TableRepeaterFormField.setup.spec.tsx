import '@testing-library/jest-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildTableRepeaterField } from '@island.is/application/core'
import {
  FormValue,
  Schema,
  TableRepeaterField,
} from '@island.is/application/types'
import { z } from 'zod'
import { renderRepeater } from '../../test-utils/repeaterHarness'
import { TableRepeaterFormField } from './TableRepeaterFormField'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    formatMessage: jest.requireActual('../../test-utils/repeaterHarness')
      .formatMessage,
    lang: 'is',
  }),
}))

jest.mock('@island.is/react-spa/bff', () => ({
  useUserInfo: () => undefined,
}))

type Config = Parameters<typeof buildTableRepeaterField>[0]

const rowSchema = z.object({ name: z.string().min(1) })

const setup = (
  overrides: Partial<Config>,
  answers: FormValue = {},
  dataSchema: Schema = z.object({ people: z.array(rowSchema) }),
) =>
  renderRepeater({
    Component: TableRepeaterFormField,
    field: buildTableRepeaterField({
      id: 'people',
      fields: { name: { component: 'input', label: 'Heiti' } },
      ...overrides,
    } as Config) as TableRepeaterField,
    answers,
    dataSchema,
  })

const tableRows = () =>
  Array.from(document.querySelectorAll('tbody tr')).map((row) =>
    Array.from(row.querySelectorAll('td'))
      .slice(1)
      .map((cell) => cell.textContent)
      .join(' | '),
  )

const addRow = async (name: string) => {
  await userEvent.click(screen.getByRole('button', { name: /Bæta við/ }))
  await userEvent.type(screen.getByRole('textbox'), name)
  await userEvent.click(screen.getByRole('button', { name: 'Vista' }))
}

describe('TableRepeater setup and side effects', () => {
  it('T26: a field-level defaultValue fills an empty table on mount', async () => {
    const { getForm } = setup({ defaultValue: [{ name: 'Anna' }] })

    await waitFor(() => expect(tableRows()).toEqual(['Anna']))
    expect(getForm().getValues('people')).toEqual([{ name: 'Anna' }])
  })

  it('T26: a defaultValue function receives the application', async () => {
    const defaultValue = jest.fn(() => [{ name: 'Anna' }])
    const { application } = setup({ defaultValue })

    await waitFor(() => expect(tableRows()).toEqual(['Anna']))
    expect(defaultValue).toHaveBeenCalledWith(
      application,
      expect.anything(),
      'is',
    )
  })

  it('T26: defaultValue leaves stored rows alone', async () => {
    setup(
      { defaultValue: [{ name: 'Anna' }] },
      { people: [{ name: 'Bára', isUnsaved: false }] },
    )

    await waitFor(() => expect(tableRows()).toEqual(['Bára']))
  })

  it('T27: initActiveFieldIfEmpty opens one row on mount when empty', async () => {
    const { getForm } = setup({ initActiveFieldIfEmpty: true })

    expect(await screen.findByRole('textbox')).toHaveValue('')
    expect(getForm().getValues('people')).toEqual([{ isUnsaved: true }])
  })

  it('T27: initActiveFieldIfEmpty does nothing when rows exist', () => {
    setup(
      { initActiveFieldIfEmpty: true },
      { people: [{ name: 'Anna', isUnsaved: false }] },
    )

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(tableRows()).toEqual(['Anna'])
  })

  it('T28 (known issue): initActiveFieldIfEmpty wipes other form values', async () => {
    const { getForm } = setup(
      { initActiveFieldIfEmpty: true },
      { other: 'kept' },
    )

    await screen.findByRole('textbox')
    expect(getForm().getValues('other')).toBeUndefined()
  })

  it('T29: onSubmitLoad runs after save and writes its values', async () => {
    const onSubmitLoad = jest.fn(async () => ({
      dictionaryOfItems: [{ path: 'people[0].disabled', value: 'true' }],
    }))
    const { getForm, application } = setup({
      onSubmitLoad,
      table: {
        rowProps: ({ row }) => ({ disabled: row.disabled === 'true' }),
      },
    })

    await addRow('Anna')

    await waitFor(() =>
      expect(getForm().getValues('people.0.disabled')).toBe('true'),
    )
    expect(onSubmitLoad).toHaveBeenCalledTimes(1)
    expect(onSubmitLoad).toHaveBeenCalledWith({
      apolloClient: expect.anything(),
      application,
      tableItems: [expect.objectContaining({ name: 'Anna' })],
    })
    expect(document.querySelectorAll('tbody td')[1].className).toMatch(
      /disabled/i,
    )
  })

  it('T30: onSubmitLoad failing shows loadErrorMessage and keeps the row', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const { getForm } = setup({
      onSubmitLoad: async () => {
        throw new Error('down')
      },
      loadErrorMessage: 'Tókst ekki að sækja gögn',
    })

    await addRow('Anna')

    expect(
      await screen.findByText('Tókst ekki að sækja gögn'),
    ).toBeInTheDocument()
    expect(tableRows()).toEqual(['Anna'])
    expect(getForm().getValues('people')).toEqual([
      { name: 'Anna', isUnsaved: false },
    ])
  })

  it('T31: a string error on the field shows as an alert', async () => {
    const { submit } = setup(
      {},
      { people: [] },
      z.object({
        people: z.array(rowSchema).refine((rows) => rows.length > 0, {
          message: 'Skráðu að minnsta kosti einn',
        }),
      }),
    )

    expect(await submit()).toEqual({ outcome: 'invalid' })
    expect(
      await screen.findByText('Skráðu að minnsta kosti einn'),
    ).toBeInTheDocument()
  })
})
