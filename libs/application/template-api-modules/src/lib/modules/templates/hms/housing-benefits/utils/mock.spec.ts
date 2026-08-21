import { YES } from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import {
  getAssigneePersonalTaxMockMode,
  getPersonalTaxMockMode,
  shouldOverlayMockAssigneeNationalRegistryAddress,
  useMockRentalAgreements,
} from './mock'

jest.mock('@island.is/shared/utils', () => {
  const actual = jest.requireActual('@island.is/shared/utils')
  return {
    ...actual,
    isRunningOnEnvironment: jest.fn((environment: string) =>
      actual.isRunningOnEnvironment(environment),
    ),
  }
})

const ASSIGNEE_ID = '0101304929'

const applicantMockAnswers = {
  devMockSettings: {
    useMock: YES,
    mockRentalAgreements: [YES],
    mockTaxReturn: [YES],
    mockTaxReturnVariant: 'emptySuccess',
  },
}

const assigneeMockAnswers = {
  [ASSIGNEE_ID]: {
    assigneeDevMockSettings: {
      useMock: YES,
      mockTaxReturn: [YES],
      mockTaxReturnVariant: 'emptySuccess',
      mockNationalRegistryAddress: [YES],
    },
  },
}

describe('housing-benefits mock helpers', () => {
  afterEach(() => {
    const actual = jest.requireActual('@island.is/shared/utils')
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) =>
        actual.isRunningOnEnvironment(environment),
      )
  })

  describe('off production', () => {
    it('enables rental mock when flags are set', () => {
      expect(
        useMockRentalAgreements({ answers: applicantMockAnswers }),
      ).toBe(true)
    })

    it('returns tax mock mode when flags are set', () => {
      expect(
        getPersonalTaxMockMode({ answers: applicantMockAnswers }),
      ).toBe('empty')
    })

    it('returns assignee tax mock mode when flags are set', () => {
      expect(
        getAssigneePersonalTaxMockMode(
          { answers: assigneeMockAnswers },
          ASSIGNEE_ID,
        ),
      ).toBe('empty')
    })

    it('overlays mock national registry address when checkbox is set', () => {
      expect(
        shouldOverlayMockAssigneeNationalRegistryAddress(
          { answers: assigneeMockAnswers },
          { isDevOrLocal: false },
          ASSIGNEE_ID,
        ),
      ).toBe(true)
    })
  })

  describe('on production', () => {
    beforeEach(() => {
      jest
        .mocked(isRunningOnEnvironment)
        .mockImplementation((environment) => environment === 'production')
    })

    it('does not use mock rental agreements', () => {
      expect(
        useMockRentalAgreements({ answers: applicantMockAnswers }),
      ).toBe(false)
    })

    it('returns none for personal tax mock mode', () => {
      expect(
        getPersonalTaxMockMode({ answers: applicantMockAnswers }),
      ).toBe('none')
    })

    it('returns none for assignee tax mock mode', () => {
      expect(
        getAssigneePersonalTaxMockMode(
          { answers: assigneeMockAnswers },
          ASSIGNEE_ID,
        ),
      ).toBe('none')
    })

    it('does not overlay mock national registry address from checkbox', () => {
      expect(
        shouldOverlayMockAssigneeNationalRegistryAddress(
          { answers: assigneeMockAnswers },
          { isDevOrLocal: false },
          ASSIGNEE_ID,
        ),
      ).toBe(false)
    })
  })
})
