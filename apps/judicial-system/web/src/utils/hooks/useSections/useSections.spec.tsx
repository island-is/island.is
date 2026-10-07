import { IntlProvider } from 'react-intl'
import faker from 'faker'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { renderHook } from '@testing-library/react'

import {
  COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
  PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_APPEAL_ROUTE,
  PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE,
  PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_SEND_TO_PRISON_ADMIN_ROUTE,
} from '@island.is/judicial-system/consts'
import { Feature } from '@island.is/judicial-system/types'
import { UserProvider } from '@island.is/judicial-system-web/src/components'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type {
  Case,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
  CaseOrigin,
  CaseState,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import useSections from './index'

// Two different questions. The appeal in the query string says which
// proceeding the stepper is about; the path says which step of it the reader
// is on. Both default to nothing, which is what every test but the verdict
// ones wants.
let mockAppealCaseId: string | undefined
let mockPathname = ''

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: mockPathname,
      query: { appealCaseId: mockAppealCaseId },
    }
  },
}))

describe('useSections getSections', () => {
  beforeEach(() => {
    mockAppealCaseId = undefined
    mockPathname = ''
  })

  // useSections reads `workingCase` from FormContext (via the target-appeal
  // hook). Each test injects its own `c` here so the resolved target appeal
  // matches what `getSections(c, u)` is called with.
  const makeWrapper =
    (workingCase: Case, features: Feature[] = []) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ children }: any) =>
      (
        <IntlProvider locale="is" onError={jest.fn}>
          <ApolloProvider
            client={new ApolloClient({ cache: new InMemoryCache() })}
          >
            <FeatureContext.Provider value={{ features, isLoading: false }}>
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
            </FeatureContext.Provider>
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

  // A verdict appeal is a separate proceeding with its own steps. Which one
  // the stepper is about comes from the appeal named in the URL, the same way
  // every other Court of Appeals screen decides it.
  describe('when the url names the verdict appeal', () => {
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
        appealType: AppealCaseType.RULING,
      },
      verdictAppealCase: {
        id: 'verdict-appeal',
        appealState: AppealCaseState.RECEIVED,
        appealType: AppealCaseType.VERDICT,
      },
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
    // that appeal is received, so leaving it in means the side panel marks it
    // and the verdict step the reader is on stays unmarked.
    it('shows the verdict appeal rather than the ruling appeal', () => {
      mockAppealCaseId = 'verdict-appeal'
      mockPathname = COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE

      const sections = appealSections(caseWithBothAppeals, coaUser)

      expect(sections.map((s) => s.name)).toEqual(['Dómur Landsréttar'])
      expect(sections[0].isActive).toBe(true)
    })

    // The link has to carry the appeal id. Dropped, the next render resolves
    // back to the case-level ruling appeal - and on a case that has none, the
    // whole proceeding disappears from the panel the moment the reader clicks
    // the step they are already on.
    it('keeps the appeal id on its own overview link', () => {
      mockAppealCaseId = 'verdict-appeal'
      mockPathname = COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE

      const sections = appealSections(caseWithBothAppeals, coaUser)

      expect(sections[0].children[0].href).toBe(
        `${COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE}/case-with-both-appeals?appealCaseId=verdict-appeal`,
      )
    })

    it('leaves the ruling appeal sections alone when it names that one', () => {
      mockAppealCaseId = 'ruling-appeal'

      const sections = appealSections(caseWithBothAppeals, coaUser)

      expect(sections.map((s) => s.name)).toEqual(['Kærumál'])
    })
  })

  // The public prosecution office works a verdict appeal from the case
  // overview. The step marks that, and the result step before it renders as
  // complete rather than competing with it for the active marker.
  describe('the verdict appeal step of the public prosecution office', () => {
    const staff = {
      ...u,
      role: UserRole.PUBLIC_PROSECUTOR_STAFF,
      institution: {
        ...u.institution,
        type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      },
    } as User

    const appealedCase = {
      origin: CaseOrigin.RVG,
      type: CaseType.INDICTMENT,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: 'appealed-case',
      state: CaseState.COMPLETED,
      policeCaseNumbers: [],
      verdictAppealCase: {
        id: 'verdict-appeal',
        appealState: AppealCaseState.APPEALED,
        appealType: AppealCaseType.VERDICT,
      },
    } as unknown as Case

    const sectionsFor = (
      c: Case,
      user: User,
      features: Feature[] = [Feature.INDICTMENT_APPEAL],
    ) => {
      const { result } = renderHook(() => useSections(), {
        wrapper: makeWrapper(c, features),
      })

      return result.current.getSections(c, user)
    }

    it('follows the result step and is active on the case overview', () => {
      mockPathname = PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE

      const sections = sectionsFor(appealedCase, staff)

      expect(sections).toHaveLength(4)
      expect(sections[3]).toStrictEqual({
        name: 'Áfrýjun',
        isActive: true,
        children: [],
      })
      expect(sections.filter((s) => s.isActive)).toHaveLength(1)
    })

    it('is active while an appeal is being registered, even before one exists', () => {
      mockPathname = PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_APPEAL_ROUTE

      const sections = sectionsFor(
        { ...appealedCase, verdictAppealCase: null } as unknown as Case,
        staff,
      )

      expect(sections[3]).toStrictEqual({
        name: 'Áfrýjun',
        isActive: true,
        children: [],
      })
      expect(sections[2].isActive).toBe(false)
    })

    it('leaves the result step active on other pages', () => {
      mockPathname =
        PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_SEND_TO_PRISON_ADMIN_ROUTE

      const sections = sectionsFor(appealedCase, staff)

      expect(sections[2].isActive).toBe(true)
      expect(sections[3]).toStrictEqual({
        name: 'Áfrýjun',
        isActive: false,
        children: [],
      })
    })

    it('leaves the sidebar as it is while the feature is hidden', () => {
      mockPathname = PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE

      const sections = sectionsFor(appealedCase, staff, [])

      expect(sections).toHaveLength(3)
      expect(sections.map((s) => s.name)).not.toContain('Áfrýjun')
      expect(sections[2].isActive).toBe(true)
    })

    it('hides the step after withdrawal and leaves the result step active', () => {
      mockPathname = PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE

      const sections = sectionsFor(
        {
          ...appealedCase,
          verdictAppealCase: {
            id: 'verdict-appeal',
            appealState: AppealCaseState.WITHDRAWN,
            appealType: AppealCaseType.VERDICT,
          },
        } as unknown as Case,
        staff,
      )

      expect(sections).toHaveLength(3)
      expect(sections.map((s) => s.name)).not.toContain('Áfrýjun')
      expect(sections[2].isActive).toBe(true)
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
