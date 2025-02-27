import { render } from '@testing-library/react'

import PortalsMyPagesEducationV2 from './portals-my-pages-education-v2'

describe('PortalsMyPagesEducationV2', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PortalsMyPagesEducationV2 />)
    expect(baseElement).toBeTruthy()
  })
})
