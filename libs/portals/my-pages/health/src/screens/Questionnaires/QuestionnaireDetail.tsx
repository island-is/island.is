import { Box, SkeletonLoader, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  GenericQuestionnaire,
  m,
  QuestionAnswer,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../..'
import { useGetQuestionnaireQuery } from './questionnaires.generated'
import { theme } from '@island.is/island-ui/theme'
import { useOrganizations } from '@island.is/portals/my-pages/graphql'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { HealthPaths } from '../../lib/paths'

const QuestionnaireDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const { data: organizations } = useOrganizations()

  const { data, loading, error } = useGetQuestionnaireQuery({
    variables: {
      id: id || '',
      locale: lang,
    },
    skip: !id,
  })

  const questionnaire = data?.questionnairesDetail

  if (!id) {
    return <Problem type="not_found" noBorder={false} />
  }

  const handleSubmit = (answers: { [key: string]: QuestionAnswer }) => {
    console.log('submitted:', answers)
    toast.success('Spurningalisti sendur')
    navigate(-1)

    // Transform answers back to LSH format
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        EntryID: questionId,
        Value: answer.value,
        Type: typeof answer.value,
      }),
    )

    console.log('answers:', formattedAnswers)
    // TODO - send to api
  }

  const handleCancel = () => {
    // TODO: clear answers or send draft?
    toast.info('Hætt við spurningalista')
    navigate(-1)
  }

  return (
    <Box display={'flex'} justifyContent={'center'} background={'blue100'}>
      <Box style={{ width: theme.breakpoints.xl }} background={'blue100'}>
        {loading && !error && <SkeletonLoader repeat={16} space={4} />}
        {error && !loading && (
          <Problem type="internal_service_error" noBorder />
        )}
        {data?.questionnairesDetail && !loading && !error && (
          <GenericQuestionnaire
            questionnaire={data.questionnairesDetail}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            cancelLabel={formatMessage(m.buttonCancel)}
            submitLabel={formatMessage(m.submit)}
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
