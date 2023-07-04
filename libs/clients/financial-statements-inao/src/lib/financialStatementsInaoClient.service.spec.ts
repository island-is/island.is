import { LoggingModule } from '@island.is/logging'
import { ConfigModule, defineConfig } from '@island.is/nest/config'

import { Test, TestingModule } from '@nestjs/testing'

import { FinancialStatementsInaoClientModule } from './financialStatementsInaoClient.module'
import { FinancialStatementsInaoClientService } from './financialStatementsInaoClient.service'
import {
  Contact,
  ContactType,
  DigitalSignee,
  PersonalElectionSubmitInput,
} from './types'

import clientTypesMockResponse from './mocks/clientTypes.json'
import electionInfoMockResponse from './mocks/electionInfo.json'
import financialTypes from './mocks/financialTypes.json'
import individualClientByNationalId from './mocks/individualClientByNationalId.json'
import politicalPartyClientByNationalId from './mocks/politicalPartyClientByNationalId.json'
import cemeteryClientByNationalId from './mocks/politicalPartyClientByNationalId.json'

export const MockConfig = defineConfig({
  name: 'MockClient',
  load: (_env) => ({
    basePath: '',
    issuer: '',
    scope: '',
    tokenEndpoint: '',
    clientId: '',
    clientSecret: '',
  }),
})

const attachmentFile =
  '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ZG9iagoKMTAgMCBvYmoKPDwvRjEgOSAwIFIKPj4KZW5kb2JqCgoxMSAwIG9iago8PC9Gb250IDEwIDAgUgovUHJvY1NldFsvUERGL1RleHRdCj4+CmVuZG9iagoKMSAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDQgMCBSL1Jlc291cmNlcyAxMSAwIFIvTWVkaWFCb3hbMCAwIDU5NS4zMDM5MzcwMDc4NzQgODQxLjg4OTc2Mzc3OTUyOF0vR3JvdXA8PC9TL1RyYW5zcGFyZW5jeS9DUy9EZXZpY2VSR0IvSSB0cnVlPj4vQ29udGVudHMgMiAwIFI+PgplbmRvYmoKCjQgMCBvYmoKPDwvVHlwZS9QYWdlcwovUmVzb3VyY2VzIDExIDAgUgovTWVkaWFCb3hbIDAgMCA1OTUuMzAzOTM3MDA3ODc0IDg0MS44ODk3NjM3Nzk1MjggXQovS2lkc1sgMSAwIFIgXQovQ291bnQgMT4+CmVuZG9iagoKMTIgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDQgMCBSCi9PcGVuQWN0aW9uWzEgMCBSIC9YWVogbnVsbCBudWxsIDBdCi9MYW5nKGVuLVVTKQo+PgplbmRvYmoKCjEzIDAgb2JqCjw8L0NyZWF0b3I8RkVGRjAwNTcwMDcyMDA2OTAwNzQwMDY1MDA3Mj4KL1Byb2R1Y2VyPEZFRkYwMDRDMDA2OTAwNjIwMDcyMDA2NTAwNEYwMDY2MDA2NjAwNjkwMDYzMDA2NTAwMjAwMDM3MDAyRTAwMzM+Ci9DcmVhdGlvbkRhdGUoRDoyMDIyMTAxNzA5MzA0OVonKT4+CmVuZG9iagoKeHJlZgowIDE0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwNTQ5MyAwMDAwMCBuIAowMDAwMDAwMDE5IDAwMDAwIG4gCjAwMDAwMDAxOTkgMDAwMDAgbiAKMDAwMDAwNTY2MiAwMDAwMCBuIAowMDAwMDAwMjE5IDAwMDAwIG4gCjAwMDAwMDQ3MjAgMDAwMDAgbiAKMDAwMDAwNDc0MSAwMDAwMCBuIAowMDAwMDA0OTMxIDAwMDAwIG4gCjAwMDAwMDUyMzUgMDAwMDAgbiAKMDAwMDAwNTQwNiAwMDAwMCBuIAowMDAwMDA1NDM4IDAwMDAwIG4gCjAwMDAwMDU3ODcgMDAwMDAgbiAKMDAwMDAwNTg4NCAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgMTQvUm9vdCAxMiAwIFIKL0luZm8gMTMgMCBSCi9JRCBbIDxGMjMwQTc5OERFOUFERTNCOTUwQjE4NTYzMTM3MzAxMT4KPEYyMzBBNzk4REU5QURFM0I5NTBCMTg1NjMxMzczMDExPiBdCi9Eb2NDaGVja3N1bSAvNDBBNjhCRDRBMzQ3QjkyOTRCNzMwMDhCQzkyMzEwMjgKPj4Kc3RhcnR4cmVmCjYwNTQKJSVFT0YK'

