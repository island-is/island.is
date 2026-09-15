import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { AsyncSearch } from './AsyncSearch'

const items = [
  { label: 'Apple', value: 'apple' },
  { label: 'Ape', value: 'ape' },
  { label: 'Apron', value: 'apron' },
  { label: 'Pear', value: 'pear' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
  { label: 'Banana', value: 'banana' },
  { label: 'Fæðingarorlof', value: 'faedingarorlof' },
  { label: 'Atvinna', value: 'atvinna' },
  { label: 'Vottorð', value: 'vottord' },
]

describe('AsyncSearch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AsyncSearch options={[{ label: 'label', value: 'value' }]} />,
    )
    expect(baseElement).toBeTruthy()
  })

  it('should show results', () => {
    const { baseElement, getByText } = render(
      <AsyncSearch filter options={items} />,
    )

    const inputEl = baseElement.querySelector('input')
    expect(inputEl).not.toBeNull()

    if (inputEl !== null) {
      fireEvent.change(inputEl, { target: { value: 'ap' } })
      expect(inputEl.value).toBe('ap')
      expect(getByText('Apple')).toBeInTheDocument()
    }
  })

  it('should not render a clear button without onClear', () => {
    const { queryByRole } = render(
      <AsyncSearch filter options={items} inputValue="ap" />,
    )

    expect(queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
  })

  it('should only render the clear button once the input has a value', () => {
    const onClear = jest.fn()
    const { queryByRole, rerender } = render(
      <AsyncSearch filter options={items} inputValue="" onClear={onClear} />,
    )

    expect(queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()

    rerender(
      <AsyncSearch filter options={items} inputValue="ap" onClear={onClear} />,
    )

    const clearButton = queryByRole('button', { name: 'Clear' })
    expect(clearButton).toBeInTheDocument()

    if (clearButton !== null) fireEvent.click(clearButton)
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('should use a custom clear button aria label', () => {
    const { getByRole } = render(
      <AsyncSearch
        filter
        options={items}
        inputValue="ap"
        onClear={jest.fn()}
        clearButtonAriaLabel="Hreinsa"
      />,
    )

    expect(getByRole('button', { name: 'Hreinsa' })).toBeInTheDocument()
  })

  it('should show 4 items', () => {
    const { baseElement } = render(<AsyncSearch filter options={items} />)

    const inputEl = baseElement.querySelector('input')
    expect(inputEl).not.toBeNull()

    if (inputEl !== null) {
      fireEvent.change(inputEl, { target: { value: 'ap' } })
    }

    const listEl = baseElement.querySelector('ul')
    expect(listEl).not.toBeNull()
    if (listEl !== null) expect(Object.keys(listEl.children)).toHaveLength(4)
  })
})
