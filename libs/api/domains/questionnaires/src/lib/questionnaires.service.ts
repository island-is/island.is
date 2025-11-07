import type { User } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'
import {
  GetQuestionnaireInput,
  QuestionnaireAnsweredInput,
  QuestionnaireInput,
} from './dto/questionnaire.input'

import {
  HealthDirectorateHealthService,
  LshDevService,
  QuestionnaireBaseDto,
  QuestionnaireDetailDto,
} from '@island.is/clients/health-directorate'

import {
  LshClientService,
  Questionnaire as LSHQuestionnaireType,
  QuestionnaireBody,
} from '@island.is/clients/lsh'
import { Questionnaire } from '../models/questionnaire.model'
import {
  QuestionnairesList,
  QuestionnairesOrganizationEnum,
  QuestionnairesStatusEnum,
} from '../models/questionnaires.model'
import { QuestionnaireSubmission } from '../models/submission.model'
import { mapExternalQuestionnaireToGraphQL } from './transform-mappers/health-directorate/hd-mapper'
import { mapLshQuestionnaire } from './transform-mappers/lsh/lsh-mapper'
// import { mapTriggerSourceToGraphQL } from './transform-mappers/health-directorate/hd-gpt-mapper'

@Injectable()
export class QuestionnairesService {
  constructor(
    private readonly lshDevApi: LshDevService,
    private readonly api: HealthDirectorateHealthService,
    private readonly lshApi: LshClientService,
  ) {}

  async getQuestionnaire(
    _user: User,
    _locale: Locale,
    input: GetQuestionnaireInput,
  ): Promise<Questionnaire | null> {
    let LSHdata: LSHQuestionnaireType | null = null
    let LSHdataWithQuestions: QuestionnaireBody | null = null
    let ElData: QuestionnaireDetailDto | null = null

    try {
      if (input.organization === QuestionnairesOrganizationEnum.LSH) {
        input.includeQuestions
          ? (LSHdataWithQuestions = await this.lshApi.getQuestionnaire(
              _user,
              _locale,
              input.id,
            ))
          : (LSHdata = await this.lshApi
              .getQuestionnaires(_user, _locale)
              .then(
                (response) =>
                  response?.find((q) => q.gUID === input.id) || null,
              ))

        return LSHdataWithQuestions
          ? mapLshQuestionnaire(LSHdataWithQuestions)
          : this.getLSHQuestionnaire(_locale, LSHdata)
      }
    } catch (e) {
      console.error('Error fetching LSH questionnaire', e)
    }

    try {
      if (input.organization === QuestionnairesOrganizationEnum.EL) {
        ElData = await this.api.getQuestionnaire(_user, 'is', input.id)
        return this.getELQuestionnaire(_locale, input.includeQuestions, ElData)
      }
    } catch (e) {
      console.error('Error fetching EL questionnaire', e)
    }

    if (!LSHdata && !ElData) {
      return null
    }
    return null
  }

  private getELQuestionnaire(
    _locale: Locale,
    withQuestions?: boolean,
    data?: QuestionnaireDetailDto | null,
  ): Questionnaire | null {
    if (!data) return null
    return withQuestions
      ? mapExternalQuestionnaireToGraphQL(data, _locale)
      : {
          baseInformation: {
            id: data.questionnaireId,
            title: data.title
              ? data.title
              : _locale === 'is'
              ? 'Ónefndur spurningalisti'
              : 'Untitled questionnaire',
            sentDate: data.lastSubmitted?.toDateString() || '',
            status: QuestionnairesStatusEnum.notAnswered,
            description: data.message || undefined,
            organization: QuestionnairesOrganizationEnum.EL,
          },
        }
  }

