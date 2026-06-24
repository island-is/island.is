import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StatusColor } from '@island.is/island-ui/core'

import CaseFile from './CaseFile'

const color = {
  background: 'blue100',
  border: 'blue200',
  text: 'blue400',
} as StatusColor

describe('<CaseFile />', () => {
  test('should expose a keyboard accessible button when clickable', async () => {
    const onClick = jest.fn()

    render(
      <CaseFile name="document.pdf" color={color} id="file-1" onClick={onClick} />,
    )

    const button = screen.getByRole('button', { name: 'Opna document.pdf' })
    expect(button).toHaveAttribute('tabindex', '0')
  })

  test('should call onClick when activated with Enter or Space', async () => {
    const onClick = jest.fn()

    render(
      <CaseFile name="document.pdf" color={color} id="file-1" onClick={onClick} />,
    )

    const button = screen.getByRole('button', { name: 'Opna document.pdf' })
    button.focus()

    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')

    expect(onClick).toHaveBeenCalledTimes(2)
    expect(onClick).toHaveBeenCalledWith('file-1')
  })

  test('should not be a button when not clickable', () => {
    render(<CaseFile name="document.pdf" color={color} id="file-1" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
