/* eslint-disable local-rules/disallow-kennitalas */
// The kennitölur below are Fjarskiptastofa gervimaður (test) companies with a
// known access-window verdict in the Fjarskiptastofa test environment. The
// client is mocked here, so they only document which company is expected to be
// allowed through (accessWindowOpen) and which is blocked.
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { Test, TestingModule } from '@nestjs/testing'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { FjarskiptastofaSelfAssessmentClientService } from '@island.is/clients/fjarskiptastofa/self-assessment'
import { SharedTemplateApiService } from '../../../shared'
import { FjarskiptastofaSelfAssessmentService } from './self-assessment.service'

// Fjarskiptastofa gervimaður companies whose access window is open (allowed to
// continue past the prerequisites screen).
const ACCESS_WINDOW_OPEN = ['4703013920', '6211170100']
// ... and whose access window is closed (routed to the "not allowed" screen).
const ACCESS_WINDOW_CLOSED = ['5105160160', '6203170390']

describe('FjarskiptastofaSelfAssessmentService', () => {
  let service: FjarskiptastofaSelfAssessmentService
  let client: FjarskiptastofaSelfAssessmentClientService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FjarskiptastofaSelfAssessmentService,
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: SharedTemplateApiService, useValue: {} },
        {
          provide: FjarskiptastofaSelfAssessmentClientService,
          useValue: {
            isRegulated: jest.fn(),
            getQuestionCategories: jest.fn(),
            getQuestions: jest.fn(),
            submitAnswers: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get(FjarskiptastofaSelfAssessmentService)
    client = module.get(FjarskiptastofaSelfAssessmentClientService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const callGetIsRegulated = (applicant: string) =>
    service.getIsRegulated({
      application: createApplication({ applicant }),
      auth: createCurrentUser(),
      currentUserLocale: 'is',
    } as never)

  describe('getIsRegulated', () => {
    it('should check the regulation status for the company (the applicant)', async () => {
      const auth = createCurrentUser()
      ;(client.isRegulated as jest.Mock).mockResolvedValue({
        isSupervisedEntity: true,
        accessWindowOpen: true,
      })

      await service.getIsRegulated({
        application: createApplication({ applicant: ACCESS_WINDOW_OPEN[0] }),
        auth,
        currentUserLocale: 'is',
      } as never)

      expect(client.isRegulated).toHaveBeenCalledWith(
        auth,
        ACCESS_WINDOW_OPEN[0],
      )
    })

    it.each(ACCESS_WINDOW_OPEN)(
      'should report the access window as open for %s',
      async (applicant) => {
        ;(client.isRegulated as jest.Mock).mockResolvedValue({
          isSupervisedEntity: true,
          accessWindowOpen: true,
        })

        const result = await callGetIsRegulated(applicant)

        expect(result).toEqual({
          isSupervisedEntity: true,
          accessWindowOpen: true,
        })
      },
    )

    it.each(ACCESS_WINDOW_CLOSED)(
      'should report the access window as closed (the prerequisites screen blocks the submit) for %s',
      async (applicant) => {
        ;(client.isRegulated as jest.Mock).mockResolvedValue({
          isSupervisedEntity: true,
          accessWindowOpen: false,
        })

        const result = await callGetIsRegulated(applicant)

        expect(result).toEqual({
          isSupervisedEntity: true,
          accessWindowOpen: false,
        })
      },
    )

    it('should report an unsupervised entity with a closed window', async () => {
      ;(client.isRegulated as jest.Mock).mockResolvedValue({
        isSupervisedEntity: false,
        accessWindowOpen: false,
      })

      const result = await callGetIsRegulated(ACCESS_WINDOW_CLOSED[0])

      expect(result).toEqual({
        isSupervisedEntity: false,
        accessWindowOpen: false,
      })
    })
  })

  describe('submitSelfAssessment', () => {
    const submit = (applicant: string) =>
      service.submitSelfAssessment({
        application: createApplication({
          applicant,
          answers: {
            assessment: {
              // Answered question: submitted.
              q1: { answerValue: 'Yes', remark: 'done' },
              // No answerValue: filtered out of the payload.
              q2: { remark: 'left blank' },
            },
          },
        }),
        auth: createCurrentUser(),
        currentUserLocale: 'en',
      } as never)

    beforeEach(() => {
      ;(client.submitAnswers as jest.Mock).mockResolvedValue({
        referenceNumber: '1',
      })
    })

    it('should submit using the company kennitala of the application as the submitter', async () => {
      await submit(ACCESS_WINDOW_OPEN[0])

      expect(client.submitAnswers).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ submitterSSN: ACCESS_WINDOW_OPEN[0] }),
      )
    })

    it('should send only the answered questions', async () => {
      await submit(ACCESS_WINDOW_OPEN[0])

      expect(client.submitAnswers).toHaveBeenCalledWith(expect.anything(), {
        submitterSSN: ACCESS_WINDOW_OPEN[0],
        assessmentResponses: [
          { questionId: 1, answerValue: 'Yes', remark: 'done' },
        ],
      })
    })

    it('should return the response from the client', async () => {
      const result = await submit(ACCESS_WINDOW_OPEN[0])
      expect(result).toEqual({ referenceNumber: '1' })
    })
  })
})
