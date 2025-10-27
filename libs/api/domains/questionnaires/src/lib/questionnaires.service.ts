import type { User } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'
import {
  QuestionnaireAnsweredInput,
  QuestionnaireInput,
} from './dto/questionnaire.input'

import {
  HealthDirectorateHealthService,
  LshDevService,
  QuestionnaireBaseDto,
  QuestionnaireDetailDto,
} from '@island.is/clients/health-directorate'

import { Questionnaire } from '../models/questionnaire.model'
import {
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../models/questionnaires.model'
import { QuestionnaireSubmission } from '../models/submission.model'
import { mapExternalQuestionnaireToGraphQL } from './transform-mappers/health-directorate/hd-mapper'

@Injectable()
export class QuestionnairesService {
  constructor(
    private readonly lshDevApi: LshDevService,
    private readonly api: HealthDirectorateHealthService,
  ) {}

  async getQuestionnaire(
    _user: User,
    _locale: Locale,
    id: string,
    includeQuestions = false,
  ): Promise<Questionnaire | null> {
    // // Handle error for each client so the other can still succeed
    // const lshDev: Form[] = await this.lshDevApi.getPatientForms(_user)
    // const lshTemp = mapFormsToQuestionnairesList(lshDev)

    // const lshAnswered: Form[] = await this.lshDevApi.getAnsweredForms(_user)
    // const lshAnsweredTransformed = mapFormsToQuestionnairesList(lshAnswered)

    // const lshFound = lshTemp.questionnaires?.find((q) => q.id === id)
    // const answeredLshFound = lshAnsweredTransformed.questionnaires?.find(
    //   (q) => q.id === id,
    // )

    // Prefer answered questionnaire if it exists
    // if (answeredLshFound) {
    //   return answeredLshFound
    // }

    // If neither found, return null

    const data = await this.api.getQuestionnaire(_user, 'is', id)

    if (!data) {
      return null
    }
    return includeQuestions
      ? this.getQuestionnaireWithQuestions(data, _locale)
      : {
          baseInformation: {
            id: data?.questionnaireId ?? id,
            title: data?.title || 'Untitled Questionnaire',
            status:
              (data?.numSubmissions ?? 0) > 0
                ? QuestionnairesStatusEnum.answered
                : QuestionnairesStatusEnum.notAnswered,
            sentDate:
              data?.createdDate?.toISOString() || new Date().toISOString(),
            description: data?.message,
            organization: 'Landlæknir',
          },
        }
  }

  private getQuestionnaireWithQuestions(
    data: QuestionnaireDetailDto,
    _locale: Locale,
  ): Questionnaire {
    return mapExternalQuestionnaireToGraphQL(data, _locale)
  }

  async getAnsweredQuestionnaire(
    user: User,
    _locale: Locale,
    input: QuestionnaireAnsweredInput,
  ): Promise<QuestionnaireSubmission | null> {
    // const lshDevQuestionnaires: QuestionnairesList[] = []

    // // TODO Handle error for each client so the other can still succeed
    // const lshDev: Form[] = await this.lshDevApi.getAnsweredForms(user)
    // const lshTemp = mapFormsToQuestionnairesList(lshDev)

    // const data = lshTemp.questionnaires
    //   ?.map((q) => (q.formId === input.formId ? q : null))
    //   .filter((q) => q !== null)

    // if (!data || data.length === 0) {
    //   return null
    // }

    return null
  }

  async submitQuestionnaire(
    user: User,
    input: QuestionnaireInput,
  ): Promise<boolean> {
    // const lshAnswer = mapToLshAnswer(input)
    // const response = await this.lshDevApi.postPatientForm(
    //   user,
    //   lshAnswer,
    //   lshAnswer.GUID,
    // )
    // // TODO: Fix based on real response, needs typing in client
    // \"{\\\"Status\\\":\\\"0\\\",\\\"Message\\\":\\\"Success\\\"}\""
    return true
  }

  async getQuestionnaires(
    _user: User,
    _locale: Locale,
  ): Promise<QuestionnairesList | null> {
    const data: QuestionnaireBaseDto[] | null =
      await this.api.getQuestionnaires(_user, _locale)

    // const lshDev: Form[] = await this.lshDevApi.getPatientForms(_user)
    // // Transform each LSH Dev questionnaire
    // const lshTransformed = mapFormsToQuestionnairesList(lshDev)

    // const lshAnswered: Form[] = await this.lshDevApi.getAnsweredForms(_user)
    // const lshAnsweredTransformed = mapFormsToQuestionnairesList(lshAnswered)

    // Transform EL questionnaire using the health directorate mapper
    //const elList = createMockElDistressThermometerQuestionnaire()

    // // Combine all questionnaires
    // const allQuestionnaires: Questionnaire[] = [
    //   ...(elListTransformed.questionnaires || []),
    //   ...(elList2Transformed.questionnaires || []),
    //   // ...(lshTransformed.questionnaires || []),
    //   // ...(lshAnsweredTransformed.questionnaires || []),
    // ]

    const allQuestionnaires: QuestionnairesList = {
      questionnaires:
        data?.map((q) => {
          return {
            id: q.questionnaireId,
            title: q.title ?? 'Untitled Questionnaire',
            description: q.message,
            sentDate: new Date().toISOString(),
            organization: 'Landlæknir',
            status:
              q.numSubmissions > 0
                ? QuestionnairesStatusEnum.answered
                : QuestionnairesStatusEnum.notAnswered,
            lastSubmitted: q.lastSubmitted,
          }
        }) || [],
    }

    return { questionnaires: allQuestionnaires.questionnaires }
  }
}
