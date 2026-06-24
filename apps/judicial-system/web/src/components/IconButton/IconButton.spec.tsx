import { fireEvent, render, screen } from '@testing-library/react'

import IconButton from './IconButton'

describe('IconButton', () => {
  it('exposes the provided ariaLabel as the accessible name', () => {
    render(
      <IconButton
        icon="trash"
        colorScheme="red"
        ariaLabel="Eyða skjali"
        onClick={jest.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Eyða skjali' }),
    ).toBeInTheDocument()
  })

  it('calls onClick when activated', () => {
    const onClick = jest.fn()

    render(
      <IconButton
        icon="pencil"
        colorScheme="blue"
        ariaLabel="Breyta"
        onClick={onClick}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Breyta' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('still exposes the accessible name when wrapped in a tooltip', () => {
    render(
      <IconButton
        icon="ellipsisVertical"
        colorScheme="transparent"
        ariaLabel="Valmynd fyrir skjal"
        tooltipText="Aðgerðir"
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Valmynd fyrir skjal' }),
    ).toBeInTheDocument()
  })
})
