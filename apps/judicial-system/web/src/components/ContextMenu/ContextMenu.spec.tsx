import { fireEvent, render, screen } from '@testing-library/react'

import ContextMenu from './ContextMenu'

describe('ContextMenu', () => {
  it('Context menu should open and contain a button and a link', async () => {
    render(
      <ContextMenu
        title="Innskráning"
        items={[{ title: 'Einstaklingur' }, { title: 'Fyrirtæki', href: '#' }]}
      />,
    )

    const menuButton = await screen.findByText('Innskráning')
    expect(menuButton).toBeTruthy()
    if (menuButton) {
      fireEvent.click(menuButton)
    }
    const menu = await screen.findByRole('menu')
    expect(menu).toBeTruthy()
    const menuItemButton = await screen.findByText('Einstaklingur')
    const menuItemLink = await screen.findByText('Fyrirtæki')
    expect(menuItemButton?.tagName).toBe('BUTTON')
    expect(menuItemLink?.tagName).toBe('A')
  })
})
