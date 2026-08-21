import { render, screen } from '@testing-library/react'

import { RadioButton } from '@island.is/island-ui/core'

import RadioGroup from './RadioGroup'

describe('RadioGroup', () => {
  test('exposes the radios as a group named by the legend', () => {
    render(
      <RadioGroup legend="Lyktir máls">
        <RadioButton name="g" id="a" label="A" />
        <RadioButton name="g" id="b" label="B" />
      </RadioGroup>,
    )

    // <fieldset> has the implicit "group" role and is named by its <legend>.
    const group = screen.getByRole('group', { name: 'Lyktir máls' })
    expect(group.tagName).toBe('FIELDSET')

    // The radios are reachable as a group.
    expect(screen.getByRole('radio', { name: 'A' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'B' })).toBeInTheDocument()
  })

  test('keeps a real legend as the accessible name when visually hidden', () => {
    render(
      <RadioGroup legend="Aðgangur" hideLegend>
        <RadioButton name="g" id="a" label="A" />
      </RadioGroup>,
    )

    // The group is still named for assistive technology via a real <legend>
    // element (the hidden variant only changes the visual presentation).
    expect(screen.getByRole('group', { name: 'Aðgangur' })).toBeInTheDocument()
    expect(screen.getByText('Aðgangur').tagName).toBe('LEGEND')
  })
})
