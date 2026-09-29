import { IntlProvider } from 'react-intl'
import faker from 'faker'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { renderHook } from '@testing-library/react'

import { UserProvider } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type {
  Case,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  CaseOrigin,
  CaseState,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'

import useSections from './index'

// Which page the stepper is being built for. Empty matches no route, which is
// what every test below but the verdict appeal ones wants.
let mockPathname = ''

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: mockPathname,
    }
  },
}))

describe('useSections getSections', () => {
  beforeEach(() => {
    mockPathname = ''
  })

  // useSections reads `workingCase` from FormContext (via the target-appeal
  // hook). Each test injects its own `c` here so the resolved target appeal
  // matches what `getSections(c, u)` is called with.
  const makeWrapper =
    (workingCase: Case) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ children }: any) =>
      (
        <IntlProvider locale="is" onError={jest.fn}>
          <ApolloProvider
            client={new ApolloClient({ cache: new InMemoryCache() })}
          >
            <FormContext.Provider
              value={
                {
                  workingCase,
                  setWorkingCase: () => workingCase,
                  isLoadingWorkingCase: false,
                  caseNotFound: false,
                  isCaseUpToDate: true,
                  isCreating: false,
                  refreshCase: () => undefined,
                  getCase: () => undefined,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any
              }
            >
              <UserProvider authenticated={true}>{children}</UserProvider>
            </FormContext.Provider>
          </ApolloProvider>
        </IntlProvider>
      )

  const u: User = {
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    id: faker.datatype.uuid(),
    nationalId: '0000000000',
    name: faker.name.firstName(),
    title: faker.name.jobType(),
    mobileNumber: faker.phone.phoneNumber(),
    role: UserRole.PROSECUTOR,
    email: faker.internet.email(),
    active: true,
    canConfirmIndictment: false,
    institution: {
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      name: faker.company.companyName(),
      active: true,
      type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
    },
  }

  const generateSubsteps = (count: number) => {
    if (count < 1) {
      return []
    }

    return [...Array(count).keys()].map((_, i) => ({
      href: expect.any(String),
      name: expect.any(String),
      isActive: expect.any(Boolean),
      ...(i > 0 && { onClick: undefined }),
    }))
  }

  // A verdict appeal is a separate proceeding, and the route is what says which
  // one the stepper is about: the verdict page sets no appealCaseId, so the
  // target appeal resolver falls back to the case-level ruling appeal.
  describe('on the verdict appeal route', () => {
    const caseWithBothAppeals = {
      origin: CaseOrigin.RVG,
      type: CaseType.INDICTMENT,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: 'case-with-both-appeals',
      state: CaseState.COMPLETED,
      policeCaseNumbers: [],
      appealCase: {
        id: 'ruling-appeal',
        appealState: AppealCaseState.RECEIVED,
      },
      verdictAppealCase: { id: 'verdict-appeal' },
    } as unknown as Case

    const coaUser = {
      ...u,
      role: UserRole.COURT_OF_APPEALS_JUDGE,
      institution: { type: InstitutionType.COURT_OF_APPEALS },
    } as unknown as User

    const appealSections = (c: Case, user: User) => {
      const { result } = renderHook(() => useSections(), {
        wrapper: makeWrapper(c),
      })

      return result.current
        .getSections(c, user)
        .filter((s) => s.name === 'Dómur Landsréttar' || s.name === 'Kærumál')
    }

    // The ruling appeal section sits earlier in the list and is active while
    // the appeal is received, so leaving it in means the side panel highlights
    // it and the verdict step the reader is on stays unmarked.
    it('shows the verdict appeal rather than the ruling appeal', () => {
      mockPathname = COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE

      const sections = appealSections(caseWithBothAppeals, coaUser)

      expect(sections.map((s) => s.name)).toEqual(['Dómur Landsréttar'])
      expect(sections[0].isActive).toBe(true)
    })

    it('leaves the ruling appeal sections alone on every other route', () => {
      const sections = appealSections(caseWithBothAppeals, coaUser)

      expect(sections.map((s) => s.name)).toEqual(['Kærumál'])
    })
  })

  it('should return the correct sections for restriction cases in DRAFT state', () => {
    const c: Case = {
      origin: CaseOrigin.RVG,
      type: CaseType.CUSTODY,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      state: CaseState.DRAFT,
      policeCaseNumbers: [],
    }
    const { result } = renderHook(() => useSections(), {
      wrapper: makeWrapper(c),
    })

    const res = result.current.getSections(c, u)

    expect(res).toStrictEqual([
      {
        children: generateSubsteps(6),
        isActive: true,
        name: expect.any(String),
      },
      {
        children: [],
        isActive: false,
        name: expect.any(String),
      },
      { children: [], isActive: false, name: expect.any(String) },
    ])
  })

  it('should return the correct sections for appealed restriction cases when the court of appeals has made a ruling', () => {
    const c: Case = {
      origin: CaseOrigin.RVG,
      type: CaseType.CUSTODY,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      state: CaseState.ACCEPTED,
      policeCaseNumbers: [],
      appealCase: {
        id: 'test_appeal_case_id',
        appealState: AppealCaseState.COMPLETED,
        appealRulingDecision: AppealCaseRulingDecision.REMAND,
      },
    }
    const { result } = renderHook(() => useSections(), {
      wrapper: makeWrapper(c),
    })

    expect(result.current.getSections(c, u)).toStrictEqual([
      {
        children: generateSubsteps(6),
        isActive: false,
        name: expect.any(String),
      },
      { children: [], isActive: false, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
      { children: [], isActive: true, name: 'Heimvísun' },
    ])
  })

  it('should return the correct sections for indictment cases in RECEIVED state', () => {
    const c: Case = {
      type: CaseType.INDICTMENT,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      state: CaseState.RECEIVED,
      policeCaseNumbers: [],
    }
    const { result } = renderHook(() => useSections(), {
      wrapper: makeWrapper(c),
    })

    expect(result.current.getSections(c, u)).toStrictEqual([
      { children: [], isActive: false, name: expect.any(String) },
      { children: [], isActive: true, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
    ])
  })

  it('should return the correct sections for indictment cases in WAITING_FOR_CANCELLATION state', () => {
    const c: Case = {
      type: CaseType.INDICTMENT,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      state: CaseState.WAITING_FOR_CANCELLATION,
      policeCaseNumbers: [],
    }
    const { result } = renderHook(() => useSections(), {
      wrapper: makeWrapper(c),
    })

    expect(result.current.getSections(c, u)).toStrictEqual([
      { children: [], isActive: true, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
    ])
  })

  it('should return the correct sections for indictment cases in WAITING_FOR_REVIEW state', () => {
    const c: Case = {
      type: CaseType.INDICTMENT,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      state: CaseState.WAITING_FOR_REVIEW,
      policeCaseNumbers: [],
    }
    const { result } = renderHook(() => useSections(), {
      wrapper: makeWrapper(c),
    })

    expect(result.current.getSections(c, u)).toStrictEqual([
      { children: [], isActive: true, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
    ])
  })

  it('should not append extension sections for indictment cases copied to draft (with a parentCase)', () => {
    const c: Case = {
      type: CaseType.INDICTMENT,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      state: CaseState.DRAFT,
      policeCaseNumbers: [],
      parentCase: {
        type: CaseType.INDICTMENT,
        created: faker.date.past().toISOString(),
        modified: faker.date.past().toISOString(),
        id: faker.datatype.uuid(),
        state: CaseState.COMPLETED,
        policeCaseNumbers: [],
      },
    }
    const { result } = renderHook(() => useSections(), {
      wrapper: makeWrapper(c),
    })

    const sections = result.current.getSections(c, u)

    // A duplicated indictment draft links to its original via `parentCase`,
    // but must still render only the three normal indictment sections — no
    // restriction/investigation extension steps ("Krafa um framlengingu" etc.).
    expect(sections).toHaveLength(3)
    expect(sections.map((section) => section.name)).not.toContain(
      'Krafa um framlengingu',
    )
  })
})
