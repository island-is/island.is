import { render } from '@testing-library/react'

import ApplicationTemplatesRentalAgreement from './application-templates-rental-agreement'

describe('ApplicationTemplatesRentalAgreement', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApplicationTemplatesRentalAgreement />)
    expect(baseElement).toBeTruthy()
  })
})
