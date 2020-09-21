import React from 'react'
import { act, render } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'

import App from './App'

describe('App', () => {
  it('should render successfully', async () => {
    let baseElement
    await act(async () => {
      const wrapper = await render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      )
      baseElement = wrapper.baseElement
    })

    expect(baseElement).toBeTruthy()
  })
})
