import { ComponentProps } from 'react'
import router from 'next/router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import FormFooter from './FormFooter'

jest.mock('next/router', () => ({
  push: jest.fn(),
}))

const renderFooter = (props: ComponentProps<typeof FormFooter>) =>
  render(
    <IntlProviderWrapper>
      <FormFooter {...props} />
    </IntlProviderWrapper>,
  )

describe('FormFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render actions in array order after the back button', () => {
    renderFooter({
      previousUrl: '/prev',
      actions: [{ text: 'Aðgerð' }, { text: 'Halda áfram' }],
    })

    const buttons = screen.getAllByRole('button')

    expect(buttons.map((button) => button.textContent)).toEqual([
      'Til baka',
      'Aðgerð',
      'Halda áfram',
    ])
  })

  it('should pass testId through to the button', () => {
    renderFooter({
      actions: [{ text: 'Halda áfram', testId: 'continueButton' }],
    })

    expect(screen.getByTestId('continueButton')).toBeInTheDocument()
  })

  it('should navigate to the action url when no onClick is given', async () => {
    renderFooter({ actions: [{ text: 'Halda áfram', url: '/next' }] })

    await userEvent.click(screen.getByRole('button', { name: 'Halda áfram' }))

    expect(router.push).toHaveBeenCalledWith('/next')
  })

  it('should prefer onClick over url', async () => {
    const onClick = jest.fn()

    renderFooter({ actions: [{ text: 'Vista', onClick, url: '/next' }] })

    await userEvent.click(screen.getByRole('button', { name: 'Vista' }))

    expect(onClick).toHaveBeenCalled()
    expect(router.push).not.toHaveBeenCalled()
  })

  it('should disable the button when disabled or loading', () => {
    renderFooter({
      actions: [
        { text: 'A', disabled: true, testId: 'disabledButton' },
        { text: 'B', loading: true, testId: 'loadingButton' },
      ],
    })

    expect(screen.getByTestId('disabledButton')).toBeDisabled()
    expect(screen.getByTestId('loadingButton')).toBeDisabled()
  })

  it('should navigate to previousUrl when the back button is clicked', async () => {
    renderFooter({ previousUrl: '/prev' })

    await userEvent.click(screen.getByTestId('previousButton'))

    expect(router.push).toHaveBeenCalledWith('/prev')
  })

  it('should hide the back button when hidePreviousButton is set', () => {
    renderFooter({ previousUrl: '/prev', hidePreviousButton: true })

    expect(screen.queryByTestId('previousButton')).not.toBeInTheDocument()
  })

  it('should render the info box without actions', () => {
    renderFooter({ infoBoxText: 'Upplýsingar' })

    expect(screen.getByTestId('infobox')).toHaveTextContent('Upplýsingar')
  })

  it('should not render an empty info box', () => {
    renderFooter({ infoBoxText: '' })

    expect(screen.queryByTestId('infobox')).not.toBeInTheDocument()
  })
})
