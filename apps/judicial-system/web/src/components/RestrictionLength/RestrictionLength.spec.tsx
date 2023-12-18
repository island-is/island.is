import { render, screen } from '@testing-library/react'

import { CaseDecision } from '@island.is/judicial-system/types'

import { CaseType } from '../../graphql/schema'
import { mockCase } from '../../utils/mocks'
import { IntlProviderWrapper } from '../../utils/testHelpers'
import RestrictionLength from './RestrictionLength'

describe('RestrictionLength', () => {
  it('should render isolation fields in custody cases if decision is accepting', () => {
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

    expect(screen.queryByTestId('isolation-fields')).not.toBeNull()
  })

  it('should not render isolation fields in custody cases if decision is not accepting', () => {
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

    expect(screen.queryByTestId('isolation-fields')).toBeNull()
  })

  it('should render isolation fields in admission to facility cases if decision is accepting', () => {
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

    expect(screen.queryByTestId('isolation-fields')).not.toBeNull()
  })

  it('should not render isolation fields in admission to facility cases if decision is not accepting', () => {
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

    expect(screen.queryByTestId('isolation-fields')).toBeNull()
  })

  it('should not render isolation fields in cases other then custody or admission to facility', () => {
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

    expect(screen.queryByTestId('isolation-fields')).toBeNull()
  })
})
