import { render } from '@testing-library/react'

import ApplicationTemplatesAdministrationOfOccupationalSafetyAndHealthTransferOfMachineOwnership from './application-templates-administration-of-occupational-safety-and-health-transfer-of-machine-ownership'

describe('ApplicationTemplatesAdministrationOfOccupationalSafetyAndHealthTransferOfMachineOwnership', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ApplicationTemplatesAdministrationOfOccupationalSafetyAndHealthTransferOfMachineOwnership />,
    )
    expect(baseElement).toBeTruthy()
  })
})
