import React from 'react'
import { render } from '@testing-library/react'

import appWithTranslation from '../i18n/appWithTranslation'
import Index from '../pages/index'
const WrappedIndex = appWithTranslation(Index)

describe('Index', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WrappedIndex />)
    expect(baseElement).toBeTruthy()
  })
})
