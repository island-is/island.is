import fetch from 'isomorphic-fetch'

import { CaseState, CaseType, User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { Case } from '../../repository'
import { PoliceService } from '../police.service'

jest.mock('isomorphic-fetch')

// A value with characters that are reserved in a URL
const value = 'a/b?c=d&e#f g'
const encodedValue = 'a%2Fb%3Fc%3Dd%26e%23f%20g'

describe('PoliceService - request urls', () => {
  const mockFetch = fetch as jest.Mock
  const user = {} as User
  let policeService: PoliceService

  const requestedUrl = () => mockFetch.mock.calls[0][0] as string

  beforeEach(async () => {
    mockFetch.mockReset()
    mockFetch.mockRejectedValue(new Error('Some error'))

    const testingModule = await createTestingPoliceModule()

    policeService = testingModule.policeService
  })

  it('should encode the case id when getting police case files', async () => {
    await policeService.getAllPoliceCaseFiles(value, user).catch(() => null)

    expect(requestedUrl()).toMatch(
      new RegExp(`/V2/GetDocumentListById/${encodedValue}$`),
    )
  })

  it('should encode the case id when getting police digital case files', async () => {
    await policeService
      .getAllPoliceSystemDigitalCaseFiles(value, user)
      .catch(() => null)

    expect(requestedUrl()).toMatch(
      new RegExp(`/V4/GetRVRafraengogn/${encodedValue}$`),
    )
  })

  it('should encode the case id when getting police defendants', async () => {
    await policeService.getDefendantsFromPolice(value, user).catch(() => null)

    expect(requestedUrl()).toMatch(
      new RegExp(`/V4/GetRVAdilarMals/${encodedValue}$`),
    )
  })

  it('should encode the case id and the national id when getting police case info', async () => {
    await policeService
      .getPoliceCaseInfo(value, user, [{ id: 'defendant', nationalId: value }])
      .catch(() => null)

    expect(requestedUrl()).toMatch(
      new RegExp(`/V4/GetRVMalseiningar/${encodedValue}/${encodedValue}$`),
    )
  })

  it('should encode the subpoena id when getting a subpoena status', async () => {
    await policeService.getSubpoenaStatus(value, user).catch(() => null)

    expect(requestedUrl()).toMatch(
      new RegExp(`/GetSubpoenaStatus\\?id=${encodedValue}$`),
    )
  })

  it('should encode the document id when getting a verdict document status', async () => {
    await policeService.getVerdictDocumentStatus(value, user).catch(() => null)

    expect(requestedUrl()).toMatch(
      new RegExp(`/GetDeliveryStatus\\?id=${encodedValue}$`),
    )
  })

  it.each([
    ['a defendant national id', '0000000000', 'V2/UpdateRVCase'],
    ['no defendant national id', '', 'V4/case'],
  ])(
    'should encode the case id when updating a police case with %s',
    async (_description, defendantNationalId, path) => {
      await policeService.updatePoliceCase(
        user,
        value,
        CaseType.CUSTODY,
        CaseState.ACCEPTED,
        '000-0000-0000',
        'R-1/2026',
        defendantNationalId,
        new Date(),
        'Conclusion',
        [],
      )

      expect(requestedUrl()).toMatch(new RegExp(`/${path}/${encodedValue}$`))
    },
  )

  it('should encode the subpoena id when revoking a subpoena', async () => {
    await policeService.revokeSubpoena({ id: 'case' } as Case, value, user)

    expect(requestedUrl()).toMatch(
      new RegExp(`/InvalidateCourtSummon\\?sekGuid=${encodedValue}$`),
    )
  })
})
