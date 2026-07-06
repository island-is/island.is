import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PdfButton from './PdfButton'

describe('<PdfButton />', () => {
  test('should expose a keyboard accessible button when rendered as a row', async () => {
    const handleClick = jest.fn()

    render(
      <PdfButton
        title="document.pdf"
        renderAs="row"
        handleClick={handleClick}
      />,
    )

    const button = screen.getByRole('button', { name: 'document.pdf' })
    expect(button).toHaveAttribute('tabindex', '0')

    button.focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')

    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  test('should not activate or be focusable when disabled', async () => {
    const handleClick = jest.fn()

    render(
      <PdfButton
        title="document.pdf"
        renderAs="row"
        disabled
        handleClick={handleClick}
      />,
    )

    const button = screen.getByRole('button', { name: 'document.pdf' })
    expect(button).toHaveAttribute('tabindex', '-1')
    expect(button).toHaveAttribute('aria-disabled', 'true')

    button.focus()
    await userEvent.keyboard('{Enter}')

    expect(handleClick).not.toHaveBeenCalled()
  })
})
