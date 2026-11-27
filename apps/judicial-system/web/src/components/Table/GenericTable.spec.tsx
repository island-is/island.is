import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import GenericTable from './GenericTable'
import * as styles from './Table.css'

describe('GenericTable', () => {
  let user: ReturnType<typeof userEvent.setup>

  const columns = [
    {
      title: 'Málsnúmer',
      compare: (a: string, b: string) => a.localeCompare(b),
      render: (cell: string) => <span>{cell}</span>,
    },
  ]

  const renderTable = (
    onClick = jest.fn(),
    isDisabled = false,
    contextMenuItems: { title: string; onClick: () => void }[] = [],
  ) =>
    render(
      <GenericTable
        tableId="test-table"
        columns={columns}
        rows={[
          {
            id: '1',
            cells: ['R-123/2021'],
            contextMenuItems,
            onClick,
            isDisabled,
            isLoading: false,
            label: 'R-123/2021',
          },
        ]}
        loadingIndicator={() => <span>loading</span>}
      />,
    )

  beforeEach(() => {
    user = userEvent.setup()
    window.localStorage.clear()
  })

  it('marks the sortable column header with aria-sort', async () => {
    renderTable()

    const header = await screen.findByRole('columnheader', {
      name: /Málsnúmer/,
    })
    expect(header).toHaveAttribute('aria-sort', 'none')

    await user.click(screen.getByRole('button', { name: /Raða eftir dálki/ }))
    expect(
      screen.getByRole('columnheader', { name: /Málsnúmer/ }),
    ).toHaveAttribute('aria-sort', 'ascending')

    await user.click(screen.getByRole('button', { name: /Raða eftir dálki/ }))
    expect(
      screen.getByRole('columnheader', { name: /Málsnúmer/ }),
    ).toHaveAttribute('aria-sort', 'descending')
  })

  it('exposes a descriptive accessible name on the row', async () => {
    renderTable()

    expect(
      await screen.findByRole('button', { name: 'Opna mál R-123/2021' }),
    ).toBeInTheDocument()
  })

  it('activates the row with the keyboard', async () => {
    const onClick = jest.fn()
    renderTable(onClick)

    const row = await screen.findByRole('button', {
      name: 'Opna mál R-123/2021',
    })
    expect(row).toHaveAttribute('tabindex', '0')

    row.focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)

    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('is not keyboard focusable or activatable when disabled', async () => {
    const onClick = jest.fn()
    renderTable(onClick, true)

    const row = await screen.findByRole('button', {
      name: 'Opna mál R-123/2021',
    })
    expect(row).toHaveAttribute('tabindex', '-1')
    expect(row).toHaveAttribute('aria-disabled', 'true')

    row.focus()
    await user.keyboard('{Enter}')
    expect(onClick).not.toHaveBeenCalled()
  })

  const row = (
    id: string,
    caseNumber: string,
    onClick: jest.Mock = jest.fn(),
    actionLabel?: string,
  ) => ({
    id,
    cells: [caseNumber],
    contextMenuItems: [],
    onClick,
    isDisabled: false,
    isLoading: false,
    label: caseNumber,
    actionLabel,
  })

  const customTable = (
    rows: ReturnType<typeof row>[],
    {
      fadeInNewRows,
      fixedLayout,
    }: { fadeInNewRows?: boolean; fixedLayout?: boolean } = {},
  ) => (
    <GenericTable
      tableId="test-table"
      columns={columns}
      rows={rows}
      loadingIndicator={() => <span>loading</span>}
      fadeInNewRows={fadeInNewRows}
      fixedLayout={fixedLayout}
    />
  )

  const renderCustomTable = (
    onClick: jest.Mock,
    { actionLabel }: { actionLabel?: string },
  ) => render(customTable([row('1', 'R-123/2021', onClick, actionLabel)]))

  it('names the row with its action label when one is given', async () => {
    renderCustomTable(jest.fn(), {
      actionLabel: 'Velja mál R-123/2021 til að ljúka',
    })

    expect(
      await screen.findByRole('button', {
        name: 'Velja mál R-123/2021 til að ljúka',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Opna mál R-123/2021' }),
    ).not.toBeInTheDocument()
  })

  it('passes the mouse event to the row click, and nothing from the keyboard', async () => {
    const onClick = jest.fn()
    renderTable(onClick)

    const row = await screen.findByRole('button', {
      name: 'Opna mál R-123/2021',
    })

    await user.click(row)
    expect(onClick).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: 1 }),
    )

    row.focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenLastCalledWith()
  })

  it('shows a row added after the first render, and it can be clicked and focused at once', async () => {
    const onClick = jest.fn()
    const { rerender } = render(
      customTable([row('1', 'R-123/2021')], { fadeInNewRows: true }),
    )

    rerender(
      customTable([row('1', 'R-123/2021'), row('2', 'R-456/2021', onClick)], {
        fadeInNewRows: true,
      }),
    )

    const added = screen.getByRole('button', { name: 'Opna mál R-456/2021' })
    expect(added).toHaveAttribute('tabindex', '0')

    added.focus()
    expect(added).toHaveFocus()

    await user.click(added)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('starts the rows of the first render fully shown when new rows fade in', () => {
    render(customTable([row('1', 'R-123/2021')], { fadeInNewRows: true }))

    expect(
      screen.getByRole('button', { name: 'Opna mál R-123/2021' }),
    ).not.toHaveStyle({ opacity: '0' })
  })

  it('keeps a row in place when another row leaves, with new rows fading in', () => {
    const { rerender } = render(
      customTable([row('1', 'R-123/2021'), row('2', 'R-456/2021')], {
        fadeInNewRows: true,
      }),
    )
    const kept = screen.getByRole('button', { name: 'Opna mál R-456/2021' })

    rerender(customTable([row('2', 'R-456/2021')], { fadeInNewRows: true }))

    expect(screen.getByRole('button', { name: 'Opna mál R-456/2021' })).toBe(
      kept,
    )
  })

  const widthColumns = [
    { ...columns[0], width: '30%' },
    {
      title: 'Ákærði',
      compare: (a: string, b: string) => a.localeCompare(b),
      render: (cell: string) => <span>{cell}</span>,
    },
  ]

  const renderWidthTable = (fixedLayout: boolean) =>
    render(
      <GenericTable
        tableId="test-table"
        columns={widthColumns}
        rows={[{ ...row('1', 'R-123/2021'), cells: ['R-123/2021', 'Jón'] }]}
        loadingIndicator={() => <span>loading</span>}
        fixedLayout={fixedLayout}
      />,
    )

  it('lays out the columns from the given widths with fixedLayout', () => {
    const { container } = renderWidthTable(true)

    expect(container.querySelector('table')).toHaveClass(
      styles.fixedLayoutTable,
    )

    const headers = container.querySelectorAll('th')
    expect(headers[0]).toHaveStyle({ width: '30%' })
    expect(headers[1]).not.toHaveAttribute('style')
    expect(headers[2]).toHaveClass(styles.fixedLayoutMenuColumn)
    expect(container.querySelector('td[width="4%"]')).toHaveClass(
      styles.fixedLayoutMenuColumn,
    )
  })

  it('leaves the column widths to the content without fixedLayout', () => {
    const { container } = renderWidthTable(false)

    expect(container.querySelector('table')).toHaveAttribute(
      'class',
      styles.table,
    )
    container
      .querySelectorAll('th')
      .forEach((th) => expect(th).not.toHaveAttribute('style'))
  })

  it('renders plain rows sized by their content without the new props', () => {
    const { container } = renderTable()

    const table = container.querySelector('table')
    expect(table).toHaveAttribute('class', styles.table)
    expect(container.querySelectorAll('th')[1]).toHaveAttribute(
      'class',
      styles.th,
    )

    const bodyRow = screen.getByRole('button', { name: 'Opna mál R-123/2021' })
    expect(bodyRow.tagName).toBe('TR')
    expect(bodyRow).not.toHaveAttribute('style')

    const menuCell = container.querySelector('td[width="4%"]')
    expect(menuCell).toBeInTheDocument()
    expect(menuCell).not.toHaveAttribute('class')
  })

  it('shows the column titles as plain text when not sortable', () => {
    render(
      <GenericTable
        tableId="test-table"
        columns={columns}
        rows={[]}
        loadingIndicator={() => <span>loading</span>}
        sortable={false}
      />,
    )

    const header = screen.getByRole('columnheader', { name: 'Málsnúmer' })
    expect(header).not.toHaveAttribute('aria-sort')
    expect(
      screen.queryByRole('button', { name: /Raða eftir dálki/ }),
    ).not.toBeInTheDocument()
  })

  it('exposes the context menu as a single named trigger', async () => {
    renderTable(jest.fn(), false, [{ title: 'Eyða', onClick: jest.fn() }])

    // A single, accessibly-named menu trigger — not a duplicate tab stop with
    // an empty-named wrapper plus a redundant inner button. The name is
    // descriptive (derived from the row label) so screen reader users can tell
    // each row's menu apart.
    const triggers = await screen.findAllByRole('button', {
      name: 'Frekari aðgerðir fyrir mál R-123/2021',
    })
    expect(triggers).toHaveLength(1)
    expect(triggers[0]).toHaveAttribute('aria-haspopup', 'menu')
    expect(triggers[0]).toHaveAttribute('tabindex', '0')
  })

  describe.each([false, true])(
    'keyboard activation with fadeInNewRows %s',
    (fadeInNewRows) => {
      const renderWithMenu = (onClick: jest.Mock) =>
        render(
          <GenericTable
            tableId="test-table"
            columns={columns}
            rows={[
              {
                ...row('1', 'R-123/2021', onClick),
                contextMenuItems: [{ title: 'Eyða', onClick: jest.fn() }],
              },
            ]}
            loadingIndicator={() => <span>loading</span>}
            fadeInNewRows={fadeInNewRows}
          />,
        )

      it('does not activate the row from Enter or Space on its menu button', async () => {
        const onClick = jest.fn()
        renderWithMenu(onClick)

        const trigger = await screen.findByRole('button', {
          name: 'Frekari aðgerðir fyrir mál R-123/2021',
        })
        fireEvent.keyDown(trigger, { key: 'Enter' })
        fireEvent.keyDown(trigger, { key: ' ' })

        expect(onClick).not.toHaveBeenCalled()

        fireEvent.keyDown(
          screen.getByRole('button', { name: 'Opna mál R-123/2021' }),
          { key: 'Enter' },
        )

        expect(onClick).toHaveBeenCalledTimes(1)
      })

      it('does not activate the row from a held key', async () => {
        const onClick = jest.fn()
        renderWithMenu(onClick)

        const rowElement = await screen.findByRole('button', {
          name: 'Opna mál R-123/2021',
        })
        fireEvent.keyDown(rowElement, { key: 'Enter', repeat: true })
        fireEvent.keyDown(rowElement, { key: ' ', repeat: true })

        expect(onClick).not.toHaveBeenCalled()
      })
    },
  )
})
