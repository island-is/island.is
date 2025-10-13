import type { User } from '@island.is/auth-nest-tools'
import { LshClientService } from '@island.is/clients/lsh'
import type { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'
import {
  QuestionnaireAnsweredInput,
  QuestionnaireInput,
} from './dto/questionnaire.input'

import { Form, LshDevService } from '@island.is/clients/health-directorate'

import {
  Questionnaire,
  QuestionnairesList,
} from '../models/questionnaires.model'
import {
  createMockElDistressThermometerQuestionnaire,
  createMockElPregnancyQuestionnaire,
  mapExternalQuestionnairesToList,
} from './transform-mappers/health-directorate/hd-mapper'
import { mapToLshAnswer } from './transform-mappers/lsh/lsh-input-mapper'
import { mapFormsToQuestionnairesList } from './transform-mappers/lsh/lsh-mapper'

@Injectable()
export class QuestionnairesService {
  constructor(
    private readonly api: LshClientService,
    private readonly lshDevApi: LshDevService,
  ) {}

  async getQuestionnaire(
    _user: User,
    id: string,
  ): Promise<Questionnaire | null> {
    const elList = createMockElDistressThermometerQuestionnaire()
    const elListTransformed = mapExternalQuestionnairesToList([elList])

    const elList2 = createMockElPregnancyQuestionnaire()
    const elList2Transformed = mapExternalQuestionnairesToList([elList2])

    // Handle error for each client so the other can still succeed
    const lshDev: Form[] = await this.lshDevApi.getPatientForms(_user)
    const lshTemp = mapFormsToQuestionnairesList(lshDev)

    const lshAnswered: Form[] = await this.lshDevApi.getAnsweredForms(_user)
    const lshAnsweredTransformed = mapFormsToQuestionnairesList(lshAnswered)

    const data = [elListTransformed, elList2Transformed].find((list) =>
      list.questionnaires?.some((q: Questionnaire) => q.id === id),
    )?.questionnaires?.[0]

    const lshFound = lshTemp.questionnaires?.find((q) => q.id === id)
    const answeredLshFound = lshAnsweredTransformed.questionnaires?.find(
      (q) => q.id === id,
    )

    // Prefer answered questionnaire if it exists
    if (answeredLshFound) {
      return answeredLshFound
    }

    // If neither found, return null

    if (!data && !lshFound) {
      return null
    }

    return (data || lshFound) ?? null
  }

  async getAnsweredQuestionnaires(
    user: User,
    _locale: Locale,
    input: QuestionnaireAnsweredInput,
  ): Promise<Questionnaire[] | null> {
    const lshDevQuestionnaires: QuestionnairesList[] = []

    // TODO Handle error for each client so the other can still succeed
    const lshDev: Form[] = await this.lshDevApi.getAnsweredForms(user)
    const lshTemp = mapFormsToQuestionnairesList(lshDev)

    const data = lshTemp.questionnaires
      ?.map((q) => (q.formId === input.formId ? q : null))
      .filter((q) => q !== null)

    if (!data || data.length === 0) {
      return null
    }

    return data
  }

  async submitQuestionnaire(
    user: User,
    input: QuestionnaireInput,
  ): Promise<boolean> {
    const lshAnswer = mapToLshAnswer(input)
    const response = await this.lshDevApi.postPatientForm(
      user,
      lshAnswer,
      lshAnswer.GUID,
    )
    // TODO: Fix based on real response, needs typing in client
    // \"{\\\"Status\\\":\\\"0\\\",\\\"Message\\\":\\\"Success\\\"}\""
    return true
  }

  async getQuestionnaires(
    _user: User,
    _locale: Locale,
  ): Promise<QuestionnairesList | null> {
    const lshDev: Form[] = await this.lshDevApi.getPatientForms(_user)
    // Transform each LSH Dev questionnaire
    const lshTransformed = mapFormsToQuestionnairesList(lshDev)

    const lshAnswered: Form[] = await this.lshDevApi.getAnsweredForms(_user)
    const lshAnsweredTransformed = mapFormsToQuestionnairesList(lshAnswered)

    // Transform EL questionnaire using the health directorate mapper
    const elList = createMockElDistressThermometerQuestionnaire()
    const elListTransformed = mapExternalQuestionnairesToList([elList])

    const elList2 = createMockElPregnancyQuestionnaire()
    const elList2Transformed = mapExternalQuestionnairesToList([elList2])

    // Combine all questionnaires
    const allQuestionnaires: Questionnaire[] = [
      ...(elListTransformed.questionnaires || []),
      ...(elList2Transformed.questionnaires || []),
      ...(lshTransformed.questionnaires || []),
      ...(lshAnsweredTransformed.questionnaires || []),
    ]

    return { questionnaires: allQuestionnaires }
  }
}
