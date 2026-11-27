import { FormSystemField } from '@island.is/api/schema'
import '@vanilla-extract/css/disableRuntimeStyles'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { Radio } from './Radio'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (message: { defaultMessage: string }) =>
      message.defaultMessage,
  }),
}))

it.each([false, true])(
  'only selects from the circle or keyboard (other option selected: %s)',
  async (otherSelected) => {
    const user = userEvent.setup()
    const dispatch = jest.fn()
    const onSubmit = jest.fn((event: React.FormEvent) => event.preventDefault())
    const item: FormSystemField = {
      id: 'radio',
      fieldType: 'RADIO_BUTTONS',
      name: { is: 'Choose an option' },
      isPartOfMultiset: false,
      isRequired: false,
      screenId: 'screen',
      list: [
        {
          id: 'first',
          label: { is: 'First option' },
          value: 'first',
          description: { is: 'First option help' },
        },
        {
          id: 'second',
          label: { is: 'Second option' },
          value: 'second',
          description: { is: 'Second option help' },
        },
      ],
      values: otherSelected
        ? [{ json: { label: { is: 'Second option' }, value: 'second' } }]
        : [],
    }
    const Form = () => {
      const methods = useForm()
      return (
        <IntlProvider locale="is" defaultLocale="is">
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <Radio item={item} dispatch={dispatch} />
            </form>
          </FormProvider>
        </IntlProvider>
      )
    }
    render(<Form />)
    const [first, second] = screen.getAllByRole('radio')
    const [icon] = await screen.findAllByTestId('icon-informationCircle')

    await user.click(icon)
    await screen.findByRole('tooltip')
    expect(first).toHaveProperty('checked', false)
    expect(second).toHaveProperty('checked', otherSelected)
    expect(dispatch).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.keyboard('{Enter} ')
    expect(first).toHaveProperty('checked', false)
    expect(second).toHaveProperty('checked', otherSelected)
    expect(dispatch).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.unhover(icon)
    await user.tab()
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())

    const captions = screen.getAllByText('First option')
    const caption = captions[captions.length - 1]
    await user.click(caption)
    expect(first).toHaveProperty('checked', false)
    expect(second).toHaveProperty('checked', otherSelected)
    expect(dispatch).not.toHaveBeenCalled()

    const container = caption.parentElement?.parentElement
    if (!container) throw new Error('Missing radio container')
    await user.click(container)
    expect(first).toHaveProperty('checked', false)
    expect(second).toHaveProperty('checked', otherSelected)
    expect(dispatch).not.toHaveBeenCalled()

    const circle = first.closest('div')?.querySelector('label')
    if (!circle) throw new Error('Missing radio circle')
    await user.click(circle)
    expect(first).toHaveProperty('checked', true)
    expect(second).toHaveProperty('checked', false)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LIST_VALUE',
      payload: {
        id: item.id,
        value: { label: { is: 'First option' }, value: 'first' },
        valueIndex: 0,
      },
    })

    second.focus()
    await user.keyboard(' ')
    expect(first).toHaveProperty('checked', false)
    expect(second).toHaveProperty('checked', true)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LIST_VALUE',
      payload: {
        id: item.id,
        value: { label: { is: 'Second option' }, value: 'second' },
        valueIndex: 0,
      },
    })
  },
)
