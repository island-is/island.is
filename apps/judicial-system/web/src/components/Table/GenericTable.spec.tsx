import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'

import GenericTable from './GenericTable'

import '@testing-library/react'

describe('GenericTable', () => {
  let user: UserEvent

  const columns = [
    {
      title: 'Málsnúmer',
      compare: (a: string, b: string) => a.localeCompare(b),
      render: (cell: string) => <span>{cell}</span>,
    },
  ]

  const renderTable = (onClick = jest.fn(), isDisabled = false) =>
    render(
      <GenericTable
        tableId="test-table"
        columns={columns}
        rows={[
          {
            id: '1',
            cells: ['R-123/2021'],
            contextMenuItems: [],
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

    const header = screen.getByRole('columnheader', { name: /Málsnúmer/ })
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

  it('exposes a descriptive accessible name on the row', () => {
    renderTable()

    expect(
      screen.getByRole('button', { name: 'Opna mál R-123/2021' }),
    ).toBeInTheDocument()
  })

  it('activates the row with the keyboard', async () => {
    const onClick = jest.fn()
    renderTable(onClick)

    const row = screen.getByRole('button', { name: 'Opna mál R-123/2021' })
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

    const row = screen.getByRole('button', { name: 'Opna mál R-123/2021' })
    expect(row).toHaveAttribute('tabindex', '-1')
    expect(row).toHaveAttribute('aria-disabled', 'true')

    row.focus()
    await user.keyboard('{Enter}')
    expect(onClick).not.toHaveBeenCalled()
  })
})
