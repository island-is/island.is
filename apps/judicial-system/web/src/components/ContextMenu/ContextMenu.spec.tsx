import { fireEvent, render, screen } from '@testing-library/react'

import ContextMenu from './ContextMenu'

describe('ContextMenu', () => {
  it('Context menu should open and contain a button and a link', () => {
    render(
      <ContextMenu
        title="Innskráning"
        items={[{ title: 'Einstaklingur' }, { title: 'Fyrirtæki', href: '#' }]}
      />,
    )
    const menuButton = screen.queryByText('Innskráning')
    expect(menuButton).toBeTruthy()
    if (menuButton) {
      fireEvent.click(menuButton)
    }
    const menu = screen.queryByRole('menu')
    expect(menu).toBeTruthy()
    const menuItemButton = screen.queryByText('Einstaklingur')
    const menuItemLink = screen.queryByText('Fyrirtæki')
    expect(menuItemButton?.tagName).toBe('BUTTON')
    expect(menuItemLink?.tagName).toBe('A')
  })
})
