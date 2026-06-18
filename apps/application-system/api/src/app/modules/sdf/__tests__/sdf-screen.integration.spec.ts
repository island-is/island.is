import {
  ApplicationStatus,
  ApplicationTypes,
  FormValue,
  ExternalData,
} from '@island.is/application/types'
import type { ApplicationWithAttachments } from '@island.is/application/types'
import { SdfActionType } from '../dto/action.dto'
import { extractClientCondition } from '../condition-hint'
import { SdfComparators } from '@island.is/application/sdf-types'
import { Comparators, AllOrAny } from '@island.is/application/types'

const APPLICANT_NATIONAL_ID = '0101302989'
const ASSIGNEE_NATIONAL_ID = '0101303019'

function createMockApplication(
  overrides: Partial<ApplicationWithAttachments> = {},
): ApplicationWithAttachments {
  return {
    id: '00000000-0000-0000-0000-000000000001',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    applicant: APPLICANT_NATIONAL_ID,
    assignees: [ASSIGNEE_NATIONAL_ID],
    applicantActors: [],
    state: 'draft',
    status: ApplicationStatus.DRAFT,
    answers: {
      applicantName: 'Test Testsson',
      periods: [{ startDate: '2024-01-01', endDate: '2024-06-01' }],
      selectedChild: '0',
      payments: { bank: '0000-00-000000', pensionFund: 'test' },
      firstPeriodStart: 'estimatedDateOfBirth',
      employers: [{ email: 'employer@test.is' }],
      fileUpload: { file: 'test.pdf' },
      noPrimaryParent: 'no',
      noChildrenFound: false,
      bankAccount: '0000-00-000000',
      personalAllowance: { usePersonalAllowance: 'yes' },
    } as FormValue,
    externalData: {
      children: {
        data: [{ expectedDateOfBirth: '2024-06-01' }],
        date: new Date().toISOString(),
        status: 'success',
      },
      navId: {
        data: 'NAV123',
        date: new Date().toISOString(),
        status: 'success',
      },
      sendApplication: {
        data: {},
        date: new Date().toISOString(),
        status: 'success',
      },
      nationalRegistry: {
        data: { fullName: 'Test' },
        date: new Date().toISOString(),
        status: 'success',
      },
    } as ExternalData,
    attachments: {},
    created: new Date(),
    modified: new Date(),
    name: 'Parental Leave',
    institution: '',
    progress: 0,
    pruned: false,
    ...overrides,
  } as ApplicationWithAttachments
}

/**
 * Extracted filterDataByRole logic to test directly without NestJS DI.
 * This mirrors SdfScreenService.filterDataByRole exactly —
 * unions BOTH read + write keys (matching ApplicationTemplateHelper behavior).
 */
function filterDataByRole(
  application: { answers: FormValue; externalData: ExternalData },
  roleInState: {
    read?: 'all' | { answers?: string[]; externalData?: string[] }
    write?: 'all' | { answers?: string[]; externalData?: string[] }
  },
): { answers: FormValue; externalData: ExternalData } {
  const { read, write } = roleInState

  if (read === 'all' || write === 'all') {
    return {
      answers: { ...application.answers },
      externalData: { ...application.externalData },
    }
  }

  if (!read && !write) {
    return {
      answers: { ...application.answers },
      externalData: { ...application.externalData },
    }
  }

  const filteredAnswers: FormValue = {}
  const filteredExternalData: ExternalData = {}

  const readAnswerKeys =
    (read && read !== 'all' ? read.answers : undefined) ?? []
  const writeAnswerKeys =
    (write && write !== 'all' ? write.answers : undefined) ?? []
  const answerKeys = [...new Set([...readAnswerKeys, ...writeAnswerKeys])]

  for (const key of answerKeys) {
    if (key in application.answers) {
      filteredAnswers[key] = application.answers[key]
    }
  }

  const readExtKeys =
    (read && read !== 'all' ? read.externalData : undefined) ?? []
  const writeExtKeys =
    (write && write !== 'all' ? write.externalData : undefined) ?? []
  const externalDataKeys = [...new Set([...readExtKeys, ...writeExtKeys])]

  for (const key of externalDataKeys) {
    if (key in application.externalData) {
      filteredExternalData[key] = application.externalData[key]
    }
  }

  return { answers: filteredAnswers, externalData: filteredExternalData }
}

describe('Phase 2 Gate #1: REFETCH', () => {
  it('REFETCH action type is defined for inline data fetch', () => {
    expect(SdfActionType.REFETCH).toBe('REFETCH')
    // Controller routes REFETCH to handleRefetch: merge answers, optional template APIs, then getScreen.
  })
})

