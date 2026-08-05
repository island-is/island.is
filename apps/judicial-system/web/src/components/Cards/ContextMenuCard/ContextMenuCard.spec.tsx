import { ReactElement } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { ContextMenuItem } from '../../ContextMenu/ContextMenu'
import ContextMenuCard from './ContextMenuCard'

jest.mock('../../ContextMenu/ContextMenu', () => {
  const MockContextMenu = ({
    render,
    items,
  }: {
    render: ReactElement
    items: ContextMenuItem[]
  }) => (
    <div data-testid="context-menu" data-items-count={items.length}>
      {render}
    </div>
  )

  return {
    __esModule: true,
    default: MockContextMenu,
  }
})

describe('ContextMenuCard', () => {
  const renderComponent = (contextMenuItems?: ContextMenuItem[]) =>
    render(
      <ContextMenuCard
        title="Card title"
        menuLabel="Valmynd fyrir Card title"
        contextMenuItems={contextMenuItems}
      >
        <div>Card content</div>
      </ContextMenuCard>,
    )

  it('renders title and children', async () => {
    renderComponent()

    expect(await screen.findByText('Card title')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('disables menu button when contextMenuItems are missing', async () => {
    renderComponent()

    expect(
      await screen.findByRole('button', { name: 'Valmynd fyrir Card title' }),
    ).toBeDisabled()
  })

  it('enables menu button when contextMenuItems are provided', async () => {
    renderComponent([{ title: 'Action' }])

    expect(
      await screen.findByRole('button', { name: 'Valmynd fyrir Card title' }),
    ).toBeEnabled()
  })

  it('stops click propagation when menu button is clicked', async () => {
    const parentOnClick = jest.fn()

    render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={parentOnClick}>
        <ContextMenuCard
          title="Card title"
          menuLabel="Valmynd fyrir Card title"
          contextMenuItems={[{ title: 'A' }]}
        >
          <div>Card content</div>
        </ContextMenuCard>
      </div>,
    )

    fireEvent.click(
      await screen.findByRole('button', { name: 'Valmynd fyrir Card title' }),
    )

    expect(parentOnClick).not.toHaveBeenCalled()
  })
})
