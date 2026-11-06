import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react'

import { LocaleProvider } from '@island.is/localization'

import InputName from './InputName'

const EMPTY_ERROR = 'Reitur má ekki vera tómur'

const renderInputName = (value: string, onBlur = jest.fn()) => {
  const view = render(
    <MockedProvider>
      <LocaleProvider locale="is" messages={{}}>
        <InputName value={value} onBlur={onBlur} required />
      </LocaleProvider>
    </MockedProvider>,
  )

  return { onBlur, view }
}

describe('InputName', () => {
  test('does not persist a whitespace-only name and shows an error on blur', async () => {
    const { onBlur } = renderInputName('')

    const input = await screen.findByTestId('inputName')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input, { target: { value: '   ' } })

    expect(onBlur).not.toHaveBeenCalled()
    expect(screen.getByText(EMPTY_ERROR)).toBeTruthy()
  })

  test('keeps the error while the value is still whitespace-only', async () => {
    renderInputName('')

    const input = await screen.findByTestId('inputName')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input, { target: { value: '   ' } })

    expect(screen.getByText(EMPTY_ERROR)).toBeTruthy()

    // Erasing one space leaves the field effectively empty - the problem the
    // message describes is not fixed yet.
    fireEvent.change(input, { target: { value: '  ' } })

    expect(screen.getByText(EMPTY_ERROR)).toBeTruthy()
  })

  test('clears the error as soon as real content is typed', async () => {
    renderInputName('')

    const input = await screen.findByTestId('inputName')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input, { target: { value: '   ' } })

    expect(screen.getByText(EMPTY_ERROR)).toBeTruthy()

    fireEvent.change(input, { target: { value: 'Jón' } })

    expect(screen.queryByText(EMPTY_ERROR)).toBeNull()
  })

  test('keeps the error when the parent echoes a whitespace-only value back', async () => {
    const onBlur = jest.fn()
    const { rerender } = render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InputName value="" onBlur={onBlur} required />
        </LocaleProvider>
      </MockedProvider>,
    )

    const input = await screen.findByTestId('inputName')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input, { target: { value: '   ' } })

    expect(screen.getByText(EMPTY_ERROR)).toBeTruthy()

    // The parent stores the raw keystrokes and passes them back down.
    rerender(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InputName value="   " onBlur={onBlur} required />
        </LocaleProvider>
      </MockedProvider>,
    )

    expect(screen.getByText(EMPTY_ERROR)).toBeTruthy()
  })

  test('persists a valid name on blur', async () => {
    const { onBlur } = renderInputName('')

    const input = await screen.findByTestId('inputName')

    fireEvent.change(input, { target: { value: 'Jón Jónsson' } })
    fireEvent.blur(input, { target: { value: 'Jón Jónsson' } })

    expect(onBlur).toHaveBeenCalledWith('Jón Jónsson')
  })
})
