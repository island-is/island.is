import type { User } from '@island.is/auth-nest-tools'
import { LshClientService } from '@island.is/clients/lsh'
import type { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'
import { QuestionnaireInput } from './dto/questionnaire.input'

import { Form, LshDevService } from '@island.is/clients/health-directorate'

import {
  Questionnaire,
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../models/questionnaires.model'
import {
  createMockElDistressThermometerQuestionnaire,
  createMockElPregnancyQuestionnaire,
  mapExternalQuestionnairesToList,
} from './transform-mappers/health-directorate/hd-mapper'
import { mapFormsToQuestionnairesList } from './transform-mappers/lsh/lsh-mapper'
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
    const elListTransformed = mapExternalQuestionnairesToList([elList])

    const elList2 = createMockElPregnancyQuestionnaire()
    const elList2Transformed = mapExternalQuestionnairesToList([elList2])

    const lshDevQuestionnaires: QuestionnairesList[] = []

    // Handle error for each client so the other can still succeed
    const lshDev: Form[] = await this.lshDevApi.getPatientForms(user)
    const lshTemp = mapFormsToQuestionnairesList(lshDev)

    const data = [
      elListTransformed,
      elList2Transformed,
      ...lshDevQuestionnaires,
    ].find((list) =>
      list.questionnaires?.some((q: Questionnaire) => q.id === id),
    )?.questionnaires?.[0]

    const lshFound = lshTemp.questionnaires?.find((q) => q.id === id)

    if (!data && !lshFound) {
      return null
    }

    return (data || lshFound) ?? null
  }

  async submitQuestionnaire(
    user: User,
    input: QuestionnaireInput,
  ): Promise<Questionnaire | null> {
    // Get the original questionnaire
    const questionnaires: Form[] = await this.lshDevApi.getPatientForms(user)
    const questionnaire = questionnaires.find((q) => q.gUID === input.id)
    if (!questionnaire) {
      return null
    }
    const parsedFormJSON = questionnaire?.formJSON
      ? JSON.parse(questionnaire.formJSON)
      : null

    // TODO: Submit to actual backend service here
    //await this.lshDevApi.postPatientForm(user, parsedFormJSON)
    // For now, return the questionnaire with CurrentValues added but without sections in response
    return {
      id: input.id,
      title: questionnaire.caption || 'Submitted Questionnaire',
      sentDate: new Date().toISOString(),
      status: QuestionnairesStatusEnum.answered,
      // Sections are excluded from response as requested
    }
  }

  async getQuestionnaires(
    _user: User,
    _locale: Locale,
  ): Promise<QuestionnairesList | null> {
    const lshDev: Form[] = await this.lshDevApi.getPatientForms(_user)

    // Transform each LSH Dev questionnaire
    const lshTemp = mapFormsToQuestionnairesList(lshDev)

    // Transform EL questionnaire using the health directorate mapper
    const elList = createMockElDistressThermometerQuestionnaire()
    const elListTransformed = mapExternalQuestionnairesToList([elList])

    const elList2 = createMockElPregnancyQuestionnaire()
    const elList2Transformed = mapExternalQuestionnairesToList([elList2])

    // Combine all questionnaires
    const allQuestionnaires: Questionnaire[] = [
      ...(elListTransformed.questionnaires || []),
      ...(elList2Transformed.questionnaires || []),
      ...(lshTemp.questionnaires || []),
    ]

    return { questionnaires: allQuestionnaires }
  }
}
