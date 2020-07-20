import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalDocuments from './service-portal-documents'

describe(' ServicePortalDocuments', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalDocuments />)
    expect(baseElement).toBeTruthy()
  })
})