describe('Financial Statements Inao Client', () => {
  let inaoClient: FinancialStatementsInaoClientService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggingModule,
        FinancialStatementsInaoClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [MockConfig],
        }),
      ],
    }).compile()

    inaoClient = module.get<FinancialStatementsInaoClientService>(
      FinancialStatementsInaoClientService,
    )
  })

  it('should get client types', async () => {
    jest
      .spyOn(inaoClient, 'getData')
      .mockImplementation(() => Promise.resolve(clientTypesMockResponse))

    const res = await inaoClient.getClientTypes()
    expect(res?.length).toBe(3)
    expect(res).toContainEqual({ value: 150000000, label: 'Einstaklingur' })
    expect(res).toContainEqual({ value: 150000001, label: 'Stjórnmálasamtök' })
    expect(res).toContainEqual({ value: 150000002, label: 'Kirkjugarður' })
  })

  it('should be able to get election info', async () => {
    jest
      .spyOn(inaoClient, 'getData')
      .mockImplementation(() => Promise.resolve(electionInfoMockResponse))

    const res = await inaoClient.getElectionInfo(
      '32291daa-5ce6-ec11-bb3c-0022489dce97',
    )

    expect(res).toBeTruthy()
    expect(res).toEqual({
      electionType: 150000000,
      electionDate: '2020-06-27T00:00:00Z',
    })
  })

  it('should submit financial statement for political party', async () => {
    const values = {
      contributionsByLegalEntities: 100,
      individualContributions: 101,
      candidatesOwnContributions: 102,
      capitalIncome: 128,
      otherIncome: 129,
      electionOfficeExpenses: 130,
      advertisingAndPromotions: 131,
      meetingsAndTravelExpenses: 132,
      otherExpenses: 139,
      financialExpenses: 148,
      fixedAssetsTotal: 150,
      currentAssets: 160,
      longTermLiabilitiesTotal: 170,
      shortTermLiabilitiesTotal: 180,
      equityTotal: 190,
    }

    const input: PersonalElectionSubmitInput = {
      client: {
        nationalId: '1234567890',
        name: 'Svampur Sveinsson',
        email: 'svampur@bikinibotnar.is',
        phone: '5885522',
      },
      actor: undefined,
      digitalSignee: { phone: '5885522', email: 'svampur@bikinibotnar.is' },
      electionId: '32291daa-5ce6-ec11-bb3c-0022489dce97',
      noValueStatement: false,
      file: attachmentFile,
      values: values,
    }

    jest
      .spyOn(inaoClient, 'getData')
      .mockReturnValueOnce(Promise.resolve(financialTypes))
      .mockReturnValueOnce(Promise.resolve(individualClientByNationalId))
      .mockReturnValueOnce(Promise.resolve(electionInfoMockResponse))
    jest
      .spyOn(inaoClient, 'postFinancialStatement')
      .mockImplementation(() =>
        Promise.resolve('d2f88979-ef37-4356-9cff-80aa664a8af7'),
      )
    jest
      .spyOn(inaoClient, 'sendFile')
      .mockImplementation(() => Promise.resolve(true))

    const res = await inaoClient.postFinancialStatementForPersonalElection(
      input,
    )

    expect(res).toBeTruthy()
  })

  it('should submit financial statement for political party', async () => {
    const values = {
      contributionsFromTheTreasury: 200,
      parliamentaryPartySupport: 201,
      municipalContributions: 202,
      contributionsFromLegalEntities: 203,
      contributionsFromIndividuals: 204,
      generalMembershipFees: 205,
      capitalIncome: 228,
      otherIncome: 229,
      officeOperations: 230,
      otherOperatingExpenses: 239,
      financialExpenses: 248,
      fixedAssetsTotal: 250,
      currentAssets: 260,
      longTermLiabilitiesTotal: 270,
      shortTermLiabilitiesTotal: 280,
      equityTotal: 290,
    }

    const client = {
      nationalId: '1234567890',
      name: 'Svampur Sveinsson',
      email: 'svampur@bikinibotnar.is',
      phone: '5885522',
    }

    const contacts: Contact[] = [
      {
        nationalId: '1234567890',
        name: 'Svampur Sveinsson',
        email: 'svampur@bikinibotnar.is',
        phone: '5885522',
        contactType: ContactType.Actor,
      },
    ]

    const digitalSignee: DigitalSignee = {
      email: 'svampur@bikinibotnar.is',
      phone: '5885522',
    }

    jest
      .spyOn(inaoClient, 'getData')
      .mockReturnValueOnce(Promise.resolve(financialTypes))
      .mockReturnValueOnce(Promise.resolve(politicalPartyClientByNationalId))
      .mockReturnValueOnce(Promise.resolve(electionInfoMockResponse))
    jest
      .spyOn(inaoClient, 'postFinancialStatement')
      .mockImplementation(() =>
        Promise.resolve('d2f88979-ef37-4356-9cff-80aa664a8af7'),
      )
    jest
      .spyOn(inaoClient, 'sendFile')
      .mockImplementation(() => Promise.resolve(true))

    const res = await inaoClient.postFinancialStatementForPoliticalParty(
      client,
      contacts,
      digitalSignee,
      '2022',
      'comment',
      values,
      attachmentFile,
    )

    expect(res).toBeTruthy()
  })

  it('should submit financial statement for cemetery', async () => {
    const values = {
      careIncome: 300,
      burialRevenue: 301,
      grantFromTheCemeteryFund: 302,
      capitalIncome: 328,
      otherIncome: 329,
      salaryAndSalaryRelatedExpenses: 330,
      funeralExpenses: 331,
      operationOfAFuneralChapel: 332,
      donationsToCemeteryFund: 334,
      contributionsAndGrantsToOthers: 335,
      otherOperatingExpenses: 339,
      financialExpenses: 348,
      depreciation: 349,
      fixedAssetsTotal: 350,
      currentAssets: 360,
      longTermLiabilitiesTotal: 370,
      shortTermLiabilitiesTotal: 380,
      equityAtTheBeginningOfTheYear: 391,
      revaluationDueToPriceChanges: 392,
      reassessmentOther: 393,
    }

    const client = {
      nationalId: '1234567890',
      name: 'Svampur Sveinsson',
      email: 'svampur@bikinibotnar.is',
      phone: '5885522',
    }

    const contacts: Contact[] = [
      {
        nationalId: '1234567890',
        name: 'Svampur Sveinsson',
        email: 'svampur@bikinibotnar.is',
        phone: '5885522',
        contactType: ContactType.Actor,
      },
    ]

    const digitalSignee: DigitalSignee = {
      email: 'svampur@bikinibotnar.is',
      phone: '5885522',
    }

    jest
      .spyOn(inaoClient, 'getData')
      .mockReturnValueOnce(Promise.resolve(financialTypes))
      .mockReturnValueOnce(Promise.resolve(cemeteryClientByNationalId))
      .mockReturnValueOnce(Promise.resolve(electionInfoMockResponse))
    jest
      .spyOn(inaoClient, 'postFinancialStatement')
      .mockImplementation(() =>
        Promise.resolve('d2f88979-ef37-4356-9cff-80aa664a8af7'),
      )
    jest
      .spyOn(inaoClient, 'sendFile')
      .mockImplementation(() => Promise.resolve(true))

    const res = await inaoClient.postFinancialStatementForCemetery(
      client,
      contacts,
      digitalSignee,
      '2022',
      'comment',
      values,
      attachmentFile,
    )

    expect(res).toBeTruthy()
  })
})
