import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import get from 'lodash/get'
import set from 'lodash/set'

import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ParentalLeaveApi } from '@island.is/clients/vmst'
import {
  StartDateOptions,
  YES,
  NO,
} from '@island.is/application/templates/parental-leave'
import { EmailService } from '@island.is/email-service'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  APPLICATION_ATTACHMENT_BUCKET,
  ParentalLeaveService,
} from './parental-leave.service'
import { apiConstants } from './constants'

const nationalId = '1234564321'
let id = 0

const sendMail = () => ({
  messageId: 'some id',
})

class MockEmailService {
  getTransport() {
    return { sendMail }
  }

  sendEmail() {
    return sendMail()
  }
}

const createApplication = (): Application => ({
  answers: {
    applicant: {
      email: 'applicant@applicant.test',
      phoneNumber: '8888888',
    },
    employer: {
      email: 'employer@employer.test',
    },
    payments: {
      bank: '011126111111',
      pensionFund: 'x',
      union: 'y',
    },
    usePrivatePensionFund: 'no',
    periods: [
      {
        ratio: '100',
        useLength: 'no',
        endDate: '2022-01-01',
        startDate: '2021-05-17',
      },
    ],
    employerNationalRegistryId: '1111111119',
    requestRights: {
      requestDays: '45',
      isRequestingRights: 'yes',
    },
    selectedChild: '0',
  },
  applicant: nationalId,
  assignees: [],
  attachments: {},
  created: new Date(),
  modified: new Date(),
  externalData: {
    children: {
      data: {
        children: [
          {
            hasRights: true,
            remainingDays: 180,
            transferredDays: 45,
            parentalRelation: 'primary',
            expectedDateOfBirth: '2021-05-17',
          },
        ],
        existingApplications: [],
      },
      date: new Date('2021-06-10T11:31:02.641Z'),
      status: 'success',
    },
  },
  id: (id++).toString(),
  state: '',
  typeId: ApplicationTypes.PARENTAL_LEAVE,
  name: '',
  status: ApplicationStatus.IN_PROGRESS,
})

describe('ParentalLeaveService', () => {
  let parentalLeaveService: ParentalLeaveService
  let sharedService: SharedTemplateApiService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ParentalLeaveService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: ParentalLeaveApi,
          useClass: jest.fn(() => ({
            parentalLeaveSetParentalLeave: () =>
              Promise.resolve({
                id: '1337',
              }),
            parentalLeaveGetPeriodLength: () =>
              Promise.resolve({
                periodLength: 225,
              }),
            parentalLeaveGetPeriodEndDate: ({ length }: { length: string }) =>
              Promise.resolve({
                periodEndDate:
                  Number(length) === 45
                    ? new Date('2022-01-01T00:00:00')
                    : new Date('2021-11-16T00:00:00.000Z'),
              }),
          })),
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: EmailService,
          useClass: MockEmailService,
        },
        SharedTemplateApiService,
        {
          provide: APPLICATION_ATTACHMENT_BUCKET,
          useValue: 'attachmentBucket',
        },
      ],
    }).compile()

    parentalLeaveService = module.get(ParentalLeaveService)
    sharedService = module.get(SharedTemplateApiService)
  })

  describe('createPeriodsDTO', () => {
    it('should return 2 periods, one standard and one using the right period code', async () => {
      const application = createApplication()
      const res = await parentalLeaveService.createPeriodsDTO(
        application,
        nationalId,
      )

      expect(res).toEqual([
        {
          from: '2021-05-17',
          to: '2021-11-16',
          ratio: 100,
          approved: false,
          paid: false,
          rightsCodePeriod: null,
        },
        {
          from: '2021-11-17',
          to: '2022-01-01',
          ratio: 100,
          approved: false,
          paid: false,
          rightsCodePeriod: apiConstants.rights.receivingRightsId,
        },
      ])
    })

    it('should return 2 periods, one standard and mark it as ActualDateOfBirth and one using the right period code', async () => {
      const application = createApplication()

      const firstPeriod = get(application.answers, 'periods[0]') as object
      set(
        firstPeriod,
        'firstPeriodStart',
        StartDateOptions.ACTUAL_DATE_OF_BIRTH,
      )

      const res = await parentalLeaveService.createPeriodsDTO(
        application,
        nationalId,
      )

      expect(res).toEqual([
        {
          from: 'date_of_birth',
          to: '2021-11-16',
          ratio: 100,
          approved: false,
          paid: false,
          rightsCodePeriod: null,
        },
        {
          from: '2021-11-17',
          to: '2022-01-01',
          ratio: 100,
          approved: false,
          paid: false,
          rightsCodePeriod: apiConstants.rights.receivingRightsId,
        },
      ])
    })
  })

  describe('sendApplication', () => {
    it('should send an email if applicant is employed by an employer', async () => {
      const application = createApplication()
      set(application.answers, 'employer.isSelfEmployed', NO)
      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({ application, auth })

      // One email to the applicant and one to the employer
      expect(mockedSendEmail.mock.calls.length).toBe(2)
    })

    it('should not send an email if applicant is self employed', async () => {
      const application = createApplication()
      set(application.answers, 'employer.isSelfEmployed', YES)

      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      // Also need to mock the pdf here
      jest
        .spyOn(parentalLeaveService, 'getSelfEmployedPdf')
        .mockImplementation(jest.fn())

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({ application, auth })

      // No email should be sent since applicant is aware of their own approval
      expect(mockedSendEmail.mock.calls.length).toBe(0)
    })
  })
})
