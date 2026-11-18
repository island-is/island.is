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
  it('T1: Add opens an empty row form and hides the Add button', async () => {
    setup()

    await userEvent.click(addButton() as HTMLElement)

    expect(nameInput()).toHaveValue('')
    expect(addButton()).not.toBeInTheDocument()
  })

  it('T2: a new row is stored at once with isUnsaved', async () => {
    const { getForm } = setup()

    await userEvent.click(addButton() as HTMLElement)

    expect(getForm().getValues('people')).toEqual([{ isUnsaved: true }])
  })

  it('T3: Save on an invalid row keeps it open and shows the error', async () => {
    const { getForm } = setup()

    await userEvent.click(addButton() as HTMLElement)
    await userEvent.click(screen.getByRole('button', { name: 'Vista' }))

    expect(nameInput()).toBeInTheDocument()
    expect(await screen.findByText('Ógilt gildi')).toBeInTheDocument()
    expect(getForm().getValues('people')).toEqual([{ isUnsaved: true }])
  })

  it('T4: Save on a valid row shows it in the table and keeps isUnsaved: false', async () => {
    const { getForm } = setup()

    await addRow('Anna')

    expect(tableRows()).toEqual(['Anna'])
    expect(addButton()).toBeInTheDocument()
    expect(getForm().getValues('people')).toEqual([
      { name: 'Anna', isUnsaved: false },
    ])
  })

  it('T5: Cancel on a new row removes it from the answers', async () => {
    const { getForm } = setup()

    await userEvent.click(addButton() as HTMLElement)
    await userEvent.type(nameInput(), 'Anna')
    await userEvent.click(screen.getByRole('button', { name: 'Hætta við' }))

    expect(tableRows()).toEqual([])
    expect(getForm().getValues('people')).toEqual([])
  })

  it('T6: Edit opens a saved row; Cancel closes it and keeps the row', async () => {
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
  it('T8: Edit buttons are disabled while another row is open', async () => {
    setup()
    await addRow('Anna')
    await addRow('Bára')

    await userEvent.click(editButtons()[0])

    expect(tableRows()).toEqual(['Bára'])
    expect(editButtons()[0]).toBeDisabled()
  })

  it('T9: Delete stays active while another row is open', async () => {
    const { getForm } = setup()
    await addRow('Anna')

    await userEvent.click(addButton() as HTMLElement)
    await userEvent.click(deleteButtons()[0])

    expect(tableRows()).toEqual([])
    expect(nameInput()).toBeInTheDocument()
    expect(getForm().getValues('people')).toEqual([
      { name: 'Anna', isUnsaved: false, isRemoved: true },
      { isUnsaved: true },
    ])
  })

  it('T10: Delete hides the row but keeps it in the answers with isRemoved', async () => {
    const { getForm } = setup()
    await addRow('Anna')

    await userEvent.click(deleteButtons()[0])

    expect(tableRows()).toEqual([])
    expect(getForm().getValues('people')).toEqual([
      { name: 'Anna', isUnsaved: false, isRemoved: true },
    ])
  })

  it('T11: Next with a valid row open is blocked with a message', async () => {
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

  it('T11b: Next with an invalid row open fails validation', async () => {
    const { submit } = setup()

    await userEvent.click(addButton() as HTMLElement)

    expect(await submit()).toEqual({ outcome: 'invalid' })
    expect(await screen.findByText('Ógilt gildi')).toBeInTheDocument()
  })

  it('T12: Next with no row open purges removed rows', async () => {
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

  it('T13: a stored unsaved row opens in the form on mount', () => {
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

  it('T14: maxRows disables Add; removed rows do not count', async () => {
    setup({ maxRows: 2 })
    await addRow('Anna')
    await addRow('Bára')

    expect(addButton()).toBeDisabled()

    await userEvent.click(deleteButtons()[0])
    expect(addButton()).toBeEnabled()
  })
})
