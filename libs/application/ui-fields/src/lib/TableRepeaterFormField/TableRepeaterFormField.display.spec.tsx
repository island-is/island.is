import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildTableRepeaterField } from '@island.is/application/core'
import {
  FormValue,
  TableRepeaterCellContext,
  TableRepeaterField,
} from '@island.is/application/types'
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

const setup = (
  overrides: Partial<Config>,
  answers: FormValue = {},
  externalData = {},
) =>
  renderRepeater({
    Component: TableRepeaterFormField,
    field: buildTableRepeaterField({
      id: 'people',
      fields: { name: { component: 'input', label: 'Heiti' } },
      ...overrides,
    } as Config) as TableRepeaterField,
    answers,
    externalData,
  })

const saved = (rows: Array<Record<string, unknown>>) => ({
  people: rows.map((row) => ({ ...row, isUnsaved: false })),
})

const headerCells = () =>
  Array.from(document.querySelectorAll('thead th'))
    .slice(1)
    .map((cell) => cell.textContent)
const bodyRows = () => Array.from(document.querySelectorAll('tbody tr'))
const tableRows = () =>
  bodyRows().map((row) =>
    Array.from(row.querySelectorAll('td'))
      .slice(1)
      .map((cell) => cell.textContent)
      .join(' | '),
  )
const deleteButtons = () =>
  screen.queryAllByRole('button', { description: /Eyða/ })
const editButtons = () =>
  screen.queryAllByRole('button', { description: /Breyta/ })

describe('TableRepeater table display', () => {
  it('T15: default header comes from labels; displayInTable: false is left out', () => {
    setup(
      {
        fields: {
          name: { component: 'input', label: 'Heiti' },
          age: { component: 'input', label: 'Aldur', displayInTable: false },
        },
      },
      saved([{ name: 'Anna', age: '30' }]),
    )

    expect(headerCells()).toEqual(['Heiti'])
    expect(tableRows()).toEqual(['Anna'])
  })

  it('T16: nationalIdWithName gives a name and a formatted national ID column', () => {
    setup(
      { fields: { person: { component: 'nationalIdWithName' } } },
      saved([{ person: { name: 'Anna', nationalId: '0101302989' } }]),
    )

    expect(headerCells()).toEqual(['Nafn', 'Kennitala'])
    expect(tableRows()).toEqual(['Anna | 010130-2989'])
  })

  it('T17: vehiclePermnoWithInfo shows the permno', () => {
    setup(
      {
        fields: {
          vehicle: { component: 'vehiclePermnoWithInfo', label: 'Ökutæki' },
        },
      },
      saved([{ vehicle: { permno: 'AB123', makeAndColor: 'Volvo, rauður' } }]),
    )

    expect(headerCells()).toEqual(['Ökutæki'])
    expect(tableRows()).toEqual(['AB123'])
  })

  it('T18: columns set headings and values in their own order', () => {
    setup(
      {
        fields: {
          first: { component: 'input', label: 'Fyrst' },
          second: { component: 'input', label: 'Annað' },
        },
        table: {
          columns: [
            { header: 'B', value: 'second' },
            { header: 'A', value: 'first' },
          ],
        },
      },
      saved([{ first: 'a1', second: 'b1' }]),
    )

    expect(headerCells()).toEqual(['B', 'A'])
    expect(tableRows()).toEqual(['b1 | a1'])
  })

  it('T19: a value function receives the row, a display index over visible rows and the application', () => {
    const value = jest.fn(
      ({ row, displayIndex }: TableRepeaterCellContext) =>
        `${displayIndex}:${row.name}`,
    )
    const { application } = setup(
      { table: { columns: [{ header: 'Heiti', value }] } },
      {
        people: [
          { name: 'Gone', isUnsaved: false, isRemoved: true },
          { name: 'Anna', isUnsaved: false },
          { name: 'Bára', isUnsaved: false },
        ],
      },
    )

    expect(tableRows()).toEqual(['0:Anna', '1:Bára'])
    expect(value).toHaveBeenCalledWith(
      expect.objectContaining({
        row: expect.objectContaining({ name: 'Anna' }),
        displayIndex: 0,
        application: expect.objectContaining({ id: application.id }),
      }),
    )
  })

  it('T19b: while a saved row is open for editing, the others keep their display index', async () => {
    setup(
      {
        editField: true,
        table: {
          columns: [
            {
              header: 'Heiti',
              value: ({ row, displayIndex }) => `${displayIndex}:${row.name}`,
            },
          ],
        },
      },
      saved([{ name: 'Anna' }, { name: 'Bára' }, { name: 'Dóra' }]),
    )

    await userEvent.click(editButtons()[0])

    expect(tableRows()).toEqual(['1:Bára', '2:Dóra'])
  })

  it('T21: hideTableHeaderIfEmpty hides the table until a saved row exists', async () => {
    setup({ hideTableHeaderIfEmpty: true })

    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Bæta við/ }))
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox'), 'Anna')
    await userEvent.click(screen.getByRole('button', { name: 'Vista' }))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('T21: without hideTableHeaderIfEmpty the empty table shows its header', () => {
    setup({})

    expect(headerCells()).toEqual(['Heiti'])
    expect(bodyRows()).toHaveLength(0)
  })

  it('T21b: hideTableHeaderIfEmpty hides the table while its only saved row is open for editing', async () => {
    setup(
      { editField: true, hideTableHeaderIfEmpty: true },
      saved([{ name: 'Anna' }]),
    )

    expect(screen.getByRole('table')).toBeInTheDocument()

    await userEvent.click(editButtons()[0])

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('Anna')
  })

  it('T22: static rows come first, without buttons, in column order', () => {
    setup(
      {
        fields: {
          first: { component: 'input', label: 'Fyrst' },
          second: { component: 'input', label: 'Annað' },
        },
        getStaticTableData: () => [{ second: 'static b', first: 'static a' }],
      },
      saved([{ first: 'a1', second: 'b1' }]),
    )

    expect(tableRows()).toEqual(['static a | static b', 'a1 | b1'])
    expect(bodyRows()[0].querySelector('button')).toBeNull()
    expect(deleteButtons()).toHaveLength(1)
  })

  it('T23: rowProps disabled greys out a row', () => {
    setup(
      {
        table: {
          rowProps: ({ row }) => ({ disabled: row.disabled === 'true' }),
        },
      },
      saved([
        { name: 'Anna', disabled: 'true' },
        { name: 'Bára', disabled: 'false' },
      ]),
    )

    const [annaCell, baraCell] = bodyRows().map(
      (row) => row.querySelectorAll('td')[1],
    )
    expect(annaCell.className).toMatch(/disabled/i)
    expect(baraCell.className).not.toMatch(/disabled/i)
  })

  it("T23: disabled === 'true' alone no longer greys out a row", () => {
    setup({}, saved([{ name: 'Anna', disabled: 'true' }]))

    expect(bodyRows()[0].querySelectorAll('td')[1].className).not.toMatch(
      /disabled/i,
    )
  })
})
