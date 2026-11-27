import { FormSystemField } from '@island.is/api/schema'
import '@vanilla-extract/css/disableRuntimeStyles'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { m } from '../../../lib/messages'
import { Checkbox } from './Checkbox'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is' }),
}))

it.each([
  [false, false],
  [false, true],
  [true, false],
  [true, true],
])(
  'only toggles from the square or keyboard (large: %s, checked: %s)',
  async (isLarge, checked) => {
    const user = userEvent.setup()
    const dispatch = jest.fn()
    const onSubmit = jest.fn((event: React.FormEvent) => event.preventDefault())
    const item: FormSystemField = {
      id: 'checkbox',
      fieldType: 'CHECKBOX',
      name: { is: 'Accept conditions' },
      isPartOfMultiset: false,
      isRequired: true,
      screenId: 'screen',
      fieldSettings: {
        isLarge,
        subLabel: { is: 'Additional conditions' },
      },
      tooltip: { is: 'Checkbox help' },
      values: [{ json: { checkboxValue: checked } }],
    }
    const Form = () => {
      const methods = useForm()
      return (
        <IntlProvider locale="is" defaultLocale="is">
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <Checkbox item={item} dispatch={dispatch} />
            </form>
          </FormProvider>
        </IntlProvider>
      )
    }
    render(<Form />)
    const checkbox = screen.getByRole('checkbox')
    const help = screen.getByRole('button')

    await user.click(help)
    await screen.findByRole('tooltip')
    expect(checkbox).toHaveProperty('checked', checked)
    expect(dispatch).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.keyboard('{Enter} ')
    expect(checkbox).toHaveProperty('checked', checked)
    expect(dispatch).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.unhover(help)
    await user.tab()
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
    expect(checkbox).toHaveProperty('checked', checked)
    expect(dispatch).not.toHaveBeenCalled()

    const caption = screen.getAllByText('Accept conditions')[0]
    await user.click(caption)
    expect(checkbox).toHaveProperty('checked', checked)
    expect(dispatch).not.toHaveBeenCalled()
    if (isLarge) {
      await user.click(screen.getByText('Additional conditions'))
      expect(checkbox).toHaveProperty('checked', checked)
    }
    const container = caption.parentElement?.parentElement
    if (!container) throw new Error('Missing checkbox container')
    await user.click(container)
    expect(checkbox).toHaveProperty('checked', checked)
    expect(dispatch).not.toHaveBeenCalled()

    const square = checkbox.closest('div')?.querySelector('label')
    if (!square) throw new Error('Missing checkbox square')
    fireEvent.click(square)
    await waitFor(() => expect(checkbox).toHaveProperty('checked', !checked))
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_CHECKBOX_VALUE',
      payload: { id: item.id, value: !checked, valueIndex: 0 },
    })

    checkbox.focus()
    await user.keyboard(' ')
    expect(checkbox).toHaveProperty('checked', checked)
    if (!checked) {
      const error = await screen.findByText(m.required.defaultMessage)
      expect(checkbox.getAttribute('aria-invalid')).toBe('true')
      expect(checkbox.getAttribute('aria-describedby')).toBe(error.id)
    }
  },
)
