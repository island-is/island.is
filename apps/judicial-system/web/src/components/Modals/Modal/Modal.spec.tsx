import { fireEvent, render, screen } from '@testing-library/react'

import { Modal } from './Modal'

describe('Modal', () => {
  it('labels the dialog with its title via aria-labelledby', () => {
    render(<Modal title="Ertu viss?" />)

    expect(
      screen.getByRole('dialog', { name: 'Ertu viss?' }),
    ).toBeInTheDocument()
  })

  it('renders a labelled icon-only close button that closes the modal', () => {
    const onClose = jest.fn()
    render(<Modal title="Titill" onClose={onClose} />)

    const closeButton = screen.getByRole('button', { name: 'Loka glugga' })
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes the modal when Escape is pressed', () => {
    const onClose = jest.fn()
    render(<Modal title="Titill" onClose={onClose} />)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close on Escape while loading', () => {
    const onClose = jest.fn()
    render(<Modal title="Titill" onClose={onClose} loading />)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('exposes the error message in an assertive live region', () => {
    render(<Modal title="Titill" errorMessage="Eitthvað fór úrskeiðis" />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Eitthvað fór úrskeiðis')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
  })
})