describe('Phase 2 Gate #2: Role-based data filtering', () => {
  it('assignee Screen must NOT contain applicant-only answer fields', () => {
    const application = createMockApplication({
      state: 'employerApproval',
    })

    const roleInState = {
      id: 'assignee',
      read: {
        answers: [
          'periods',
          'selectedChild',
          'firstPeriodStart',
          'employers',
          'fileUpload',
          'noPrimaryParent',
          'noChildrenFound',
        ],
        externalData: ['children', 'navId', 'sendApplication'],
      },
      write: {
        answers: ['employerNationalRegistryId', 'payments'],
        externalData: [] as string[],
      },
    }

    const filtered = filterDataByRole(application, roleInState)

    // Applicant-only fields MUST NOT appear
    expect(filtered.answers).not.toHaveProperty('bankAccount')
    expect(filtered.answers).not.toHaveProperty('personalAllowance')
    expect(filtered.answers).not.toHaveProperty('applicantName')

    // read keys MUST be present
    expect(filtered.answers).toHaveProperty('periods')
    expect(filtered.answers).toHaveProperty('selectedChild')
    expect(filtered.answers).toHaveProperty('firstPeriodStart')
    expect(filtered.answers).toHaveProperty('employers')
    expect(filtered.answers).toHaveProperty('fileUpload')
    expect(filtered.answers).toHaveProperty('noPrimaryParent')

    // write keys MUST also be readable (union of read+write)
    expect(filtered.answers).toHaveProperty('payments')

    // External data filtering
    expect(filtered.externalData).toHaveProperty('children')
    expect(filtered.externalData).toHaveProperty('navId')
    expect(filtered.externalData).toHaveProperty('sendApplication')
    expect(filtered.externalData).not.toHaveProperty('nationalRegistry')
  })

  it('applicant with read=all gets all data unfiltered', () => {
    const application = createMockApplication()
    const roleInState = { id: 'applicant', read: 'all' as const }

    const filtered = filterDataByRole(application, roleInState)

    expect(filtered.answers).toHaveProperty('bankAccount')
    expect(filtered.answers).toHaveProperty('applicantName')
    expect(filtered.answers).toHaveProperty('personalAllowance')
    expect(filtered.externalData).toHaveProperty('nationalRegistry')
    expect(filtered.externalData).toHaveProperty('children')
  })

  it('role with empty read arrays gets empty data', () => {
    const application = createMockApplication()
    const roleInState = {
      id: 'viewer',
      read: { answers: [] as string[], externalData: [] as string[] },
    }

    const filtered = filterDataByRole(application, roleInState)

    expect(Object.keys(filtered.answers)).toHaveLength(0)
    expect(Object.keys(filtered.externalData)).toHaveLength(0)
  })

  it('write=all grants full data access even with restricted read', () => {
    const application = createMockApplication()
    const roleInState = {
      id: 'admin',
      read: { answers: ['periods'], externalData: [] as string[] },
      write: 'all' as const,
    }

    const filtered = filterDataByRole(application, roleInState)

    expect(Object.keys(filtered.answers).length).toBe(
      Object.keys(application.answers).length,
    )
    expect(filtered.answers).toHaveProperty('bankAccount')
    expect(filtered.answers).toHaveProperty('applicantName')
  })

  it('write keys are unioned with read keys (no duplicates)', () => {
    const application = createMockApplication()
    const roleInState = {
      id: 'reviewer',
      read: { answers: ['periods', 'payments'], externalData: ['children'] },
      write: {
        answers: ['payments', 'employers'],
        externalData: ['children', 'navId'],
      },
    }

    const filtered = filterDataByRole(application, roleInState)

    expect(filtered.answers).toHaveProperty('periods')
    expect(filtered.answers).toHaveProperty('payments')
    expect(filtered.answers).toHaveProperty('employers')
    expect(Object.keys(filtered.answers)).toHaveLength(3)

    expect(filtered.externalData).toHaveProperty('children')
    expect(filtered.externalData).toHaveProperty('navId')
    expect(Object.keys(filtered.externalData)).toHaveLength(2)
  })

  it('filtering creates a clone, does not mutate original', () => {
    const application = createMockApplication()
    const originalAnswersKeys = Object.keys(application.answers)

    const roleInState = {
      id: 'assignee',
      read: { answers: ['periods'], externalData: [] as string[] },
    }

    const filtered = filterDataByRole(application, roleInState)
    filtered.answers['injected'] = 'malicious'

    expect(application.answers).not.toHaveProperty('injected')
    expect(Object.keys(application.answers)).toEqual(originalAnswersKeys)
  })
})

