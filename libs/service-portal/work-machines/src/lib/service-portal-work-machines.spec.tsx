import { render } from '@testing-library/react'

import ServicePortalWorkMachines from './service-portal-work-machines'

describe('ServicePortalWorkMachines', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalWorkMachines />)
    expect(baseElement).toBeTruthy()
  })
})
