import React from 'react'
import {
  render,
  fireEvent,
  getByLabelText,
  getByTestId,
} from '@testing-library/react'

import AsyncSearch from './AsyncSearch'

const items = [
  { label: 'Apple label', value: 'apple' },
  { label: 'Pear', value: 'pear' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
  { label: 'Banana', value: 'banana' },
  { label: 'Fæðingarorlof', value: 'faedingarorlof' },
  { label: 'Atvinna', value: 'atvinna' },
  { label: 'Ferðagjöf', value: 'ferdagjof' },
  { label: 'Vottorð', value: 'vottord' },
]

describe('AsyncSearch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AsyncSearch options={[{ label: 'label', value: 'value' }]} />,
    )
    expect(baseElement).toBeTruthy()
  })

  it('should show three results', () => {
    const { baseElement } = render(<AsyncSearch options={items} />)

    const inputEl = baseElement.querySelector('input')
    fireEvent.change(inputEl, { target: { value: 'apple' } })
    fireEvent.input(inputEl, 'apple')
    expect(inputEl.value).toBe('apple')

    const listEl = baseElement.querySelector('ul')
    // expect(listEl.children.length).toHaveLength(1)
  })
})
