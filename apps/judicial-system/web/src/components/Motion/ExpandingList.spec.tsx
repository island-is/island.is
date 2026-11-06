import { render, screen, waitFor } from '@testing-library/react'

import ExpandingList from './ExpandingList'

const renderList = (items: string[]) => (
  <ExpandingList
    items={items}
    getKey={(item) => item}
    renderItem={(item) => <p>{item}</p>}
  />
)

describe('ExpandingList', () => {
  it('shows its items in order', () => {
    render(renderList(['Anna', 'Björn']))

    expect(screen.getAllByRole('paragraph').map((p) => p.textContent)).toEqual([
      'Anna',
      'Björn',
    ])
  })

  it('shows an added item at once', () => {
    const { rerender } = render(renderList(['Anna']))

    rerender(renderList(['Anna', 'Björn']))

    expect(screen.getByText('Björn')).toBeInTheDocument()
  })

  // What a keyed list gives over a positional one: the row that leaves is the
  // one taken away, not the last one, and the rows around it stay put.
  it('keeps a removed item until its closing animation ends, and only that one', async () => {
    const { rerender } = render(renderList(['Anna', 'Björn', 'Dóra']))

    rerender(renderList(['Anna', 'Dóra']))

    expect(screen.getByText('Björn')).toBeInTheDocument()

    await waitFor(() =>
      expect(screen.queryByText('Björn')).not.toBeInTheDocument(),
    )
    expect(screen.getAllByRole('paragraph').map((p) => p.textContent)).toEqual([
      'Anna',
      'Dóra',
    ])
  })

  it('does not clip items that are on the page from the start', () => {
    render(renderList(['Anna']))

    expect(screen.getByText('Anna').parentElement).toHaveStyle({
      overflow: 'visible',
    })
  })

  // What a select inside a row depends on: once the row is open its menu
  // must not be cut off.
  it('clips an added item while it opens and stops once it is open', async () => {
    const { rerender } = render(renderList(['Anna']))

    rerender(renderList(['Anna', 'Björn']))

    const block = screen.getByText('Björn').parentElement

    expect(block).toHaveStyle({ overflow: 'hidden' })

    await waitFor(() => expect(block).toHaveStyle({ overflow: 'visible' }))
  })
})
