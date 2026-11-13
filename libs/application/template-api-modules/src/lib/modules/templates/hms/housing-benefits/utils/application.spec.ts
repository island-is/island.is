import { ApplicationWithAttachments } from '@island.is/application/types'
import { ExemptionType } from '@island.is/clients/hms-housing-benefits'
import {
  collectApplicationFileEntries,
  getApplicantAddressForSubmission,
  getApplicantExemptionNumber,
  mapApplicationToHousingBenefitsModel,
} from './application'

const APPLICANT_ID = '0101302989'
const MEMBER_ID = '0101304929'

const createApplication = (
  answers: ApplicationWithAttachments['answers'] = {},
  externalData: ApplicationWithAttachments['externalData'] = {},
): ApplicationWithAttachments =>
  ({
    id: 'app-1',
    applicant: APPLICANT_ID,
    assignees: [],
    created: new Date('2026-11-01T00:00:00Z'),
    answers: {
      applicant: { nationalId: APPLICANT_ID },
      ...answers,
    },
    externalData,
  } as unknown as ApplicationWithAttachments)

const registryEntry = (
  address: Record<string, string | null> | null,
  status: 'success' | 'failure' = 'success',
) => ({
  status,
  date: new Date(),
  data: status === 'success' ? { address } : {},
})

const staleAnswers = {
  applicant: {
    nationalId: APPLICANT_ID,
    address: 'Gamla gata 1',
    postalCode: '101',
    city: 'Reykjavík',
  },
}

const freshAddress = {
  streetAddress: 'Nýja gata 5',
  postalCode: '600',
  city: 'Akureyri',
  locality: 'Akureyri',
}

describe('getApplicantAddressForSubmission', () => {
  it('prefers the National Registry entry over the prefilled answers', () => {
    expect(
      getApplicantAddressForSubmission(
        createApplication(staleAnswers, {
          nationalRegistry: registryEntry(freshAddress),
        }),
      ),
    ).toEqual({
      address: 'Nýja gata 5',
      postalCode: '600',
      municipality: 'Akureyri',
    })
  })

  it('falls back to the prefilled answers when the National Registry fetch failed', () => {
    expect(
      getApplicantAddressForSubmission(
        createApplication(staleAnswers, {
          nationalRegistry: registryEntry(null, 'failure'),
        }),
      ),
    ).toEqual({
      address: 'Gamla gata 1',
      postalCode: '101',
      municipality: 'Reykjavík',
    })
  })

  it('uses locality when city is missing', () => {
    expect(
      getApplicantAddressForSubmission(
        createApplication(staleAnswers, {
          nationalRegistry: registryEntry({
            ...freshAddress,
            city: null,
          }),
        }),
      ).municipality,
    ).toBe('Akureyri')
  })

  it('falls back to the prefilled answers when no registry address exists', () => {
    expect(
      getApplicantAddressForSubmission(createApplication(staleAnswers)),
    ).toEqual({
      address: 'Gamla gata 1',
      postalCode: '101',
      municipality: 'Reykjavík',
    })
  })

  it('is used for the address sent to HMS', () => {
    const model = mapApplicationToHousingBenefitsModel(
      createApplication(staleAnswers, {
        nationalRegistry: registryEntry(freshAddress),
      }),
    )

    expect(model).toEqual(
      expect.objectContaining({
        address: 'Nýja gata 5',
        postalCode: '600',
        municipality: 'Akureyri',
      }),
    )
  })
})

describe('getApplicantExemptionNumber', () => {
  it.each([
    ['studies', ExemptionType.Education],
    ['health', ExemptionType.Illness],
    ['housing', ExemptionType.HalfwayHouse],
    ['work', ExemptionType.Employment],
  ])('maps %p to %p', (reason, expected) => {
    expect(
      getApplicantExemptionNumber({
        legalDomicileOption: 'exemption',
        exemptionReason: reason,
      }),
    ).toBe(expected)
  })

  it('returns undefined when the exemption section was never answered', () => {
    expect(getApplicantExemptionNumber({})).toBeUndefined()
  })

  it('returns undefined when a reason is left over but the national registry option is selected', () => {
    expect(
      getApplicantExemptionNumber({
        legalDomicileOption: 'nationalRegistry',
        exemptionReason: 'studies',
      }),
    ).toBeUndefined()
  })

  it('returns undefined for an unknown reason', () => {
    expect(
      getApplicantExemptionNumber({
        legalDomicileOption: 'exemption',
        exemptionReason: 'somethingElse',
      }),
    ).toBeUndefined()
  })
})

describe('mapApplicationToHousingBenefitsModel exemptionNumber', () => {
  it('sets exemptionNumber only on the applicant entry', () => {
    const model = mapApplicationToHousingBenefitsModel(
      createApplication({
        legalDomicileOption: 'exemption',
        exemptionReason: 'work',
        householdMembersTableRepeater: [
          { nationalIdWithName: { nationalId: MEMBER_ID, name: 'Member' } },
        ],
      }),
    )

    const [applicant, ...others] = model.householdMembers ?? []
    expect(applicant.kennitala).toBe(APPLICANT_ID)
    expect(applicant.exemptionNumber).toBe(ExemptionType.Employment)
    expect(others.length).toBeGreaterThan(0)
    others.forEach((member) => expect(member.exemptionNumber).toBeUndefined())
  })

  it('omits exemptionNumber when no exemption was requested', () => {
    const model = mapApplicationToHousingBenefitsModel(createApplication())

    expect(model.householdMembers?.[0].exemptionNumber).toBeUndefined()
  })
})

describe('collectApplicationFileEntries applicant-submit access agreements', () => {
  const file = (key: string) => ({ key, name: `${key}.pdf` })

  it('collects files stored under the applicant kennitala', () => {
    const entries = collectApplicationFileEntries(
      createApplication({
        [APPLICANT_ID]: {
          applicantSubmitAccessAgreementRepeater: [
            { childNationalId: MEMBER_ID, file: [file('scoped')] },
          ],
        },
      }),
      APPLICANT_ID,
    )

    expect(entries.map((e) => e.key)).toEqual(['scoped'])
    expect(entries[0].kennitala).toBe(APPLICANT_ID)
  })
})
