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
  useGetQuestionnaireQuery,
  useSubmitQuestionnaireMutation,
} from './questionnaires.generated'

const QuestionnaireDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const { data: organizations } = useOrganizations()
  const [submitQuestionnaire] = useSubmitQuestionnaireMutation()

  const { data, loading, error } = useGetQuestionnaireQuery({
    variables: {
      id: id || '',
      locale: lang,
    },
    skip: !id,
  })

  if (!id) {
    return <Problem type="not_found" noBorder={false} />
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
          entries: formattedAnswers.map((answer) => ({
            entryID: answer.EntryID,
            type: answer.Type,
            values: Array.isArray(answer.Value)
              ? answer.Value
              : [String(answer.Value)],
          })),
          formId: data?.questionnairesDetail?.formId || '',
        },
      },
    })
    toast.success('Spurningalisti sendur')
    navigate(-1)
    console.log('answers:', formattedAnswers)
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
              data.questionnairesDetail.organization ?? '',
              organizations,
              60,
              'none',
            )}
          />
        )}
        {!loading && !data?.questionnairesDetail && !error && (
          <Problem
            type="not_found"
            noBorder={false}
            title={formatMessage(messages.questionnaireNotFound)}
            message={formatMessage(messages.questionnaireNotFoundDetail)}
          />
        )}
      </Box>
    </Box>
  )
}

export default QuestionnaireDetail
