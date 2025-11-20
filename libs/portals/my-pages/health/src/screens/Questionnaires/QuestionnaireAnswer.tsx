import { QuestionnaireQuestionnairesOrganizationEnum } from '@island.is/api/schema'
import { Box, LoadingDots, toast } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  GenericQuestionnaire,
  QuestionAnswer,
} from '@island.is/portals/my-pages/core'
import { useOrganizations } from '@island.is/portals/my-pages/graphql'
import { Problem } from '@island.is/react-spa/shared'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../..'
import { HealthPaths } from '../../lib/paths'
import {
  useGetQuestionnaireWithQuestionsQuery,
  useSubmitQuestionnaireMutation,
} from './questionnaires.generated'

const QuestionnaireAnswer: React.FC = () => {
  const { id, org } = useParams<{ id?: string; org?: string }>()
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const { data: organizations } = useOrganizations()
  const [submitQuestionnaire] = useSubmitQuestionnaireMutation()

  const organization: QuestionnaireQuestionnairesOrganizationEnum | undefined =
    org === 'el'
      ? QuestionnaireQuestionnairesOrganizationEnum.EL
      : org === 'lsh'
      ? QuestionnaireQuestionnairesOrganizationEnum.LSH
      : undefined

  const { data, loading, error } = useGetQuestionnaireWithQuestionsQuery({
    variables: {
      input: {
        id: id || '',
        organization: organization,
        includeQuestions: true,
      },
      locale: lang,
    },
    skip: !id,
  })

  const questionnaire = data?.questionnairesDetail

  const initialAnswers = useMemo(() => {
    if (!questionnaire?.draftAnswers?.length) return undefined

    return questionnaire.draftAnswers.reduce(
      (acc, draft) => ({
        ...acc,
        [draft.questionId]: {
          questionId: draft.questionId,
          type: draft.type as QuestionAnswer['type'],
          answers: draft.answers.map((a) => ({
            label: a.label ?? undefined,
            value: a.value,
          })),
        },
      }),
      {} as { [key: string]: QuestionAnswer },
    )
  }, [questionnaire?.draftAnswers])

  // Check if this is a draft
  const isDraft = !!questionnaire?.draftAnswers?.length

  if (!id) {
    return (
      <Box background="white">
        <Problem type="not_found" noBorder={false} />
      </Box>
    )
  }

  const handleSubmit = (answers: { [key: string]: QuestionAnswer }) => {
    if (!organization || !id) {
      toast.error(
        formatMessage(messages.errorSendingAnswers, {
          title: data?.questionnairesDetail?.baseInformation.title || '',
        }),
      )
      return
    }

    const entries = Object.entries(answers).map(([questionId, answer]) => ({
      entryID: questionId,
      type: answer.type,
      answers: answer.answers.map((a) => ({
        label: a.label,
        values: a.value,
      })),
    }))

    submitQuestionnaire({
      variables: {
        input: {
          id,
          organization: organization,
          entries: entries,
          formId: data?.questionnairesDetail?.baseInformation.formId || '',
        },
        locale: lang,
      },
    })
      .then((response) => {
        if (response.data?.submitQuestionnaire.success) {
          toast.success(
            formatMessage(messages.yourAnswersForHasBeenSent, {
              title: data?.questionnairesDetail?.baseInformation.title || '',
            }),
          )
          navigate(
            HealthPaths.HealthQuestionnairesAnswered.replace(
              ':org',
              organization?.toLocaleLowerCase() ?? '',
            )
              .replace(':id', id)
              .replace(
                ':submissionId',
                response.data?.submitQuestionnaire.message || '',
              ),
          )
        } else {
          toast.error(
            formatMessage(messages.errorSendingAnswers, {
              title: data?.questionnairesDetail?.baseInformation.title || '',
            }),
          )
          return
        }
      })
      .catch(() => {
        toast.error(
          formatMessage(messages.errorSendingAnswers, {
            title: data?.questionnairesDetail?.baseInformation.title || '',
          }),
        )
      })
  }

  const handleCancel = () => {
    // TODO: clear answers or send draft?
    toast.info('Hætt við spurningalista')

    navigate(-1)
  }

  return (
    // If the stepper should be enabled, set the backgroun to blue100
    <Box display={'flex'} justifyContent={'center'}>
      <Box
        style={{ maxWidth: theme.breakpoints.xl }}
        background={'white'}
        width="full"
      >
        {loading && !error && (
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
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
            isDraft={isDraft}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            enableStepper={false}
            backLink={HealthPaths.HealthQuestionnaires}
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

export default QuestionnaireAnswer
