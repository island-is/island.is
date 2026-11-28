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
  it('flattens nationalIdWithName and vehiclePermnoWithInfo into table columns', () => {
    setup(
      {
        fields: {
          person: { component: 'nationalIdWithName' },
          vehicle: { component: 'vehiclePermnoWithInfo', label: 'Ökutæki' },
        },
      },
      saved([
        {
          person: { name: 'Anna', nationalId: '0101302989' },
          vehicle: { permno: 'AB123', makeAndColor: 'Volvo, rauður' },
        },
      ]),
    )

    expect(headerCells()).toEqual(['Nafn', 'Kennitala', 'Ökutæki'])
    expect(tableRows()).toEqual(['Anna | 010130-2989 | AB123'])
  })

  it('columns set headings and values in their own order', () => {
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

  it('gives a value function the row, a display index over visible rows and the application', async () => {
    const value = jest.fn(
      ({ row, displayIndex }: TableRepeaterCellContext) =>
        `${displayIndex}:${row.name}`,
    )
    const { application } = setup(
      { editField: true, table: { columns: [{ header: 'Heiti', value }] } },
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

    await userEvent.click(editButtons()[0])

    expect(tableRows()).toEqual(['1:Bára'])
  })

  it('hideTableHeaderIfEmpty hides the table until a saved row exists', async () => {
    setup({ hideTableHeaderIfEmpty: true })

    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Bæta við/ }))
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox'), 'Anna')
    await userEvent.click(screen.getByRole('button', { name: 'Vista' }))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('hideTableHeaderIfEmpty hides the table while its only saved row is open for editing', async () => {
    setup(
      { editField: true, hideTableHeaderIfEmpty: true },
      saved([{ name: 'Anna' }]),
    )

    expect(screen.getByRole('table')).toBeInTheDocument()

    await userEvent.click(editButtons()[0])

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('Anna')
  })

  it('static rows come first, without buttons, in column order', () => {
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

  it('rowProps disabled greys out a row', () => {
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

  it('rowProps canRemove false makes delete a no-op with the disabled tooltip', async () => {
    const rowProps = jest.fn(({ row }: { row: Record<string, string> }) => ({
      canRemove: row.name !== 'Anna',
    }))
    const { getForm, application } = setup(
      {
        table: { rowProps },
        removeButtonDisabledTooltipText: 'Ekki hægt að eyða',
      },
      saved([{ name: 'Anna' }, { name: 'Bára' }]),
    )

    const locked = screen.getByRole('button', {
      description: 'Ekki hægt að eyða',
    })
    expect(locked).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(locked)

    expect(tableRows()).toEqual(['Anna', 'Bára'])
    expect(getForm().getValues('people.0.isRemoved')).toBeUndefined()
    expect(rowProps).toHaveBeenCalledWith(
      expect.objectContaining({
        application: expect.objectContaining({ id: application.id }),
        row: expect.objectContaining({ name: 'Anna' }),
      }),
    )
  })

  it('rowProps canEdit false makes edit a no-op with the disabled tooltip', async () => {
    setup(
      {
        editField: true,
        table: { rowProps: ({ row }) => ({ canEdit: row.name !== 'Anna' }) },
        editButtonDisabledTooltipText: 'Ekki hægt að breyta',
      },
      saved([{ name: 'Anna' }, { name: 'Bára' }]),
    )

    const locked = screen.getByRole('button', {
      description: 'Ekki hægt að breyta',
    })
    expect(locked).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(locked)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(tableRows()).toEqual(['Anna', 'Bára'])
  })
})