  private getLSHQuestionnaire(
    _locale: Locale,
    data?: LSHQuestionnaireType | null | undefined,
  ): Questionnaire | null {
    if (!data) return null
    return {
      baseInformation: {
        id: data.gUID || 'undefined-id',
        title: data.caption
          ? data.caption
          : _locale === 'is'
          ? 'Ónefndur spurningalisti'
          : 'Untitled questionnaire',
        status: data.answerDateTime
          ? QuestionnairesStatusEnum.answered
          : new Date(data.validToDateTime) < new Date()
          ? QuestionnairesStatusEnum.expired
          : QuestionnairesStatusEnum.notAnswered,
        sentDate: data.validFromDateTime?.toISOString() || '',
        description: data.description || undefined,
        organization: QuestionnairesOrganizationEnum.LSH,
      },
    }
  }

  async getAnsweredQuestionnaire(
    user: User,
    _locale: Locale,
    input: QuestionnaireAnsweredInput,
  ): Promise<QuestionnaireSubmission | null> {
    // const lshDevQuestionnaires: QuestionnairesList[] = []

    // // TODO Handle error for each client so the other can still succeed
    // const lshDev: Form[] = await this.lshDevApi.getAnsweredForms(user)
    // const lshTemp = mapFormsToQuestionnairesList(lshDev)

    // const data = lshTemp.questionnaires
    //   ?.map((q) => (q.formId === input.formId ? q : null))
    //   .filter((q) => q !== null)

    // if (!data || data.length === 0) {
    //   return null
    // }

    return null
  }

  async submitQuestionnaire(
    user: User,
    input: QuestionnaireInput,
  ): Promise<boolean> {
    // const lshAnswer = mapToLshAnswer(input)
    // const response = await this.lshDevApi.postPatientForm(
    //   user,
    //   lshAnswer,
    //   lshAnswer.GUID,
    // )
    // // TODO: Fix based on real response, needs typing in client
    // \"{\\\"Status\\\":\\\"0\\\",\\\"Message\\\":\\\"Success\\\"}\""
    return true
  }

  async getQuestionnaires(
    _user: User,
    _locale: Locale,
  ): Promise<QuestionnairesList | null> {
    const data: QuestionnaireBaseDto[] | null =
      await this.api.getQuestionnaires(_user, _locale)

    const lshData: LSHQuestionnaireType[] | null =
      await this.lshApi.getQuestionnaires(_user, 'is')

    let ELquestionnaires: QuestionnairesList = { questionnaires: [] }
    try {
      ELquestionnaires = {
        questionnaires:
          data?.map((q) => {
            return {
              id: q.questionnaireId,
              title: q.title
                ? q.title
                : _locale === 'is'
                ? 'Ónefndur spurningalisti'
                : 'Untitled questionnaire',
              description: q.message,
              sentDate: q.lastSubmitted?.toDateString() || '',
              organization: QuestionnairesOrganizationEnum.EL,
              department: undefined,
              status:
                q.numSubmissions > 0
                  ? QuestionnairesStatusEnum.answered
                  : QuestionnairesStatusEnum.notAnswered,
              lastSubmitted: q.lastSubmitted,
            }
          }) || [],
      }
    } catch (e) {
      console.error('Error fetching questionnaires', e)
      return null
    }

    let LSHquestionnaires: QuestionnairesList = { questionnaires: [] }
    try {
      LSHquestionnaires = {
        questionnaires:
          lshData
            ?.filter((item: LSHQuestionnaireType) => item.gUID != null)
            .map((item: LSHQuestionnaireType) => {
              return {
                id: item.gUID || 'undefined-id',
                title: item.caption ? item.caption : 'Spurningalisti',
                description: item.description ?? undefined,
                sentDate: item.validFromDateTime.toISOString(),
                organization: QuestionnairesOrganizationEnum.LSH,
                department: item.department ?? undefined,
                status: item.answerDateTime
                  ? QuestionnairesStatusEnum.answered
                  : new Date(item.validToDateTime) < new Date()
                  ? QuestionnairesStatusEnum.expired
                  : QuestionnairesStatusEnum.notAnswered,
              }
            }) || [],
      }
    } catch (e) {
      console.error('Error fetching questionnaires', e)
      return null
    }

    const allLists = [ELquestionnaires, LSHquestionnaires]

    return {
      questionnaires: allLists
        .flatMap((list) => list.questionnaires)
        .filter((q) => q !== undefined),
    }
  }
}
