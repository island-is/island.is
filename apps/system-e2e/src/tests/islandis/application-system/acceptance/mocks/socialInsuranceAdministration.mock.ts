import { HttpMethod, Response } from '@anev/ts-mountebank'
import { SocialInsuranceAdministration } from '../../../../../../../../infra/src/dsl/xroad'
import { addXroadMock } from '../../../../../support/wire-mocks'

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

  /* Old-age pension */
  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/Applicant/oldagepension/eligible',
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
    apiPath: '/api/protected/v1/Application/oldagepension',
    response: new Response().withJSONBody({
      applicationLineId: 1234567,
    }),
    prefixType: 'only-base-path',
    method: HttpMethod.POST,
  })

  /* Additional support for the elderly */
  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath:
      '/api/protected/v1/Applicant/additionalsupportfortheelderly/eligible',
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
    apiPath: '/api/protected/v1/Application/additionalsupportfortheelderly',
    response: new Response().withJSONBody({
      applicationLineId: 1234567,
    }),
    prefixType: 'only-base-path',
    method: HttpMethod.POST,
  })
}
