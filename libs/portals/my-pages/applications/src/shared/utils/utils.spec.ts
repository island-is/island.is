import {
  Application,
  ApplicationCard,
  ApplicationStatus,
  ApplicationTypes,
  InstitutionTypes,
} from '@island.is/application/types'
import {
  sortApplicationsStatus,
  getFilteredApplicationsByStatus,
} from './index'
import { FilterValues } from '../types'

type AppWithPruned = Application & Partial<Pick<ApplicationCard, 'pruned'>>

type MockAppWithInstitution = AppWithPruned &
  ApplicationCard & {
    formSystemOrgSlug?: InstitutionTypes
    formSystemFormSlug?: string
    formSystemOrgContentfulId?: string
  }

const createMockApp = (
  overrides: Partial<AppWithPruned> & { id: string },
): AppWithPruned => ({
  state: 'draft',
  applicant: '0101302989',
  assignees: [],
  applicantActors: [],
  typeId: ApplicationTypes.EXAMPLE_NO_INPUTS,
  modified: new Date(),
  created: new Date(),
  answers: {},
  externalData: {},
  status: ApplicationStatus.DRAFT,
  ...overrides,
})

describe('sortApplicationsStatus', () => {
  it('should place a pruned application in the older bucket', () => {
    const app = createMockApp({ id: '1', pruned: true })

    const result = sortApplicationsStatus([app])

    expect(result.older).toHaveLength(1)
    expect(result.older[0].id).toBe('1')
    expect(result.incomplete).toHaveLength(0)
    expect(result.inProgress).toHaveLength(0)
    expect(result.finished).toHaveLength(0)
  })

  it('should place pruned applications in older regardless of status', () => {
    const statuses = [
      ApplicationStatus.DRAFT,
      ApplicationStatus.NOT_STARTED,
      ApplicationStatus.IN_PROGRESS,
      ApplicationStatus.COMPLETED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.APPROVED,
    ]

    const apps = statuses.map((status, i) =>
      createMockApp({ id: String(i), status, pruned: true }),
    )

    const result = sortApplicationsStatus(apps)

    expect(result.older).toHaveLength(statuses.length)
    expect(result.incomplete).toHaveLength(0)
    expect(result.inProgress).toHaveLength(0)
    expect(result.finished).toHaveLength(0)
  })

  it('should NOT place an application with pruned: false in older', () => {
    const app = createMockApp({
      id: '1',
      pruned: false,
      status: ApplicationStatus.DRAFT,
    })

    const result = sortApplicationsStatus([app])

    expect(result.older).toHaveLength(0)
    expect(result.incomplete).toHaveLength(1)
  })

  it('should NOT place an application with pruned: undefined in older', () => {
    const app = createMockApp({
      id: '1',
      pruned: undefined,
      status: ApplicationStatus.IN_PROGRESS,
    })

    const result = sortApplicationsStatus([app])

    expect(result.older).toHaveLength(0)
    expect(result.inProgress).toHaveLength(1)
  })

  it('should sort non-pruned DRAFT and NOT_STARTED into incomplete', () => {
    const draft = createMockApp({
      id: '1',
      status: ApplicationStatus.DRAFT,
    })
    const notStarted = createMockApp({
      id: '2',
      status: ApplicationStatus.NOT_STARTED,
    })

    const result = sortApplicationsStatus([draft, notStarted])

    expect(result.incomplete).toHaveLength(2)
    expect(result.inProgress).toHaveLength(0)
    expect(result.finished).toHaveLength(0)
    expect(result.older).toHaveLength(0)
  })

  it('should sort non-pruned IN_PROGRESS into inProgress', () => {
    const app = createMockApp({
      id: '1',
      status: ApplicationStatus.IN_PROGRESS,
    })

    const result = sortApplicationsStatus([app])

    expect(result.inProgress).toHaveLength(1)
    expect(result.incomplete).toHaveLength(0)
    expect(result.finished).toHaveLength(0)
    expect(result.older).toHaveLength(0)
  })

  it('should sort non-pruned COMPLETED, REJECTED, APPROVED into finished', () => {
    const apps = [
      createMockApp({ id: '1', status: ApplicationStatus.COMPLETED }),
      createMockApp({ id: '2', status: ApplicationStatus.REJECTED }),
      createMockApp({ id: '3', status: ApplicationStatus.APPROVED }),
    ]

    const result = sortApplicationsStatus(apps)

    expect(result.finished).toHaveLength(3)
    expect(result.incomplete).toHaveLength(0)
    expect(result.inProgress).toHaveLength(0)
    expect(result.older).toHaveLength(0)
  })

  it('should correctly split a mix of pruned and non-pruned applications', () => {
    const apps = [
      createMockApp({
        id: 'pruned-draft',
        status: ApplicationStatus.DRAFT,
        pruned: true,
      }),
      createMockApp({
        id: 'normal-draft',
        status: ApplicationStatus.DRAFT,
        pruned: false,
      }),
      createMockApp({
        id: 'pruned-inprogress',
        status: ApplicationStatus.IN_PROGRESS,
        pruned: true,
      }),
      createMockApp({
        id: 'normal-inprogress',
        status: ApplicationStatus.IN_PROGRESS,
      }),
      createMockApp({
        id: 'pruned-completed',
        status: ApplicationStatus.COMPLETED,
        pruned: true,
      }),
      createMockApp({
        id: 'normal-completed',
        status: ApplicationStatus.COMPLETED,
      }),
    ]

    const result = sortApplicationsStatus(apps)

    expect(result.older).toHaveLength(3)
    expect(result.older.map((a) => a.id)).toEqual([
      'pruned-draft',
      'pruned-inprogress',
      'pruned-completed',
    ])
    expect(result.incomplete).toHaveLength(1)
    expect(result.incomplete[0].id).toBe('normal-draft')
    expect(result.inProgress).toHaveLength(1)
    expect(result.inProgress[0].id).toBe('normal-inprogress')
    expect(result.finished).toHaveLength(1)
    expect(result.finished[0].id).toBe('normal-completed')
  })

  it('should return all empty arrays for an empty input', () => {
    const result = sortApplicationsStatus([])

    expect(result.incomplete).toHaveLength(0)
    expect(result.inProgress).toHaveLength(0)
    expect(result.finished).toHaveLength(0)
    expect(result.older).toHaveLength(0)
  })
})

