import '@vanilla-extract/css/disableRuntimeStyles'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExternalDataAgreement } from './ExternalDataAgreement'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    formatMessage: () => 'I agree to data collection',
  }),
}))

it('only toggles from the checkbox square or keyboard, not the caption or card', async () => {
  const user = userEvent.setup()
  const onChange = jest.fn()
  const { container } = render(<ExternalDataAgreement onChange={onChange} />)
  const checkbox = screen.getByRole('checkbox', {
    name: 'I agree to data collection',
  })

  await user.click(screen.getByText('I agree to data collection'))
  if (!container.firstElementChild) throw new Error('Missing agreement card')
  await user.click(container.firstElementChild)
  expect(checkbox).toHaveProperty('checked', false)
  expect(onChange).not.toHaveBeenCalled()

  const square = checkbox.closest('div')?.querySelector('label')
  if (!square) throw new Error('Missing checkbox square')
  await user.click(square)
  expect(checkbox).toHaveProperty('checked', true)
  expect(onChange).toHaveBeenLastCalledWith(true)

  await user.click(screen.getByText('I agree to data collection'))
  await user.click(container.firstElementChild)
  expect(checkbox).toHaveProperty('checked', true)
  expect(onChange).toHaveBeenCalledTimes(1)

  checkbox.focus()
  await user.keyboard(' ')
  expect(checkbox).toHaveProperty('checked', false)
  expect(onChange).toHaveBeenLastCalledWith(false)
})

it('does not allow toggling when disabled', async () => {
  const user = userEvent.setup()
  const onChange = jest.fn()
  render(<ExternalDataAgreement disabled onChange={onChange} />)
  const checkbox = screen.getByRole('checkbox')
  const square = checkbox.closest('div')?.querySelector('label')
  if (!square) throw new Error('Missing checkbox square')

  await user.click(square)
  await user.click(checkbox)
  expect(checkbox).toHaveProperty('checked', false)
  expect(onChange).not.toHaveBeenCalled()
})
