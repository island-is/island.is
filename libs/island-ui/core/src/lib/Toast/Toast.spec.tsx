import React from 'react'
import { render } from '@testing-library/react'

import { ToastContainer } from './Toast'

describe('Toast', () => {
  it('does not inject React-Toastify styles into the document', () => {
    render(<ToastContainer />)

    const hasRuntimeToastifyStyles = Array.from(
      document.head.querySelectorAll('style'),
    ).some((style) => style.textContent?.includes('.Toastify__toast-container'))

    expect(hasRuntimeToastifyStyles).toBe(false)
  })
})
