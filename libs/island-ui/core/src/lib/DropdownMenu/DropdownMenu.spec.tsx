import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import DropdownMenu from './DropdownMenu'

describe('DropdownMenu', () => {
  it('Dropdown should open and contain a button and a link', () => {
    const { queryByRole, queryByText } = render(
      <DropdownMenu
        title="Innskráning"
        icon="person"
        menuLabel="innskráning"
        items={[{ title: 'Einstaklingur' }, { title: 'Fyrirtæki', href: '#' }]}
      />,
    )
    const menuButton = queryByText('Innskráning')
    expect(menuButton).toBeTruthy()
    if (menuButton) {
      fireEvent.click(menuButton)
    }
    const menu = queryByRole('menu')
    expect(menu).toBeTruthy()
    const menuItemButton = queryByText('Einstaklingur')
    const menuItemLink = queryByText('Fyrirtæki')
    expect(menuItemButton?.tagName).toBe('BUTTON')
    expect(menuItemLink?.tagName).toBe('A')
  })
})
