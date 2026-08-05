import { fireEvent, render, screen } from '@testing-library/react'

import { Modal } from './Modal'

describe('Modal', () => {
  it('labels the dialog with its title via aria-labelledby', async () => {
    render(<Modal title="Ertu viss?" />)

    expect(
      await screen.findByRole('dialog', { name: 'Ertu viss?' }),
    ).toBeInTheDocument()
  })

  it('renders a labelled icon-only close button that closes the modal', async () => {
    const onClose = jest.fn()
    render(<Modal title="Titill" onClose={onClose} />)

    const closeButton = await screen.findByRole('button', {
      name: 'Loka glugga',
    })
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes the modal when Escape is pressed', async () => {
    const onClose = jest.fn()
    render(<Modal title="Titill" onClose={onClose} />)

    await screen.findByRole('button', { name: 'Loka glugga' })
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close on Escape while loading', async () => {
    const onClose = jest.fn()
    render(<Modal title="Titill" onClose={onClose} loading />)

    await screen.findByRole('button', { name: 'Loka glugga' })
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('exposes the error message in an assertive live region', async () => {
    render(<Modal title="Titill" errorMessage="Eitthvað fór úrskeiðis" />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Eitthvað fór úrskeiðis')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
  })
})
