import { Injectable } from '@nestjs/common'

const url =
  'https://patientappdevws.landspitali.is/swagger/docs/v2/swagger.json?urls.primaryName=V2'
@Injectable()
export class QuestionnariesService {
  async getQuestionnaire(id: string) {
    // Implementation goes here
  }

  async submitQuestionnaire(data: any) {
    // Implementation goes here
  }

  async getQuestionnaires() {
    // Implementation goes here
  }
}
