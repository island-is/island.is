import { createApplication } from '@island.is/application/testing'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { Test, TestingModule } from '@nestjs/testing'
import { FjarskiptastofaSelfAssessmentClientService } from '@island.is/clients/fjarskiptastofa/self-assessment'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { m } from '@island.is/application/templates/fjarskiptastofa/self-assessment'
import { SharedTemplateApiService } from '../../../shared'
import { FjarskiptastofaSelfAssessmentService } from './self-assessment.service'

// The company the application belongs to. The client is mocked here, so any
// valid company kennitala will do; the Fjarskiptastofa test companies with a
// known access-window verdict are listed in the template README.
const COMPANY_SSN = createNationalId('company')

describe('FjarskiptastofaSelfAssessmentService', () => {
  let service: FjarskiptastofaSelfAssessmentService
  let client: FjarskiptastofaSelfAssessmentClientService
  let logger: { warn: jest.Mock; error: jest.Mock; info: jest.Mock }

  beforeEach(async () => {
    logger = { warn: jest.fn(), error: jest.fn(), info: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FjarskiptastofaSelfAssessmentService,
        { provide: SharedTemplateApiService, useValue: {} },
        { provide: LOGGER_PROVIDER, useValue: logger },
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

  describe('getIsRegulated', () => {
    it('should check the regulation status for the company (the applicant)', async () => {
      const auth = createCurrentUser()
      ;(client.isRegulated as jest.Mock).mockResolvedValue({
        isSupervisedEntity: true,
        accessWindowOpen: true,
      })

      await service.getIsRegulated({
        application: createApplication({ applicant: COMPANY_SSN }),
        auth,
        currentUserLocale: 'is',
      } as never)

      expect(client.isRegulated).toHaveBeenCalledWith(auth, COMPANY_SSN)
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
      await submit(COMPANY_SSN)

      expect(client.submitAnswers).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ submitterSSN: COMPANY_SSN }),
      )
    })

    it('should send an answer for every question the applicant was shown', async () => {
      await submit(COMPANY_SSN)

      expect(client.submitAnswers).toHaveBeenCalledWith(expect.anything(), {
        language: 'en',
        submitterSSN: COMPANY_SSN,
        assessmentResponses: [
          { questionId: 1, answerValue: 'Yes', remark: 'done' },
          { questionId: 2, answerValue: 'No', remark: 'not started' },
        ],
      })
    })

    it('should ignore stored answers to questions that are no longer asked', async () => {
      await submitWith(
        COMPANY_SSN,
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
      const result = await submit(COMPANY_SSN)
      expect(result).toEqual({ referenceNumber: '1' })
    })

    // The form blocks an incomplete submit; these cover a submit that gets
    // past it, which must not reach Fjarskiptastofa as a finished assessment.
    it.each<[string, StoredAnswers]>([
      [
        'an unanswered question',
        { q1: { answerValue: 'Yes', remark: 'done' } },
      ],
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
      await expect(submitWith(COMPANY_SSN, answers)).rejects.toThrow()

      expect(client.submitAnswers).not.toHaveBeenCalled()
    })

    // The submitted answers and remarks are the sensitive part of this
    // application. Fjarskiptastofa answers a failed request with problem+json
    // that can quote them, and a FetchError carries that body on `.problem`.
    // Because `problem` is what makes TemplateAPIService.handleError treat an
    // error as a TemplateApiError, letting the FetchError through would both
    // show it to the applicant and log it verbatim (`{ ...error }`) on 5xx.
    describe('when the submit call fails', () => {
      // Shaped like the FetchError enhanced fetch throws for a 5xx problem+json.
      const upstreamError = () =>
        Object.assign(new Error('Request failed with status code 500'), {
          name: 'FetchError',
          status: 500,
          problem: {
            type: 'https://fjarskiptastofa.is/problem',
            title: 'Internal Server Error',
            status: 500,
            detail: "Could not store remark 'we have no MFA on the admin VPN'",
          },
          body: { remark: 'we have no MFA on the admin VPN' },
        })

      beforeEach(() => {
        ;(client.submitAnswers as jest.Mock).mockRejectedValue(upstreamError())
      })

      it('should throw a TemplateApiError with our own message', async () => {
        const error = await submit(COMPANY_SSN).catch((e) => e)

        expect(error).toBeInstanceOf(TemplateApiError)
        expect(error.problem.errorReason).toEqual({
          title: m.apiErrors.submitTitle,
          summary: m.apiErrors.submitSummary,
        })
      })

      it('should log the failure by shape only, never its contents', async () => {
        await submit(COMPANY_SSN).catch(() => undefined)

        expect(logger.warn).toHaveBeenCalledWith(
          'Fjarskiptastofa self-assessment request failed',
          {
            action: 'submitSelfAssessment',
            errorName: 'FetchError',
            status: 500,
          },
        )

        // Whatever was logged must not quote the applicant's answers.
        const logged = JSON.stringify(logger.warn.mock.calls)
        expect(logged).not.toContain('MFA on the admin VPN')
        expect(logged).not.toContain('Could not store remark')
      })

      it('should not carry the upstream problem body on the thrown error', async () => {
        const error = await submit(COMPANY_SSN).catch((e) => e)

        // Nothing the applicant wrote may survive onto the error, including
        // through the `{ ...error }` spread that handleError logs on 5xx.
        const serialised = JSON.stringify({ ...error, problem: error.problem })

        expect(serialised).not.toContain('MFA on the admin VPN')
        expect(serialised).not.toContain('Could not store remark')
        expect(error.body).toBeUndefined()
        expect(error.problem.detail).toBeUndefined()
      })
    })

    it('should not submit when the questions are missing from external data', async () => {
      await expect(
        service.submitSelfAssessment({
          application: createApplication({
            applicant: COMPANY_SSN,
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
