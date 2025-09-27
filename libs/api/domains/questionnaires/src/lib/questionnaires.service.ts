import type { User } from '@island.is/auth-nest-tools'
import { LshClientService } from '@island.is/clients/lsh'
import type { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'

import { LshDevService } from '@island.is/clients/health-directorate'
import {
  createMockElDistressThermometerQuestionnaire,
  transformHealthDirectorateQuestionnaireToList,
} from '../mappers/health-directorate-client-mapper'
import { transformLshQuestionnaireFromJson } from '../mappers/lsh-questionnaire-mapper'
import { data as lsh_list_1 } from '../mockdata/json/lsh_list_1'
import { data as lsh_list_2 } from '../mockdata/json/lsh_list_2'
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

    const lshList1Transformed = transformLshQuestionnaireFromJson(
      JSON.stringify(lsh_list_1),
    )
    const lshList2Transformed = transformLshQuestionnaireFromJson(
      JSON.stringify(lsh_list_2),
    )
    const data = [
      lshList1Transformed,
      lshList2Transformed,
      elListTransformed,
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
    // Transform LSH questionnaires using the new mapper
    const lshList1Transformed = transformLshQuestionnaireFromJson(
      JSON.stringify(lsh_list_1),
    )
    const lshList2Transformed = transformLshQuestionnaireFromJson(
      JSON.stringify(lsh_list_2),
    )

    // Transform EL questionnaire using the health directorate mapper
    const elList = createMockElDistressThermometerQuestionnaire()
    const elListTransformed =
      transformHealthDirectorateQuestionnaireToList(elList)

    // Combine all questionnaires
    const allQuestionnaires: Questionnaire[] = [
      ...(lshList1Transformed.questionnaires || []),
      ...(lshList2Transformed.questionnaires || []),
      ...(elListTransformed.questionnaires || []),
    ]

    return { questionnaires: allQuestionnaires }
  }
}
