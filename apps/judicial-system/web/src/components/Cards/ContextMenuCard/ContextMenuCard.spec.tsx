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
      <ContextMenuCard title="Card title" contextMenuItems={contextMenuItems}>
        <div>Card content</div>
      </ContextMenuCard>,
    )

  it('renders title and children', () => {
    renderComponent()

    expect(screen.getByText('Card title')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('disables menu button when contextMenuItems are missing', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: 'Valmynd' })).toBeDisabled()
  })

  it('enables menu button when contextMenuItems are provided', () => {
    renderComponent([{ title: 'Action' }])

    expect(screen.getByRole('button', { name: 'Valmynd' })).toBeEnabled()
  })

  it('stops click propagation when menu button is clicked', () => {
    const parentOnClick = jest.fn()

    render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={parentOnClick}>
        <ContextMenuCard title="Card title" contextMenuItems={[{ title: 'A' }]}>
          <div>Card content</div>
        </ContextMenuCard>
      </div>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Valmynd' }))

    expect(parentOnClick).not.toHaveBeenCalled()
  })
})