describe('getFilteredApplicationsByStatus', () => {
  const defaultFilter: FilterValues = {
    activeInstitution: { label: 'All', value: '' },
    searchQuery: '',
  }

  const createMockAppWithCard = (
    overrides: Partial<MockAppWithInstitution> & { id: string },
  ): MockAppWithInstitution =>
    createMockApp(overrides) as MockAppWithInstitution

  it('should filter out pruned apps that do not match search query', () => {
    const apps = [
      createMockAppWithCard({
        id: '1',
        pruned: true,
        name: 'Vegabréf',
        actionCard: { description: 'Passport application' },
      }),
      createMockAppWithCard({
        id: '2',
        pruned: true,
        name: 'Ökuskírteini',
        actionCard: { description: 'Driving license' },
      }),
    ]

    const filter: FilterValues = {
      ...defaultFilter,
      searchQuery: 'Vegabréf',
    }

    const result = getFilteredApplicationsByStatus(filter, apps)

    expect(result.older).toHaveLength(1)
    expect(result.older[0].id).toBe('1')
  })

  it('should exclude focused application from all buckets including older', () => {
    const apps = [
      createMockAppWithCard({ id: 'focused', pruned: true, name: 'Test' }),
      createMockAppWithCard({ id: 'other', pruned: true, name: 'Test' }),
    ]

    const result = getFilteredApplicationsByStatus(
      defaultFilter,
      apps,
      'focused',
    )

    expect(result.older).toHaveLength(1)
    expect(result.older[0].id).toBe('other')
  })

  it('should place pruned apps in older even when no filters are active', () => {
    const apps = [
      createMockAppWithCard({
        id: '1',
        pruned: true,
        status: ApplicationStatus.DRAFT,
      }),
      createMockAppWithCard({
        id: '2',
        pruned: false,
        status: ApplicationStatus.DRAFT,
      }),
    ]

    const result = getFilteredApplicationsByStatus(defaultFilter, apps)

    expect(result.older).toHaveLength(1)
    expect(result.older[0].id).toBe('1')
    expect(result.incomplete).toHaveLength(1)
    expect(result.incomplete[0].id).toBe('2')
  })

  it('should return empty buckets for undefined applications', () => {
    const result = getFilteredApplicationsByStatus(defaultFilter)

    expect(result.older).toHaveLength(0)
    expect(result.incomplete).toHaveLength(0)
    expect(result.inProgress).toHaveLength(0)
    expect(result.finished).toHaveLength(0)
  })
})
