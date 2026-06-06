import {
  QuestionnaireAnswerOptionType,
  QuestionnaireQuestionnairesOrganizationEnum,
} from '@island.is/api/schema'
import { Box, LoadingDots, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  GenericQuestionnaire,
  m,
  QuestionAnswer,
} from '@island.is/portals/my-pages/core'
import { useOrganizations } from '@island.is/portals/my-pages/graphql'
import { Problem } from '@island.is/react-spa/shared'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { FC, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../..'
import { HealthPaths } from '../../lib/paths'
import * as styles from './Questionnaires.css'
import {
  useGetQuestionnaireWithQuestionsQuery,
  useSubmitQuestionnaireMutation,
} from './questionnaires.generated'

const AnswerQuestionnaire: FC = () => {
  useNamespaces('sp.health')
  const { id, org } = useParams<{ id?: string; org?: string }>()
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const { data: organizations } = useOrganizations()
  const [submitQuestionnaire, { loading: submitting }] =
    useSubmitQuestionnaireMutation({
      refetchQueries: ['GetQuestionnaire'],
      awaitRefetchQueries: true,
    })

  const organization: QuestionnaireQuestionnairesOrganizationEnum =
    org === 'lsh'
      ? QuestionnaireQuestionnairesOrganizationEnum.LSH
      : QuestionnaireQuestionnairesOrganizationEnum.EL

  const { data, loading, error } = useGetQuestionnaireWithQuestionsQuery({
    variables: {
      input: {
        id: id ?? '',
        organization,
        includeQuestions: true,
      },
      locale: lang,
    },
    fetchPolicy: 'network-only',
    skip: !id,
  })

  const questionnaire = data?.questionnairesDetail

  const isValidQuestionnaireAnswerType = (
    type: string,
  ): type is QuestionnaireAnswerOptionType => {
    return Object.values(QuestionnaireAnswerOptionType).includes(
      type as QuestionnaireAnswerOptionType,
    )
  }

  const initialAnswers = useMemo(() => {
    if (!questionnaire?.draftAnswers?.length) return undefined

    // Build maps from originalId (or id) → compound question.id and → label
    const originalIdToCompoundId: { [key: string]: string } = {}
    const questionLabels: { [key: string]: string } = {}
    questionnaire.sections?.forEach((section) => {
      section.questions?.forEach((q) => {
        const key = q.originalId ?? q.id
        originalIdToCompoundId[key] = q.id
        questionLabels[q.id] = q.label
      })
    })

    return questionnaire.draftAnswers.reduce<{ [key: string]: QuestionAnswer }>(
      (acc, draft) => {
        if (!isValidQuestionnaireAnswerType(draft.type)) {
          return acc
        }

        // Map originalId back to compound question.id so answers align with
        // the key-space GenericQuestionnaire uses internally
        const compoundId =
          originalIdToCompoundId[draft.questionId] ?? draft.questionId

        return {
          ...acc,
          [compoundId]: {
            questionId: compoundId,
            question: questionLabels[compoundId] ?? '',
            type: draft.type,
            answers: draft.answers.map((a) => ({
              label: a.label ?? undefined,
              value: a.value,
            })),
          },
        }
      },
      {},
    )
  }, [questionnaire?.draftAnswers, questionnaire?.sections])

  if (!id) {
    return (
      <Box background="white">
        <Problem type="not_found" noBorder={false} />
      </Box>
    )
  }

  const handleSubmit = (
    answers: { [key: string]: QuestionAnswer },
    asDraft?: boolean,
  ) => {
    const formId = data?.questionnairesDetail?.baseInformation.formId

    if (!id || !formId) {
      toast.error(
        formatMessage(messages.errorSendingAnswers, {
          title:
            data?.questionnairesDetail?.baseInformation.title ??
            formatMessage(m.unknown),
        }),
      )
      return
    }

    // For EL questionnaires, answers are keyed by compound question.id
    // (e.g. "group_1__3143") but the backend expects originalId ("3143").
    // Build a lookup so we send the correct entryId.
    const idToOriginalId: { [key: string]: string } = {}
    data?.questionnairesDetail?.sections?.forEach((section) => {
      section.questions?.forEach((q) => {
        if (q.originalId) {
          idToOriginalId[q.id] = q.originalId
        }
      })
    })

    const entries = Object.entries(answers).map(([questionId, answer]) => ({
      entryId: idToOriginalId[questionId] ?? questionId,
      type: answer.type,
      answers: answer.answers.map((a) => ({
        label: a.label,
        value: a.value,
      })),
    }))

    submitQuestionnaire({
      variables: {
        input: {
          id,
          organization,
          saveAsDraft: asDraft,
          entries: entries,
          formId,
        },
        locale: lang,
      },
    })
      .then((response) => {
        if (response.data?.submitQuestionnaire.success) {
          asDraft
            ? toast.success(
                formatMessage(messages.questionnaireDraftSaved, {
                  title:
                    data?.questionnairesDetail?.baseInformation.title ?? '',
                }),
              )
            : toast.success(formatMessage(messages.yourAnswersHaveBeenSent))
          navigate(
            HealthPaths.HealthQuestionnairesDetail.replace(
              ':org',
              organization?.toLocaleLowerCase() ?? '',
            ).replace(':id', id),
          )
        } else {
          toast.error(
            formatMessage(messages.errorSendingAnswers, {
              title: data?.questionnairesDetail?.baseInformation.title ?? '',
            }),
          )
          return
        }
      })
      .catch(() => {
        toast.error(
          formatMessage(messages.errorSendingAnswers, {
            title: data?.questionnairesDetail?.baseInformation.title ?? '',
          }),
        )
      })
  }

  const handleCancel = () => {
    toast.info(formatMessage(m.questionnaireCanceled))
    navigate(-1)
  }

  return (
    <Box display="flex" justifyContent="center">
      <Box className={styles.answeredContainer} background="white" width="full">
        {loading && !error && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="full"
          >
            <LoadingDots />
          </Box>
        )}
        {error && !loading && (
          <Problem type="internal_service_error" noBorder />
        )}
        {data?.questionnairesDetail && !loading && !error && (
          <GenericQuestionnaire
            questionnaire={data.questionnairesDetail}
            initialAnswers={initialAnswers}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            img={getOrganizationLogoUrl(
              data.questionnairesDetail?.baseInformation?.organization ?? '',
              organizations,
              60,
              'none',
            )}
          />
        )}
        {!loading && !data?.questionnairesDetail && !error && (
          <Box background="white" margin={4} borderRadius="lg">
            <Problem
              type="not_found"
              noBorder={false}
              title={formatMessage(messages.questionnaireNotFound)}
              message={formatMessage(messages.questionnaireNotFoundDetail)}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AnswerQuestionnaire
