import { render, screen, waitFor } from '@testing-library/react'

import {
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import RestrictionLength from './RestrictionLength'

describe('RestrictionLength', () => {
  it('should render isolation fields in custody cases if decision is accepting', async () => {
    render(
      <IntlProviderWrapper>
        <RestrictionLength
          workingCase={{
            ...mockCase(CaseType.CUSTODY),
            decision: CaseDecision.ACCEPTING,
          }}
          handleIsolationChange={jest.fn()}
          handleIsolationDateChange={jest.fn()}
          handleValidToDateChange={jest.fn()}
        />
      </IntlProviderWrapper>,
    )

    expect(await screen.findByTestId('isolation-fields')).toBeInTheDocument()
  })

  it('should not render isolation fields in custody cases if decision is not accepting', async () => {
    render(
      <IntlProviderWrapper>
        <RestrictionLength
          workingCase={{
            ...mockCase(CaseType.CUSTODY),
            decision: CaseDecision.REJECTING,
          }}
          handleIsolationChange={jest.fn()}
          handleIsolationDateChange={jest.fn()}
          handleValidToDateChange={jest.fn()}
        />
      </IntlProviderWrapper>,
    )

    await waitFor(() => {
      expect(screen.queryByTestId('isolation-fields')).toBeNull()
    })
  })

  it('should render isolation fields in admission to facility cases if decision is accepting', async () => {
    render(
      <IntlProviderWrapper>
        <RestrictionLength
          workingCase={{
            ...mockCase(CaseType.ADMISSION_TO_FACILITY),
            decision: CaseDecision.ACCEPTING,
          }}
          handleIsolationChange={jest.fn()}
          handleIsolationDateChange={jest.fn()}
          handleValidToDateChange={jest.fn()}
        />
      </IntlProviderWrapper>,
    )

    expect(await screen.findByTestId('isolation-fields')).toBeInTheDocument()
  })

  it('should not render isolation fields in admission to facility cases if decision is not accepting', async () => {
    render(
      <IntlProviderWrapper>
        <RestrictionLength
          workingCase={{
            ...mockCase(CaseType.ADMISSION_TO_FACILITY),
            decision: CaseDecision.REJECTING,
          }}
          handleIsolationChange={jest.fn()}
          handleIsolationDateChange={jest.fn()}
          handleValidToDateChange={jest.fn()}
        />
      </IntlProviderWrapper>,
    )

    await waitFor(() => {
      expect(screen.queryByTestId('isolation-fields')).toBeNull()
    })
  })

  it('should not render isolation fields in cases other then custody or admission to facility', async () => {
    render(
      <IntlProviderWrapper>
        <RestrictionLength
          workingCase={{
            ...mockCase(CaseType.BANKING_SECRECY_WAIVER),
            decision: CaseDecision.ACCEPTING,
          }}
          handleIsolationChange={jest.fn()}
          handleIsolationDateChange={jest.fn()}
          handleValidToDateChange={jest.fn()}
        />
      </IntlProviderWrapper>,
    )

    await waitFor(() => {
      expect(screen.queryByTestId('isolation-fields')).toBeNull()
    })
  })
})
