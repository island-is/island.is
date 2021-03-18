import 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'

// Avoid conflict with app.json
// @ts-ignore
import { Home } from './Home.tsx'

it('renders correctly', () => {
  const { getByTestId } = render(<Home />)
  expect(getByTestId('heading')).toHaveTextContent('Welcome')
})