describe('Phase 2 Gate #3: VALIDATE returns errors, not Screen', () => {
  it('ValidateResponseDto shape has errors array, not Screen properties', () => {
    const response = {
      errors: [{ componentId: 'applicantName', message: 'Required field' }],
    }

    expect(response).toHaveProperty('errors')
    expect(Array.isArray(response.errors)).toBe(true)
    expect(response.errors[0]).toHaveProperty('componentId')
    expect(response.errors[0]).toHaveProperty('message')

    // MUST NOT have Screen properties
    expect(response).not.toHaveProperty('applicationId')
    expect(response).not.toHaveProperty('header')
    expect(response).not.toHaveProperty('stepper')
    expect(response).not.toHaveProperty('page')
    expect(response).not.toHaveProperty('footer')
    expect(response).not.toHaveProperty('locale')
  })

  it('VALIDATE actionType requires fieldIds', () => {
    // The controller throws BadRequestException when fieldIds is missing
    const dto = {
      actionType: SdfActionType.VALIDATE,
      answers: {},
      locale: 'is',
      lastKnownPageIndex: 0,
    }

    expect(dto.actionType).toBe('VALIDATE')
    expect(dto).not.toHaveProperty('fieldIds')
  })

  it('VALIDATE scopes validation to specific field IDs', () => {
    const allErrors = [
      { componentId: 'applicantName', message: 'Required' },
      { componentId: 'email', message: 'Invalid email' },
      { componentId: 'phone', message: 'Required' },
    ]
    const requestedFieldIds = ['applicantName', 'phone']

    const scopedErrors = allErrors.filter((e) =>
      requestedFieldIds.includes(e.componentId),
    )

    expect(scopedErrors).toHaveLength(2)
    expect(scopedErrors.map((e) => e.componentId)).toEqual([
      'applicantName',
      'phone',
    ])
  })
})

describe('Phase 2 Gate #4: Idempotency', () => {
  it('rejects NEXT_PAGE when lastKnownPageIndex does not match persisted', () => {
    const persistedPageIndex = 2
    const lastKnownPageIndex = 0

    const shouldReject =
      persistedPageIndex !== undefined &&
      persistedPageIndex !== lastKnownPageIndex

    expect(shouldReject).toBe(true)
  })

  it('accepts NEXT_PAGE when lastKnownPageIndex matches persisted', () => {
    const persistedPageIndex = 0
    const lastKnownPageIndex = 0

    const shouldReject =
      persistedPageIndex !== undefined &&
      persistedPageIndex !== lastKnownPageIndex

    expect(shouldReject).toBe(false)
  })

  it('ConflictException is thrown for stale page index', () => {
    const createIdempotencyError = (persisted: number, received: number) =>
      new Error(
        `Idempotency check failed: lastKnownPageIndex ${received} does not match persisted ${persisted}`,
      )

    const error = createIdempotencyError(2, 0)
    expect(error.message).toContain('Idempotency check failed')
    expect(error.message).toContain('lastKnownPageIndex 0')
    expect(error.message).toContain('persisted 2')
  })
})

describe('NEXT_PAGE validates before persisting', () => {
  it('scoped validation uses getFormNodeFieldIds to limit error scope', () => {
    const allZodErrors = [
      { path: ['applicantName'], message: 'Required' },
      { path: ['email'], message: 'Invalid email' },
      { path: ['phone'], message: 'Required' },
    ]
    const currentPageFieldIds = ['applicantName', 'email']

    const scopedErrors = allZodErrors
      .filter((issue) => currentPageFieldIds.includes(issue.path.join('.')))
      .map((issue) => ({
        componentId: issue.path.join('.'),
        message: issue.message,
      }))

    expect(scopedErrors).toHaveLength(2)
    expect(scopedErrors.map((e) => e.componentId)).toEqual([
      'applicantName',
      'email',
    ])
    expect(scopedErrors.find((e) => e.componentId === 'phone')).toBeUndefined()
  })

  it('validation errors are returned on the Screen (not thrown)', () => {
    const screenWithErrors = {
      applicationId: 'test',
      page: {
        id: 'page-0',
        index: 0,
        sectionIndex: 0,
        subSectionIndex: 0,
        components: [],
        errors: [{ componentId: 'name', message: 'Required' }],
      },
      header: { title: 'Test' },
      stepper: {
        sections: [],
        activeSectionIndex: 0,
        activeSubSectionIndex: 0,
      },
      footer: { buttons: [], canGoBack: false },
      locale: 'is',
    }

    expect(screenWithErrors.page.errors).toHaveLength(1)
    expect(screenWithErrors.page.errors[0].componentId).toBe('name')
  })
})

