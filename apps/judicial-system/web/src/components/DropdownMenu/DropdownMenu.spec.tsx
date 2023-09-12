import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import DropdownMenu from './DropdownMenu'

describe('DropdownMenu', () => {
  it('Dropdown should open and contain a button and a link', () => {
    render(
      <DropdownMenu
        title="Innskráning"
        icon="person"
        menuLabel="innskráning"
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
