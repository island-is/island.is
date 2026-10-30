/* eslint-disable local-rules/disallow-kennitalas */
// The kennitölur below are Fjarskiptastofa gervimaður (test) companies with a
// known access-window verdict in the Fjarskiptastofa test environment. The
// client is mocked here, so they only document which company is expected to be
// allowed through (accessWindowOpen) and which is blocked.
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { Test, TestingModule } from '@nestjs/testing'
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
    // The questions the applicant was shown, as the questions data provider
    // stores them in externalData.
    const questionsExternalData = (ids: number[]) => ({
      selfAssessmentQuestions: {
        data: { questions: ids.map((id) => ({ id })) },
        date: new Date(),
        status: 'success' as const,
      },
    })

    type StoredAnswers = Record<
      string,
      { answerValue?: string; remark?: string }
    >

    const submitWith = (
      applicant: string,
      answers: StoredAnswers,
      questionIds: number[] = [1, 2],
    ) =>
      service.submitSelfAssessment({
        application: createApplication({
          applicant,
          answers: { assessment: answers },
          externalData: questionsExternalData(questionIds),
        }),
        auth: createCurrentUser(),
        currentUserLocale: 'en',
      } as never)

    const completeAnswers = {
      q1: { answerValue: 'Yes', remark: 'done' },
      q2: { answerValue: 'No', remark: 'not started' },
    }

    const submit = (applicant: string) => submitWith(applicant, completeAnswers)

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

    it('should send an answer for every question the applicant was shown', async () => {
      await submit(ACCESS_WINDOW_OPEN[0])

      expect(client.submitAnswers).toHaveBeenCalledWith(expect.anything(), {
        language: 'en',
        submitterSSN: ACCESS_WINDOW_OPEN[0],
        assessmentResponses: [
          { questionId: 1, answerValue: 'Yes', remark: 'done' },
          { questionId: 2, answerValue: 'No', remark: 'not started' },
        ],
      })
    })

    it('should ignore stored answers to questions that are no longer asked', async () => {
      await submitWith(
        ACCESS_WINDOW_OPEN[0],
        { ...completeAnswers, q99: { answerValue: 'Yes', remark: 'stale' } },
        [1, 2],
      )

      expect(client.submitAnswers).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          assessmentResponses: [
            { questionId: 1, answerValue: 'Yes', remark: 'done' },
            { questionId: 2, answerValue: 'No', remark: 'not started' },
          ],
        }),
      )
    })

    it('should return the response from the client', async () => {
      const result = await submit(ACCESS_WINDOW_OPEN[0])
      expect(result).toEqual({ referenceNumber: '1' })
    })

    // The form blocks an incomplete submit; these cover a submit that gets
    // past it, which must not reach Fjarskiptastofa as a finished assessment.
    it.each<[string, StoredAnswers]>([
      ['an unanswered question', { q1: { answerValue: 'Yes', remark: 'done' } }],
      [
        'a question with no answer value',
        { ...completeAnswers, q2: { remark: 'left blank' } },
      ],
      [
        'a question with a blank remark',
        { ...completeAnswers, q2: { answerValue: 'No', remark: '  ' } },
      ],
      [
        'a question with no remark',
        { ...completeAnswers, q2: { answerValue: 'No' } },
      ],
    ])('should not submit an assessment with %s', async (_, answers) => {
      await expect(submitWith(ACCESS_WINDOW_OPEN[0], answers)).rejects.toThrow()

      expect(client.submitAnswers).not.toHaveBeenCalled()
    })

    it('should not submit when the questions are missing from external data', async () => {
      await expect(
        service.submitSelfAssessment({
          application: createApplication({
            applicant: ACCESS_WINDOW_OPEN[0],
            answers: { assessment: completeAnswers },
          }),
          auth: createCurrentUser(),
          currentUserLocale: 'en',
        } as never),
      ).rejects.toThrow()

      expect(client.submitAnswers).not.toHaveBeenCalled()
    })
  })
})
