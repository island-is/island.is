import { renderHook } from '@testing-library/react'
import { RequirementKey } from '@island.is/api/schema'
import { Application, ApplicationStatus } from '@island.is/application/types'
import { useEligibility } from './useEligibility'
import { B_FULL, B_FULL_RENEWAL_65, B_TEMP, BE } from '../../lib/constants'

// Mock Apollo so we don't need MockedProvider plumbing. The hook itself only
// depends on the shape `useQuery` returns ({ data, error, loading }), so a
// jest mock returning a fixed eligibility result is enough to exercise the
// hook's decision logic in isolation.
let mockQueryResult: {
  data: {
    drivingLicenseApplicationEligibility?: {
      isEligible: boolean
      requirements: Array<{ key: string; requirementMet: boolean }>
    }
  }
  loading: boolean
  error?: Error
} = {
  data: {
    drivingLicenseApplicationEligibility: {
      isEligible: true,
      requirements: [],
    },
  },
  loading: false,
}

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: () => mockQueryResult,
}))

const baseApplication = (
  overrides: Partial<Application> & {
    answers?: Application['answers']
    externalData?: Application['externalData']
  } = {},
): Application => ({
  id: 'test-app-id',
  applicant: '0101010101',
  assignees: [],
  applicantActors: [],
  typeId: 'DRIVING_LICENSE' as never,
  state: 'draft',
  status: ApplicationStatus.IN_PROGRESS,
  created: new Date(),
  modified: new Date(),
  answers: {},
  externalData: {},
  ...overrides,
})

const withUsablePhoto = {
  qualityPhotoAndSignature: {
    data: { pohto: 'base64', imageTypeId: 1 },
    status: 'success' as const,
    date: new Date(),
  },
}

const withoutAnyPhoto = {
  qualityPhotoAndSignature: {
    data: { pohto: null, imageTypeId: null },
    status: 'success' as const,
    date: new Date(),
  },
  allPhotosFromThjodskra: {
    data: { images: [] },
    status: 'success' as const,
    date: new Date(),
  },
}

describe('useEligibility (real-path photo gate)', () => {
  beforeEach(() => {
    mockQueryResult = {
      data: {
        drivingLicenseApplicationEligibility: {
          isEligible: true,
          requirements: [],
        },
      },
      loading: false,
    }
  })

  describe('BE', () => {
    it('blocks when GraphQL says eligible but no usable photo exists', () => {
      const application = baseApplication({
        answers: { applicationFor: BE },
        externalData: withoutAnyPhoto,
      })

      const { result } = renderHook(() => useEligibility(application, false))
      expect(result.current.eligibility?.isEligible).toBe(false)
      const hasNoPhoto = result.current.eligibility?.requirements?.find(
        (r) => r.key === RequirementKey.hasNoPhoto,
      )
      expect(hasNoPhoto?.requirementMet).toBe(false)
    })

    it('lets the GraphQL eligibility decide when a usable photo exists', () => {
      const application = baseApplication({
        answers: { applicationFor: BE },
        externalData: withUsablePhoto,
      })

      const { result } = renderHook(() => useEligibility(application, false))
      expect(result.current.eligibility?.isEligible).toBe(true)
      const hasNoPhoto = result.current.eligibility?.requirements?.find(
        (r) => r.key === RequirementKey.hasNoPhoto,
      )
      expect(hasNoPhoto?.requirementMet).toBe(true)
    })
  })

  describe('B_FULL_RENEWAL_65', () => {
    it('blocks when redesign flag is on and no usable photo', () => {
      const application = baseApplication({
        answers: { applicationFor: B_FULL_RENEWAL_65 },
        externalData: withoutAnyPhoto,
      })

      const { result } = renderHook(() => useEligibility(application, true))
      expect(result.current.eligibility?.isEligible).toBe(false)
    })

    it('skips the photo gate when redesign flag is off (legacy behavior)', () => {
      const application = baseApplication({
        answers: { applicationFor: B_FULL_RENEWAL_65 },
        externalData: withoutAnyPhoto,
      })

      const { result } = renderHook(() => useEligibility(application, false))
      expect(result.current.eligibility?.isEligible).toBe(true)
      const hasNoPhoto = result.current.eligibility?.requirements?.find(
        (r) => r.key === RequirementKey.hasNoPhoto,
      )
      expect(hasNoPhoto).toBeUndefined()
    })
  })

  describe('B_TEMP (new branch)', () => {
    it('blocks when B-temp redesign flag is on and no usable photo', () => {
      const application = baseApplication({
        answers: { applicationFor: B_TEMP },
        externalData: withoutAnyPhoto,
      })

      const { result } = renderHook(() =>
        useEligibility(application, false, true),
      )
      expect(result.current.eligibility?.isEligible).toBe(false)
      const hasNoPhoto = result.current.eligibility?.requirements?.find(
        (r) => r.key === RequirementKey.hasNoPhoto,
      )
      expect(hasNoPhoto?.requirementMet).toBe(false)
    })

    it('allows pass-through when B-temp redesign flag is on and photo exists', () => {
      const application = baseApplication({
        answers: { applicationFor: B_TEMP },
        externalData: withUsablePhoto,
      })

      const { result } = renderHook(() =>
        useEligibility(application, false, true),
      )
      expect(result.current.eligibility?.isEligible).toBe(true)
    })

    it('falls through to unbranched default when B-temp redesign flag is off (legacy behavior)', () => {
      const application = baseApplication({
        answers: { applicationFor: B_TEMP },
        externalData: withoutAnyPhoto,
      })

      const { result } = renderHook(() =>
        useEligibility(application, false, false),
      )
      // The default path returns whatever the GraphQL eligibility says, with
      // no added photo gate. Default mock returns isEligible: true.
      expect(result.current.eligibility?.isEligible).toBe(true)
      const hasNoPhoto = result.current.eligibility?.requirements?.find(
        (r) => r.key === RequirementKey.hasNoPhoto,
      )
      expect(hasNoPhoto).toBeUndefined()
    })

    it('defaults isBTempRedesignEnabled to false when omitted (backwards compat)', () => {
      const application = baseApplication({
        answers: { applicationFor: B_TEMP },
        externalData: withoutAnyPhoto,
      })

      const { result } = renderHook(() => useEligibility(application, false))
      // No photo gate applied because the third arg defaults to false
      expect(result.current.eligibility?.isEligible).toBe(true)
    })
  })

  describe('B_FULL (no photo gate at all)', () => {
    it('passes through the GraphQL eligibility verbatim', () => {
      const application = baseApplication({
        answers: { applicationFor: B_FULL },
        externalData: withoutAnyPhoto,
      })

      const { result } = renderHook(() => useEligibility(application, false))
      expect(result.current.eligibility?.isEligible).toBe(true)
      const hasNoPhoto = result.current.eligibility?.requirements?.find(
        (r) => r.key === RequirementKey.hasNoPhoto,
      )
      expect(hasNoPhoto).toBeUndefined()
    })
  })
})
