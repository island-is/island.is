import { LshClientService } from '@island.is/clients/lsh'
import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import {
  Questionnaire,
  QuestionnariesList,
  QuestionnariesStatusEnum,
} from '../models/questionnaries.model'

const url =
  'https://patientappdevws.landspitali.is/swagger/docs/v2/swagger.json?urls.primaryName=V2'
@Injectable()
export class QuestionnariesService {
  constructor(private api: LshClientService) {}
  async getQuestionnaire(id: string) {
    // Implementation goes here
  }

  async submitQuestionnaire(data: any) {
    // Implementation goes here
  }

  async getQuestionnaires(
    user: User,
    locale: Locale,
  ): Promise<QuestionnariesList | null> {
    // Implementation goes here
    const data = await this.api.getQuestionnaries(user, locale)

    if (!data) {
      return null
    }
    const temp: Questionnaire[] = data.map((item) => {
      const isExpired = new Date(item.validToDateTime) < new Date()

      return {
        id: item.gUID || '',
        title: item.caption || '',
        description: item.description || '',
        sentDate: item.validFromDateTime?.toISOString() || '',
        status: isExpired
          ? QuestionnariesStatusEnum.expired
          : item.answersJSON
          ? QuestionnariesStatusEnum.answered
          : QuestionnariesStatusEnum.notAnswered,
        organization: item.location || '',
      }
    })
    return { questionnaires: temp }
  }
}
