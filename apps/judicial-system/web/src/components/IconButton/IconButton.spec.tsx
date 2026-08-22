import { fireEvent, render, screen } from '@testing-library/react'

import IconButton from './IconButton'

describe('IconButton', () => {
  it('exposes the provided ariaLabel as the accessible name', async () => {
    render(
      <IconButton
        icon="trash"
        colorScheme="red"
        ariaLabel="Eyða skjali"
        onClick={jest.fn()}
      />,
    )

    expect(
      await screen.findByRole('button', { name: 'Eyða skjali' }),
    ).toBeInTheDocument()
  })

  it('calls onClick when activated', async () => {
    const onClick = jest.fn()

    render(
      <IconButton
        icon="pencil"
        colorScheme="blue"
        ariaLabel="Breyta"
        onClick={onClick}
      />,
    )

    fireEvent.click(await screen.findByRole('button', { name: 'Breyta' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('forwards remaining button props to the underlying button', async () => {
    render(
      <IconButton
        icon="ellipsisVertical"
        colorScheme="transparent"
        ariaLabel="Valmynd"
        aria-expanded={true}
        aria-haspopup="menu"
      />,
    )

    const button = await screen.findByRole('button', { name: 'Valmynd' })

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('still exposes the accessible name when wrapped in a tooltip', async () => {
    render(
      <IconButton
        icon="ellipsisVertical"
        colorScheme="transparent"
        ariaLabel="Valmynd fyrir skjal"
        tooltipText="Aðgerðir"
      />,
    )

    expect(
      await screen.findByRole('button', { name: 'Valmynd fyrir skjal' }),
    ).toBeInTheDocument()
  })
})
