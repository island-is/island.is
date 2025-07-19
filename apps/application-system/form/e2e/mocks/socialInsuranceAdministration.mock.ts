import { HttpMethod, Response } from '@anev/ts-mountebank'
import { SocialInsuranceAdministration } from '../../../../../infra/src/dsl/xroad'
import { addXroadMock } from '@island.is/testing/e2e'

const setupApplicationMocks = async (applicationType: string) => {
  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: `/api/protected/v1/Applicant/${applicationType}/eligible`,
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      isEligible: true,
      reason: null,
      reasonCode: null,
    }),
  })

  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: `/api/protected/v1/Application/${applicationType}`,
    response: new Response().withJSONBody({
      applicationLineId: 1234567,
    }),
    prefixType: 'only-base-path',
    method: HttpMethod.POST,
  })
}

export const loadSocialInsuranceAdministrationXroadMocks = async () => {
  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/General/currencies',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      'ZAR',
      'AUD',
      'CAD',
      'CHF',
      'DKK',
      'EUR',
      'GBP',
      'NOK',
      'PLN',
      'SEK',
      'USD',
      'LVL',
      'CZK',
      'SKK',
      'IKR',
      'LTL',
      'VND',
      'BGN',
      'RUB',
      'CNY',
      'ALL',
      'LEI',
      'UAH',
      'HUF',
    ]),
  })
  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/Applicant',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      emailAddress: 'mail@mail.is',
      phoneNumber: null,
      bankAccount: {
        bank: '2222',
        ledger: '00',
        accountNumber: '123456',
      },
    }),
  })

  await setupApplicationMocks('oldagepension')
  await setupApplicationMocks('halfoldagepension')
  await setupApplicationMocks('additionalsupportfortheelderly')
  await setupApplicationMocks('pensionsupplement')
  await setupApplicationMocks('householdsupplement')
}