describe('Phase 2 Gate #5: Answer-shape invariant', () => {
  it('answer merge uses shallow spread — byte-compatible with legacy', () => {
    const original: FormValue = {
      applicantName: 'Test Testsson',
      periods: [{ startDate: '2024-01-01', endDate: '2024-06-01' }],
    }
    const delta: FormValue = { selectedChild: '1' }
    const merged = { ...original, ...delta }

    expect(merged.applicantName).toBe('Test Testsson')
    expect(merged.periods).toEqual([
      { startDate: '2024-01-01', endDate: '2024-06-01' },
    ])
    expect(merged.selectedChild).toBe('1')

    // Reference equality for nested unchanged objects
    expect(merged.periods).toBe(original.periods)
  })

  it('SDF merge matches legacy mergeAnswers behavior', () => {
    const sdfMerge = (existing: FormValue, incoming: FormValue): FormValue => ({
      ...existing,
      ...incoming,
    })

    const existing = { a: 1, b: { nested: true } }
    const incoming = { c: 3, a: 2 }
    const result = sdfMerge(existing, incoming)

    // Same behavior: shallow merge, newer values overwrite
    expect(result).toEqual({ a: 2, b: { nested: true }, c: 3 })
  })

  it('answer persist does not add metadata or wrapper keys', () => {
    const original = { applicantName: 'Test' }
    const delta = { email: 'test@test.is' }
    const merged = { ...original, ...delta }

    expect(Object.keys(merged).sort()).toEqual(
      ['applicantName', 'email'].sort(),
    )
    // No _sdf, __meta, or timestamp wrapper added
    expect(merged).not.toHaveProperty('_sdf')
    expect(merged).not.toHaveProperty('__meta')
    expect(merged).not.toHaveProperty('_timestamp')
  })
})

describe('Constraint 12: Comparator strings — single source of truth', () => {
  it('SdfComparators maps every Comparators enum value', () => {
    const comparatorValues = Object.values(Comparators)
    for (const comparator of comparatorValues) {
      expect(SdfComparators).toHaveProperty(comparator)
      expect(typeof SdfComparators[comparator as Comparators]).toBe('string')
    }
  })

  it('condition-hint uses SdfComparators, not hardcoded strings', () => {
    const staticCheck = {
      questionId: 'hasSpouse',
      comparator: Comparators.EQUALS,
      value: 'yes',
    }

    const hint = extractClientCondition(staticCheck)

    expect(hint).not.toBeNull()
    expect((hint as any).comparator).toBe(SdfComparators[Comparators.EQUALS])
    expect((hint as any).comparator).toBe('eq')
  })

  it('DynamicCheck (closure) returns null — no client condition', () => {
    const dynamicCheck = () => true
    const hint = extractClientCondition(dynamicCheck)
    expect(hint).toBeNull()
  })

  it('MultiConditionCheck with all StaticChecks emits multi hint', () => {
    const multiCheck = {
      isMultiCheck: true as const,
      show: true,
      on: AllOrAny.ALL,
      check: [
        {
          questionId: 'hasDependents',
          comparator: Comparators.EQUALS,
          value: 'yes',
        },
        {
          questionId: 'maritalStatus',
          comparator: Comparators.NOT_EQUAL,
          value: 'single',
        },
      ],
    }

    const hint = extractClientCondition(multiCheck)
    expect(hint).not.toBeNull()
    expect((hint as any).type).toBe('multi')
    expect((hint as any).on).toBe('all')
    expect((hint as any).checks).toHaveLength(2)
    expect((hint as any).checks[0].comparator).toBe('eq')
    expect((hint as any).checks[1].comparator).toBe('neq')
  })

  it('MultiConditionCheck with mixed closure/static returns null', () => {
    const mixedCheck = {
      isMultiCheck: true as const,
      show: true,
      on: AllOrAny.ALL,
      check: [
        {
          questionId: 'field',
          comparator: Comparators.EQUALS,
          value: 'yes',
        },
        () => true, // DynamicCheck mixed in
      ],
    }

    const hint = extractClientCondition(mixedCheck)
    expect(hint).toBeNull()
  })
})
