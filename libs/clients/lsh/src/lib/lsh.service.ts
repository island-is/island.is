import { Injectable } from '@nestjs/common'
import {
  BloodApi,
  GenericStatusResponse,
  Questionnaire,
  QuestionnaireAnswers,
  QuestionnaireApi,
  QuestionnaireBody,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { BloodTypeDto, mapBloodTypeDto } from './dtos/bloodTypes.dto'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class LshClientService {
  constructor(
    private readonly api: BloodApi,
    private readonly questionnaireApi: QuestionnaireApi,
  ) {}

  private bloodTypeWithAuth(auth: Auth) {
    return this.api.withMiddleware(new AuthMiddleware(auth))
  }

  private questionnaireWithAuth(auth: Auth) {
    return this.questionnaireApi.withMiddleware(new AuthMiddleware(auth))
  }

  getBloodType = async (
    user: User,
    locale: string,
  ): Promise<BloodTypeDto | null> => {
    const bloodType = await this.bloodTypeWithAuth(user)
      .apiBloodGet({ locale: locale })
      .catch(handle404)

    if (!bloodType) {
      return null
    }

    return mapBloodTypeDto(bloodType)
  }

  getQuestionnaires = async (
    user: User,
    locale: string,
  ): Promise<Questionnaire[] | null> => {
    return await this.questionnaireWithAuth(user)
      .apiQuestionnaireGet({ locale: locale })
      .catch(handle404)
  }

  getQuestionnaire = async (
    user: User,
    locale: string,
    id: string,
  ): Promise<QuestionnaireBody | null> => {
    return await this.questionnaireWithAuth(user)
      .apiQuestionnaireGuidBodyGet({ locale: locale, guid: id })
      .catch(handle404)
  }

  getAnsweredQuestionnaire = async (
    user: User,
    locale: string,
    id: string,
  ): Promise<QuestionnaireAnswers | null> => {
    return await this.questionnaireWithAuth(user)
      .apiQuestionnaireGuidAnswersGet({ locale: locale, guid: id })
      .catch(handle404)
  }

  postAnsweredQuestionnaire = async (
    user: User,
    locale: string,
    id: string,
    answers: QuestionnaireAnswers,
  ): Promise<GenericStatusResponse> => {
    return await this.questionnaireWithAuth(
      user,
    ).apiQuestionnaireGuidAnswersPost({
      locale: locale,
      guid: id,
      questionnaireAnswers: answers,
    })
  }
}
