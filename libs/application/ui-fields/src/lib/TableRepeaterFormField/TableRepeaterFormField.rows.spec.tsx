import '@testing-library/jest-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildTableRepeaterField } from '@island.is/application/core'
import { FormValue, TableRepeaterField } from '@island.is/application/types'
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

const dataSchema = z.object({
  people: z.array(z.object({ name: z.string().min(1) })),
})

const setup = (
  overrides: Partial<Parameters<typeof buildTableRepeaterField>[0]> = {},
  answers: FormValue = {},
) =>
  renderRepeater({
    Component: TableRepeaterFormField,
    field: buildTableRepeaterField({
      id: 'people',
      editField: true,
      fields: { name: { component: 'input', label: 'Heiti' } },
      ...overrides,
    }) as TableRepeaterField,
    answers,
    dataSchema,
  })

const addButton = () => screen.queryByRole('button', { name: /Bæta við/ })
const nameInput = () => screen.getByRole('textbox', { name: /Heiti/ })
const deleteButtons = () =>
  screen.queryAllByRole('button', { description: 'Eyða færslu' })
const editButtons = () =>
  screen.queryAllByRole('button', { description: 'Breyta færslu' })
const tableRows = () =>
  screen
    .queryAllByRole('row')
    .slice(1)
    .map((row) =>
      Array.from(row.querySelectorAll('td'))
        .slice(1)
        .map((cell) => cell.textContent)
        .join(' | '),
    )

const addRow = async (name: string) => {
  await userEvent.click(addButton() as HTMLElement)
  if (name) await userEvent.type(nameInput(), name)
  await userEvent.click(screen.getByRole('button', { name: 'Vista' }))
}

describe('TableRepeater rows', () => {
  it('stores a new row as unsaved and shows it in the table once saved', async () => {
    const { getForm } = setup()

    await userEvent.click(addButton() as HTMLElement)
    expect(getForm().getValues('people')).toEqual([{ isUnsaved: true }])

    await userEvent.type(nameInput(), 'Anna')
    await userEvent.click(screen.getByRole('button', { name: 'Vista' }))

    expect(tableRows()).toEqual(['Anna'])
    expect(addButton()).toBeInTheDocument()
    expect(getForm().getValues('people')).toEqual([
      { name: 'Anna', isUnsaved: false },
    ])
  })

  it('keeps an invalid row open on Save and shows the error', async () => {
    const { getForm } = setup()

    await userEvent.click(addButton() as HTMLElement)
    await userEvent.click(screen.getByRole('button', { name: 'Vista' }))

    expect(nameInput()).toBeInTheDocument()
    expect(await screen.findByText('Ógilt gildi')).toBeInTheDocument()
    expect(getForm().getValues('people')).toEqual([{ isUnsaved: true }])
  })

  it('removes a new row from the answers on Cancel', async () => {
    const { getForm } = setup()

    await userEvent.click(addButton() as HTMLElement)
    await userEvent.type(nameInput(), 'Anna')
    await userEvent.click(screen.getByRole('button', { name: 'Hætta við' }))

    expect(tableRows()).toEqual([])
    expect(getForm().getValues('people')).toEqual([])
  })

  it('opens a saved row on Edit and keeps it on Cancel', async () => {
    const { getForm } = setup()
    await addRow('Anna')

    await userEvent.click(editButtons()[0])
    expect(nameInput()).toHaveValue('Anna')
    expect(tableRows()).toEqual([])

    await userEvent.click(screen.getByRole('button', { name: 'Hætta við' }))
    expect(tableRows()).toEqual(['Anna'])
    expect(getForm().getValues('people')).toEqual([
      { name: 'Anna', isUnsaved: false },
    ])
  })

  it('disables Edit buttons while another row is open', async () => {
    setup()
    await addRow('Anna')
    await addRow('Bára')

    await userEvent.click(editButtons()[0])

    expect(tableRows()).toEqual(['Bára'])
    expect(editButtons()[0]).toBeDisabled()
  })

  it('hides a deleted row but keeps it in the answers with isRemoved', async () => {
    const { getForm } = setup()
    await addRow('Anna')

    await userEvent.click(deleteButtons()[0])

    expect(tableRows()).toEqual([])
    expect(getForm().getValues('people')).toEqual([
      { name: 'Anna', isUnsaved: false, isRemoved: true },
    ])
  })

  it('blocks Next with a message while a row is open', async () => {
    const { submit } = setup()

    await userEvent.click(addButton() as HTMLElement)
    await userEvent.type(nameInput(), 'Anna')

    expect(await submit()).toEqual({
      outcome: 'blocked',
      message: 'Vantar að klára skráningu',
    })
    expect(
      await screen.findByText('Vantar að klára skráningu'),
    ).toBeInTheDocument()
  })

  it('purges removed rows on Next when no row is open', async () => {
    const { getForm, submit } = setup()
    await addRow('Anna')
    await addRow('Bára')

    await userEvent.click(deleteButtons()[0])

    expect(await submit()).toEqual({ outcome: 'submitted' })
    await waitFor(() =>
      expect(getForm().getValues('people')).toEqual([
        { name: 'Bára', isUnsaved: false },
      ]),
    )
  })

  it('opens a stored unsaved row in the form on mount', () => {
    setup(
      {},
      {
        people: [
          { name: 'Anna', isUnsaved: false },
          { name: 'Bá', isUnsaved: true },
        ],
      },
    )

    expect(nameInput()).toHaveValue('Bá')
    expect(tableRows()).toEqual(['Anna'])
  })

  it('hides a stored removed row, does not count it and purges it on Next', async () => {
    const { getForm, submit } = setup(
      { maxRows: 2 },
      {
        people: [
          { name: 'Anna', isUnsaved: false, isRemoved: true },
          { name: 'Bára', isUnsaved: false },
        ],
      },
    )

    expect(tableRows()).toEqual(['Bára'])
    expect(addButton()).toBeEnabled()

    expect(await submit()).toEqual({ outcome: 'submitted' })
    await waitFor(() =>
      expect(getForm().getValues('people')).toEqual([
        { name: 'Bára', isUnsaved: false },
      ]),
    )
  })

  it('disables Add at maxRows; removed rows do not count', async () => {
    setup({ maxRows: 2 })
    await addRow('Anna')
    await addRow('Bára')

    expect(addButton()).toBeDisabled()

    await userEvent.click(deleteButtons()[0])
    expect(addButton()).toBeEnabled()
  })
})
