import React from 'react'
import { render, waitFor } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'

import App from './app'

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    expect(baseElement).toBeTruthy()
  })

  it('should have a greeting as the title', async () => {
    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )
    await waitFor(() => getByText('Welcome to api!'))
    expect(getByText('Welcome to api!')).toBeTruthy()
  })
})
