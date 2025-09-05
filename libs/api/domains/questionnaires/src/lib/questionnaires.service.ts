import { LshClientService } from '@island.is/clients/lsh'
import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import {
  Questionnaire,
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../models/questionnaires.model'
import { data as lsh_list_1 } from '../mockdata/lsh_list_1'

const url =
  'https://patientappdevws.landspitali.is/swagger/docs/v2/swagger.json?urls.primaryName=V2'
@Injectable()
export class QuestionnairesService {
  constructor(private api: LshClientService) {}

  async getQuestionnaire(
    user: User,
    id: string,
  ): Promise<Questionnaire | null> {
    // Implementation goes here
    const data = lsh_list_1

    const questionnaire = data.questionnaires.find((q) => q.id === id)
    if (!questionnaire) {
      return null
    }
    return questionnaire as Questionnaire
  }

  async submitQuestionnaire(data: any) {
    // Implementation goes here
  }

  async getQuestionnaires(
    user: User,
    locale: Locale,
  ): Promise<QuestionnairesList | null> {
    // Implementation goes here
    const data = lsh_list_1

    if (!data) {
      return null
    }
    const temp: Questionnaire[] = [
      {
        id: data.questionnaires[0].id || '',
        title: data.questionnaires[0].title || '',
        description: data.questionnaires[0].description || '',
        sentDate: data.questionnaires[0].sentDate || '',
        status: data.questionnaires[0].status,
        organization: data.questionnaires[0].organization || '',
      },
    ]

    return { questionnaires: temp }
  }
}
