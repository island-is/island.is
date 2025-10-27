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
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../..'
import { HealthPaths } from '../../lib/paths'
import {
  useGetQuestionnaireWithQuestionsQuery,
  useSubmitQuestionnaireMutation,
} from './questionnaires.generated'

const QuestionnaireAnswer: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const { data: organizations } = useOrganizations()
  const [submitQuestionnaire] = useSubmitQuestionnaireMutation()

  const { data, loading, error } = useGetQuestionnaireWithQuestionsQuery({
    variables: {
      id: id || '',
      locale: lang,
      includeQuestions: true,
    },
    skip: !id,
  })

  if (!id) {
    return (
      <Box background="white">
        <Problem type="not_found" noBorder={false} />
      </Box>
    )
  }

  const handleSubmit = (answers: { [key: string]: QuestionAnswer }) => {
    // Transform answers back to LSH format
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        EntryID: questionId,
        Value: answer.value,
        Type: answer.type,
      }),
    )

    submitQuestionnaire({
      variables: {
        input: {
          id,
          organization:
            data?.questionnairesDetail?.baseInformation.organization || '',
          entries: formattedAnswers.map((answer) => ({
            entryID: answer.EntryID,
            type: answer.Type,
            values: Array.isArray(answer.Value)
              ? answer.Value
              : [String(answer.Value)],
          })),
          formId: data?.questionnairesDetail?.baseInformation.id || '',
        },
      },
    })
      .catch((e) => {
        console.error('Error submitting questionnaire:', e)
        toast.error(
          formatMessage(messages.errorSendingAnswers, {
            title: data?.questionnairesDetail?.baseInformation.title || '',
          }),
        )
      })
      .then(() => {
        toast.success(
          formatMessage(messages.yourAnswersForHasBeenSent, {
            title: data?.questionnairesDetail?.baseInformation.title || '',
          }),
        )
        navigate(-1)
      })
  }

  const handleCancel = () => {
    // TODO: clear answers or send draft?
    toast.info('Hætt við spurningalista')

    navigate(-1)
  }

  return (
    <Box display={'flex'} justifyContent={'center'} background={'blue100'}>
      <Box
        style={{ maxWidth: theme.breakpoints.xl }}
        background={'blue100'}
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
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            enableStepper={true}
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
