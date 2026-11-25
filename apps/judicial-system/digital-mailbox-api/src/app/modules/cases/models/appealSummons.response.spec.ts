import {
  DefenderChoice,
  Institution,
  User,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'
import {
  AppealSummonsCounselType,
  AppealSummonsRecipientRole,
  AppealSummonsResponse,
} from './appealSummons.response'

const court = {
  name: 'Landsréttur',
  address: 'Reykjavík',
} as Institution
const prosecutorsOffice = {
  name: 'Ríkissaksóknari',
} as Institution
const prosecutor = {
  name: 'Sigríður Saksóknari',
  institution: prosecutorsOffice,
} as User

const baseCase = (): InternalCaseResponse => ({
  id: 'case-id',
  courtCaseNumber: 'S-1234/2026',
  defendants: [
    {
      id: 'defendant-id',
      nationalId: '0000000000',
      name: 'Gervimaður',
    },
  ],
  civilClaimants: [
    {
      id: 'claimant-id',
      nationalId: '1111111111',
      name: 'Kröfuhafi',
    },
  ],
  court,
  prosecutorsOffice,
  prosecutor,
  verdictAppealCase: {
    id: 'appeal-case-id',
    appealCaseNumber: '1/2026',
    appealSummonses: [
      {
        id: 'summons-id',
        created: new Date('2026-01-01'),
        services: [
          {
            id: 'defendant-service-id',
            created: new Date('2026-01-02'),
            defendantId: 'defendant-id',
            sentToServiceDate: new Date('2026-01-02'),
            externalPoliceDocumentId: 'police-doc-id',
            serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
          },
          {
            id: 'claimant-service-id',
            created: new Date('2026-01-03'),
            civilClaimantId: 'claimant-id',
            sentToServiceDate: new Date('2026-01-03'),
            externalPoliceDocumentId: 'police-doc-id-2',
            serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
          },
        ],
      },
    ],
  },
})

describe('AppealSummonsResponse.fromInternalCaseResponse', () => {
  it('returns null when the national id has no appeal summons service', () => {
    const internalCase = baseCase()
    internalCase.verdictAppealCase = {
      id: 'appeal-case-id',
      appealCaseNumber: '1/2026',
      appealSummonses: [],
    }

    expect(
      AppealSummonsResponse.fromInternalCaseResponse(
        internalCase,
        '0000000000',
        'is',
      ),
    ).toBeNull()
  })

  it('maps a served appeal summons for a defendant', () => {
    const response = AppealSummonsResponse.fromInternalCaseResponse(
      baseCase(),
      '0000000000',
      'is',
    )

    expect(response?.caseId).toBe('case-id')
    expect(response?.data.title).toBe('Áfrýjunarstefna')
    expect(response?.data.hasBeenServed).toBe(true)
    expect(response?.data.counselType).toBe(AppealSummonsCounselType.DEFENDER)
    expect(response?.data.recipientRole).toBe(
      AppealSummonsRecipientRole.DEFENDANT,
    )
    expect(response?.data.groups[0].items).toContainEqual({
      label: 'Saksóknari',
      value: 'Sigríður Saksóknari',
    })
    expect(response?.counselInfo).toBeUndefined()
  })

  it('maps a served appeal summons for a civil claimant', () => {
    const response = AppealSummonsResponse.fromInternalCaseResponse(
      baseCase(),
      '1111111111',
      'is',
    )

    expect(response?.data.counselType).toBe(
      AppealSummonsCounselType.SPOKESPERSON,
    )
    expect(response?.data.recipientRole).toBe(
      AppealSummonsRecipientRole.CIVIL_CLAIMANT,
    )
    expect(response?.data.groups[0].items).toContainEqual({
      label: 'Einkaréttarkröfuhafi',
      value: 'Kröfuhafi',
    })
    expect(response?.data.appealSummonsInfoText).toContain('réttargæslumann')
  })

  it('exposes a waived counsel choice for a defendant', () => {
    const internalCase = baseCase()
    const defendant = internalCase.defendants?.[0]
    if (!defendant) {
      throw new Error('expected defendant in fixture')
    }
    defendant.isAppealDefenderWaived = true

    const response = AppealSummonsResponse.fromInternalCaseResponse(
      internalCase,
      '0000000000',
      'is',
    )

    expect(response?.data.hasChosenCounsel).toBe(true)
    expect(response?.counselInfo).toEqual({
      defenderChoice: DefenderChoice.WAIVE,
      defenderName: undefined,
      canEdit: false,
      courtContactInfo:
        'Vinsamlegast hafið samband við dómstól til að breyta verjanda vali',
    })
  })

  it('exposes a chosen appeal spokesperson for a civil claimant', () => {
    const internalCase = baseCase()
    const civilClaimant = internalCase.civilClaimants?.[0]
    if (!civilClaimant) {
      throw new Error('expected civil claimant in fixture')
    }

    civilClaimant.hasAppealSpokesperson = true
    civilClaimant.appealSpokespersonNationalId = '2222222222'
    civilClaimant.appealSpokespersonName = 'Lára Lögmann'

    const response = AppealSummonsResponse.fromInternalCaseResponse(
      internalCase,
      '1111111111',
      'is',
    )

    expect(response?.counselInfo).toEqual({
      defenderChoice: DefenderChoice.CHOOSE,
      defenderName: 'Lára Lögmann',
      canEdit: false,
      courtContactInfo:
        'Vinsamlegast hafið samband við dómstól til að breyta vali á réttargæslumanni',
    })
  })

  it('returns null when the service has no external police document id', () => {
    const internalCase = baseCase()
    const service =
      internalCase.verdictAppealCase?.appealSummonses?.[0]?.services?.[0]
    if (!service) {
      throw new Error('expected appeal summons service in fixture')
    }
    service.externalPoliceDocumentId = undefined

    expect(
      AppealSummonsResponse.fromInternalCaseResponse(
        internalCase,
        '0000000000',
        'is',
      ),
    ).toBeNull()
  })

  it('leaves counselInfo unset before the defendant picks', () => {
    const response = AppealSummonsResponse.fromInternalCaseResponse(
      baseCase(),
      '0000000000',
      'is',
    )

    expect(response?.data.hasChosenCounsel).toBe(false)
    expect(response?.counselInfo).toBeUndefined()
  })

  it('infers a waived spokesperson when hasAppealSpokesperson is false', () => {
    const internalCase = baseCase()
    // Civil-claimant mailbox payload has no defendants.
    internalCase.defendants = undefined
    const civilClaimant = internalCase.civilClaimants?.[0]
    if (!civilClaimant) {
      throw new Error('expected civil claimant in fixture')
    }
    civilClaimant.hasAppealSpokesperson = false
    civilClaimant.appealSpokespersonNationalId = undefined

    const response = AppealSummonsResponse.fromInternalCaseResponse(
      internalCase,
      '1111111111',
      'is',
    )

    expect(response?.data.hasChosenCounsel).toBe(true)
    expect(response?.counselInfo?.defenderChoice).toBe(DefenderChoice.WAIVE)
    expect(response?.counselInfo?.canEdit).toBe(false)
  })

  it('maps English locale strings for a defendant summons', () => {
    const response = AppealSummonsResponse.fromInternalCaseResponse(
      baseCase(),
      '0000000000',
      'en',
    )

    expect(response?.data.title).toBe('Appeal summons')
    expect(response?.data.appealSummonsInfoText).toContain('appeal summons')
  })
})
