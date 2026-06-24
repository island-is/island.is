import { render, screen } from '@testing-library/react'

import { ReactSelectOption } from '../../types'
import BaseSelect from './BaseSelect'

const options: ReactSelectOption[] = [
  { label: 'Ákærandi', value: 'PROSECUTOR' },
  { label: 'Verjandi', value: 'DEFENDER' },
]

describe('<BaseSelect />', () => {
  test('should fall back to the placeholder as the accessible name', () => {
    render(
      <BaseSelect
        options={options}
        isLoading={false}
        placeholder="Hver lagði fram?"
      />,
    )

    expect(screen.getByRole('combobox')).toHaveAccessibleName(
      'Hver lagði fram?',
    )
  })

  test('should prefer an explicit aria-label over the placeholder', () => {
    render(
      <BaseSelect
        options={options}
        isLoading={false}
        placeholder="Hver lagði fram?"
        ariaLabel="Veldu málsaðila"
      />,
    )

    expect(screen.getByRole('combobox')).toHaveAccessibleName(
      'Veldu málsaðila',
    )
  })
})
