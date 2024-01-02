import { render } from '@testing-library/react'

import ApplicationTemplatesAoshChangeMachineSupervisor from './application-templates-aosh-change-machine-supervisor'

describe('ApplicationTemplatesAoshChangeMachineSupervisor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ApplicationTemplatesAoshChangeMachineSupervisor />,
    )
    expect(baseElement).toBeTruthy()
  })
})
