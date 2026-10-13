import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  AnswersRequest,
  AnswersResponse,
  IsRegulatedResponse,
  QuestionCategoriesResponse,
  QuestionsResponse,
  SelfAssessmentApi,
} from '../../gen/fetch'

@Injectable()
export class FjarskiptastofaSelfAssessmentClientService {
  constructor(private readonly selfAssessmentApi: SelfAssessmentApi) {}

  private apiWithAuth = (user: User) =>
    this.selfAssessmentApi.withMiddleware(new AuthMiddleware(user as Auth))

  async isRegulated(auth: User, ssn: string): Promise<IsRegulatedResponse> {
    return this.apiWithAuth(auth).getIsRegulated({ sSN: ssn })
  }

  async getQuestionCategories(auth: User): Promise<QuestionCategoriesResponse> {
    return this.apiWithAuth(auth).getQuestionCategories()
  }

  async getQuestions(
    auth: User,
    language?: string,
  ): Promise<QuestionsResponse> {
    return this.apiWithAuth(auth).getQuestions({ language })
  }

  async submitAnswers(
    auth: User,
    answersRequest: AnswersRequest,
  ): Promise<AnswersResponse> {
    return this.apiWithAuth(auth).submitAnswers({ answersRequest })
  }
}
