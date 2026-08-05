import { fireEvent, render, screen } from '@testing-library/react'

import HideableText from './HideableText'

describe('HideableText', () => {
  test('should give the visibility toggle a descriptive accessible name when visible', () => {
    render(
      <HideableText text="Leyniupplýsingar" onToggleVisibility={jest.fn()} />,
    )

    expect(
      screen.getByRole('button', { name: 'Fela texta' }),
    ).toBeInTheDocument()
  })

  test('should give the visibility toggle a descriptive accessible name when hidden', () => {
    render(
      <HideableText
        text="Leyniupplýsingar"
        isHidden
        onToggleVisibility={jest.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Sýna texta' }),
    ).toBeInTheDocument()
  })

  test('should toggle visibility when the button is activated', () => {
    const onToggleVisibility = jest.fn()
    render(
      <HideableText
        text="Leyniupplýsingar"
        onToggleVisibility={onToggleVisibility}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Fela texta' }))

    expect(onToggleVisibility).toHaveBeenCalledWith(true)
  })
})
