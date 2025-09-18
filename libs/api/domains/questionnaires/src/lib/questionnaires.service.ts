import type { User } from '@island.is/auth-nest-tools'
import { LshClientService } from '@island.is/clients/lsh'
import type { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'
import { data as lsh_list_1 } from '../mockdata/lsh_list_1_transformed'
import { data as lsh_list_2 } from '../mockdata/lsh_list_2_transformed'
import { data as EL_list_1 } from '../mockdata/el_list_1_transformed'
import {
  Questionnaire,
  QuestionnairesList,
} from '../models/questionnaires.model'
import { transformQuestionnaireData } from '../mockdata/transform-scripts/transform'
import { LshDevService } from '@island.is/clients/health-directorate'

// Example URL for the LSH API (not used in this mock implementation)
const url =
  'https://patientappdevws.landspitali.is/swagger/docs/v2/swagger.json?urls.primaryName=V2'
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
    // Implementation goes here
    const data = [lsh_list_1, lsh_list_2, EL_list_1].find((list) =>
      list.questionnaires?.some((q) => q.id === id),
    )?.questionnaires[0]

    if (!data) {
      return null
    }

    return {
      id: data.id || '',
      title: data.title || '',
      description: data.description || '',
      sentDate: data.sentDate || '',
      status: data.status,
      organization: data.organization || '',
      questions: data.questions || [],
    }
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
    const data2 = lsh_list_2
    const data3 = EL_list_1

    // const lshForms = await this.lshDevApi.getPatientForms(user)

    // console.log('LSH Forms:', lshForms)

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
      {
        id: data2.questionnaires[0].id || '',
        title: data2.questionnaires[0].title || '',
        description: data2.questionnaires[0].description || '',
        sentDate: data2.questionnaires[0].sentDate || '',
        status: data2.questionnaires[0].status,
        organization: data2.questionnaires[0].organization || '',
      },
      {
        id: data3.questionnaires[0].id || '',
        title: data3.questionnaires[0].title || '',
        description: data3.questionnaires[0].description || '',
        sentDate: data3.questionnaires[0].sentDate || '',
        status: data3.questionnaires[0].status,
        organization: data3.questionnaires[0].organization || '',
      },
    ]

    return { questionnaires: temp }
  }
}
