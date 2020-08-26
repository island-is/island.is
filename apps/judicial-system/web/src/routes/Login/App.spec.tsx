import React from 'react'
import { render, waitFor } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import { BrowserRouter } from 'react-router-dom'

import App from './Login'

describe('App', () => {
  fetchMock.get('/api/cases', [])

  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    expect(baseElement).toBeTruthy()
  })

  it('should have a count as the title', async () => {
    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )
    await waitFor(() => getByText('0 cases'))
    expect(getByText('0 cases')).toBeTruthy()
  })
})
