import type { User } from '@island.is/auth-nest-tools'
import { LshClientService } from '@island.is/clients/lsh'
import type { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'

import { Form, LshDevService } from '@island.is/clients/health-directorate'
import {
  createMockElDistressThermometerQuestionnaire,
  createMockElPregnancyQuestionnaire,
  transformHealthDirectorateQuestionnaireToList,
} from '../mappers/health-directorate-client-mapper'
import { transformLshQuestionnaireFromJson } from '../mappers/lsh-questionnaire-mapper'
import {
  Questionnaire,
  QuestionnairesList,
} from '../models/questionnaires.model'

@Injectable()
export class QuestionnairesService {
  constructor(
    private readonly api: LshClientService,
    private readonly lshDevApi: LshDevService,
  ) {}

  async getQuestionnaire(
    user: User,
    id: string,
  ): Promise<Questionnaire | null> {
    const elList = createMockElDistressThermometerQuestionnaire()
    const elListTransformed =
      transformHealthDirectorateQuestionnaireToList(elList)

    const elList2 = createMockElPregnancyQuestionnaire()
    const elList2Transformed =
      transformHealthDirectorateQuestionnaireToList(elList2)

    const lshDevQuestionnaires: QuestionnairesList[] = []

    // Handle error for each client so the other can still succeed
    try {
      const lshDev: Form[] = await this.lshDevApi.getPatientForms(user)
      // Transform each LSH Dev questionnaire
      lshDev?.map((form) =>
        lshDevQuestionnaires.push(
          transformLshQuestionnaireFromJson(form.formJSON),
        ),
      ) || []
    } catch (error) {
      // Handle error (e.g., log it)
    }

    const data = [
      elListTransformed,
      elList2Transformed,
      ...lshDevQuestionnaires,
    ].find((list) =>
      list.questionnaires?.some((q: Questionnaire) => q.id === id),
    )?.questionnaires?.[0]

    if (!data) {
      return null
    }

    return data
  }

  async submitQuestionnaire(data: any) {
    // TODO
  }

  async getQuestionnaires(
    _user: User,
    _locale: Locale,
  ): Promise<QuestionnairesList | null> {
    const lshDevQuestionnaires: QuestionnairesList[] = []

    const lshDev: Form[] = await this.lshDevApi.getPatientForms(_user)

    // Transform each LSH Dev questionnaire

    lshDev?.map((form) =>
      lshDevQuestionnaires.push(
        transformLshQuestionnaireFromJson(form.formJSON),
      ),
    ) || []
    // Filter out questionnaires that don't have an ID
    const validLshDevQuestionnaires = lshDevQuestionnaires.map((list) => ({
      ...list,
      questionnaires:
        list.questionnaires?.filter(
          (questionnaire) =>
            questionnaire.id !== undefined && questionnaire.id !== null,
        ) || [],
    }))
    // Transform EL questionnaire using the health directorate mapper
    const elList = createMockElDistressThermometerQuestionnaire()
    const elListTransformed =
      transformHealthDirectorateQuestionnaireToList(elList)

    const elList2 = createMockElPregnancyQuestionnaire()
    const elList2Transformed =
      transformHealthDirectorateQuestionnaireToList(elList2)
    // Combine all questionnaires
    const allQuestionnaires: Questionnaire[] = [
      ...(elListTransformed.questionnaires || []),
      ...(elList2Transformed.questionnaires || []),
      ...validLshDevQuestionnaires.flatMap((q) => q.questionnaires || []),
    ]

    return { questionnaires: allQuestionnaires }
  }
}
