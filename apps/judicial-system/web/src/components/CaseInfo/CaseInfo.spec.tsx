import { render, screen } from '@testing-library/react'

import {
  AppealCaseState,
  CaseState,
  CaseType,
  Defendant,
  Gender,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { mockCase } from '../../utils/mocks'
import {
  IntlProviderWrapper,
  UserContextWrapper,
} from '../../utils/testHelpers'
import { createFormatMessage } from '../../utils/testHelpers.logic'
import { CourtCaseInfo, getDefendantLabel } from './CaseInfo'

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('@island.is/judicial-system-web/src/utils/hooks', () => ({
  useCase: () => ({ updateCase: jest.fn() }),
}))

describe('getDefendantLabel - Indictment', () => {
  const formatMessage = createFormatMessage()
  const fn = (defendants: Defendant[]) =>
    getDefendantLabel(formatMessage, defendants, CaseType.INDICTMENT)

  test('should render label for female', () => {
    const defendants = [{ gender: Gender.FEMALE }] as Defendant[]
    expect(fn(defendants)).toBe('ákærða')
  })

  test('should render label for male', () => {
    const defendants = [{ gender: Gender.MALE }] as Defendant[]
    expect(fn(defendants)).toBe('ákærði')
  })

  test('should render label for other', () => {
    const defendants = [{ gender: Gender.OTHER }] as Defendant[]
    expect(fn(defendants)).toBe('ákærða')
  })

  test('should render label for missing gender', () => {
    const defendants = [{}] as Defendant[]
    expect(fn(defendants)).toBe('ákærða')
  })

  test('should render label for multiple defendants', () => {
    const defendants = [{}, {}] as Defendant[]
    expect(fn(defendants)).toBe('ákærðu')
  })
})

describe('getDefendantLabel - RestrictionCase/InvestigationCase', () => {
  const formatMessage = createFormatMessage()
  const fn = (defendants: Defendant[]) =>
    getDefendantLabel(formatMessage, defendants, CaseType.CUSTODY)

  test('should render label for signle defendant', () => {
    const defendants = [{}] as Defendant[]
    expect(fn(defendants)).toBe('varnaraðili')
  })

  test('should render label for multiple defendants', () => {
    const defendants = [{}, {}] as Defendant[]
    expect(fn(defendants)).toBe('varnaraðilar')
  })
})

describe('CourtCaseInfo - reopen button visibility', () => {
  const completedIndictmentCase = {
    ...mockCase(CaseType.INDICTMENT),
    state: CaseState.COMPLETED,
  }

  const renderComponent = (
    userRole: UserRole,
    workingCase = completedIndictmentCase,
  ) =>
    render(
      <IntlProviderWrapper>
        <UserContextWrapper userRole={userRole}>
          <CourtCaseInfo workingCase={workingCase} />
        </UserContextWrapper>
      </IntlProviderWrapper>,
    )

  it('shows the reopen button to a district court user when there is no appeal', () => {
    renderComponent(UserRole.DISTRICT_COURT_JUDGE)

    expect(
      screen.getByRole('button', { name: 'Enduropna mál' }),
    ).toBeInTheDocument()
  })

  it('hides the reopen button from non-district-court users', () => {
    renderComponent(UserRole.PROSECUTOR)

    expect(
      screen.queryByRole('button', { name: 'Enduropna mál' }),
    ).not.toBeInTheDocument()
  })

  it('hides the reopen button when there is an active appeal', () => {
    const caseWithActiveAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.RECEIVED },
    }

    renderComponent(UserRole.DISTRICT_COURT_JUDGE, caseWithActiveAppeal)

    expect(
      screen.queryByRole('button', { name: 'Enduropna mál' }),
    ).not.toBeInTheDocument()
  })

  it('shows the reopen button when the appeal is completed', () => {
    const caseWithCompletedAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.COMPLETED },
    }

    renderComponent(UserRole.DISTRICT_COURT_JUDGE, caseWithCompletedAppeal)

    expect(
      screen.getByRole('button', { name: 'Enduropna mál' }),
    ).toBeInTheDocument()
  })

  it('shows the reopen button when the appeal is withdrawn', () => {
    const caseWithWithdrawnAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.WITHDRAWN },
    }

    renderComponent(UserRole.DISTRICT_COURT_JUDGE, caseWithWithdrawnAppeal)

    expect(
      screen.getByRole('button', { name: 'Enduropna mál' }),
    ).toBeInTheDocument()
  })
})
