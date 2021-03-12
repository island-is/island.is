import 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'

// Avoid conflict with app.json
// @ts-ignore
import App from './App.tsx'

it('renders correctly', () => {
  const { getByTestId } = render(<App />)
  expect(getByTestId('heading')).toHaveTextContent('Welcome')
})
