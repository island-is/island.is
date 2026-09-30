import { Test, TestingModule } from '@nestjs/testing'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { ApplicationTypes } from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { SeminarsClientService } from '@island.is/clients/seminars-ver'
import { SeminarsTemplateService } from './seminars.service'
import {
  IndividualOrCompany,
  PaymentOptions,
  RegisterNumber,
} from '@island.is/application/templates/aosh/seminars'

describe('SeminarsTemplateService', () => {
  let service: SeminarsTemplateService

  const mockAuth = createCurrentUser({
    nationalId: '0101302399',
    scope: ['@island.is/applications:write'],
  })

  const mockRegisterSeminar = jest.fn()
  const mockGetSeminar = jest.fn()
  const mockCheckIndividuals = jest.fn()

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeminarsTemplateService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: SeminarsClientService,
          useValue: {
            registerSeminar: mockRegisterSeminar,
            getSeminar: mockGetSeminar,
            checkIndividuals: mockCheckIndividuals,
          },
        },
      ],
    }).compile()

    service = module.get<SeminarsTemplateService>(SeminarsTemplateService)
  })

  describe('submitApplication', () => {
    it('should send empty paymentId when paymentOptions is putIntoAccount, even if createCharge ID is present in externalData', async () => {
      mockRegisterSeminar.mockResolvedValue(undefined)

      const application = createApplication({
        typeId: ApplicationTypes.SEMINAR_REGISTRATION,
        answers: {
          initialQuery: 'course-123',
          applicant: {
            name: 'Jón Jónsson',
            nationalId: '0101302399',
            email: 'jon@example.is',
            phoneNumber: '5812345',
            registerManyQuestion: RegisterNumber.one,
          },
          paymentArrangement: {
            individualOrCompany: IndividualOrCompany.company,
            paymentOptions: PaymentOptions.putIntoAccount,
            companyInfo: {
              name: 'Fyrirtæki ehf.',
              nationalId: '5001012880',
            },
            contactInfo: {
              email: 'bokhald@fyrirtaeki.is',
              phone: '5551234',
            },
            explanation: 'Reikningur takk',
          },
        },
        externalData: {
          createCharge: {
            data: {
              id: 'stale-cancelled-charge-id',
              paymentUrl: 'https://island.is/greida/is/fake',
            },
            date: new Date(),
            status: 'success',
          },
        },
      })

      await service.submitApplication({
        application,
        auth: mockAuth,
        currentUserLocale: 'is',
      })

      expect(mockRegisterSeminar).toHaveBeenCalledTimes(1)
      expect(mockRegisterSeminar).toHaveBeenCalledWith(
        mockAuth,
        expect.objectContaining({
          courseRegistrationCreateDTO: expect.objectContaining({
            courseId: 'course-123',
            paymentInfo: {
              companyNationalId: '5001012880',
              paymentId: '',
              paymentExplanation: 'Reikningur takk',
            },
            paymentContact: {
              email: 'bokhald@fyrirtaeki.is',
              phoneNumber: '5551234',
            },
            students: [
              {
                name: 'Jón Jónsson',
                nationalId: '0101302399',
                email: 'jon@example.is',
                phoneNumber: '5812345',
              },
            ],
          }),
        }),
      )
    })

    it('should send chargeId when paymentOptions is cashOnDelivery', async () => {
      mockRegisterSeminar.mockResolvedValue(undefined)

      const application = createApplication({
        typeId: ApplicationTypes.SEMINAR_REGISTRATION,
        answers: {
          initialQuery: 'course-456',
          applicant: {
            name: 'Gunnar Gunnarsson',
            nationalId: '0202302499',
            email: 'gunnar@example.is',
            phoneNumber: '5812345',
            registerManyQuestion: RegisterNumber.one,
          },
          paymentArrangement: {
            individualOrCompany: IndividualOrCompany.company,
            paymentOptions: PaymentOptions.cashOnDelivery,
            companyInfo: {
              name: 'Annad Fyrirtaeki hf.',
              nationalId: '6002023990',
            },
            contactInfo: {
              email: 'gunnar@fyrirtaeki.is',
              phone: '5812345',
            },
            explanation: '',
          },
        },
        externalData: {
          createCharge: {
            data: {
              id: 'actual-charge-id-456',
              paymentUrl: 'https://island.is/greida/is/fake',
            },
            date: new Date(),
            status: 'success',
          },
        },
      })

      await service.submitApplication({
        application,
        auth: mockAuth,
        currentUserLocale: 'is',
      })

      expect(mockRegisterSeminar).toHaveBeenCalledWith(
        mockAuth,
        expect.objectContaining({
          courseRegistrationCreateDTO: expect.objectContaining({
            courseId: 'course-456',
            paymentInfo: {
              companyNationalId: '6002023990',
              paymentId: 'actual-charge-id-456',
              paymentExplanation: '',
            },
          }),
        }),
      )
    })

    it('should send chargeId when applicant is an individual', async () => {
      mockRegisterSeminar.mockResolvedValue(undefined)

      const application = createApplication({
        typeId: ApplicationTypes.SEMINAR_REGISTRATION,
        answers: {
          initialQuery: 'course-789',
          applicant: {
            name: 'Sigurður Sigurðsson',
            nationalId: '0303302599',
            email: 'siggi@example.is',
            phoneNumber: '5812345',
            registerManyQuestion: RegisterNumber.one,
          },
        },
        externalData: {
          createCharge: {
            data: {
              id: 'individual-charge-id-789',
              paymentUrl: 'https://island.is/greida/is/fake',
            },
            date: new Date(),
            status: 'success',
          },
        },
      })

      await service.submitApplication({
        application,
        auth: mockAuth,
        currentUserLocale: 'is',
      })

      expect(mockRegisterSeminar).toHaveBeenCalledWith(
        mockAuth,
        expect.objectContaining({
          courseRegistrationCreateDTO: expect.objectContaining({
            courseId: 'course-789',
            paymentInfo: {
              companyNationalId: '',
              paymentId: 'individual-charge-id-789',
              paymentExplanation: '',
            },
            paymentContact: {
              email: 'siggi@example.is',
              phoneNumber: '5812345',
            },
          }),
        }),
      )
    })

    it('should map participantList when registerMany is selected', async () => {
      mockRegisterSeminar.mockResolvedValue(undefined)

      const application = createApplication({
        typeId: ApplicationTypes.SEMINAR_REGISTRATION,
        answers: {
          initialQuery: 'course-many',
          applicant: {
            name: 'Tengiliður',
            nationalId: '0101302399',
            email: 'tengilidur@example.is',
            phoneNumber: '5812345',
            registerManyQuestion: RegisterNumber.many,
          },
          participantList: [
            {
              nationalIdWithName: {
                name: 'Nemandi 1',
                nationalId: '1111111119',
              },
              email: 'nemandi1@example.is',
              phoneNumber: '5811111',
            },
            {
              nationalIdWithName: {
                name: 'Nemandi 2',
                nationalId: '2222222229',
              },
              email: 'nemandi2@example.is',
              phoneNumber: '5822222',
            },
          ],
          paymentArrangement: {
            individualOrCompany: IndividualOrCompany.company,
            paymentOptions: PaymentOptions.putIntoAccount,
            companyInfo: {
              name: 'Fyrirtæki ehf.',
              nationalId: '5001012880',
            },
            contactInfo: {
              email: 'bokhald@fyrirtaeki.is',
              phone: '5551234',
            },
          },
        },
      })

      await service.submitApplication({
        application,
        auth: mockAuth,
        currentUserLocale: 'is',
      })

      expect(mockRegisterSeminar).toHaveBeenCalledWith(
        mockAuth,
        expect.objectContaining({
          courseRegistrationCreateDTO: expect.objectContaining({
            students: [
              {
                name: 'Nemandi 1',
                nationalId: '1111111119',
                email: 'nemandi1@example.is',
                phoneNumber: '5811111',
              },
              {
                name: 'Nemandi 2',
                nationalId: '2222222229',
                email: 'nemandi2@example.is',
                phoneNumber: '5822222',
              },
            ],
          }),
        }),
      )
    })
  })
})
