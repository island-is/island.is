import { Questionnaire } from '@island.is/api/schema'
import {
  Box,
  Button,
  LoadingDots,
  Select,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  AnsweredQuestionnaire,
  formatDateWithTime,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HealthPaths, messages } from '../..'
import { useGetAnsweredQuestionnaireQuery } from './questionnaires.generated'

const QuestionnaireAnswered: React.FC = () => {
  const { id, formID, org } = useParams<{
    id?: string
    formID?: string
    org?: string
  }>()
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useGetAnsweredQuestionnaireQuery({
    variables: {
      input: {
        id: id || '',
        submissionId: formID || '',
        formId: formID || '',
        organization: org || '',
      },
      locale: lang,
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

  return (
    <IntroWrapper
      title={data?.getAnsweredQuestionnaire?.data[0]?.title || ''}
      intro={formatMessage(messages.answeredQuestionnaireAnswered)}
      loading={loading}
      buttonGroup={[
        // <Button
        //   variant="utility"
        //   onClick={() =>
        //     navigate(
        //       HealthPaths.HealthQuestionnairesDetail.replace(
        //         ':org',
        //         org || '',
        //       ).replace(':id', id || ''),
        //     )
        //   }
        //   preTextIcon="arrowBack"
        // >
        //   {formatMessage(m.goBack)}
        // </Button>,
        <Button
          variant="utility"
          onClick={() => window.print()}
          preTextIcon="print"
        >
          {formatMessage(m.print)}
        </Button>,
      ]}
    >
      {loading && !error && (
        <Box marginTop={6}>
          <SkeletonLoader height={24} width={'full'} repeat={8} space={4} />
        </Box>
      )}
      {error && !loading && <Problem type="internal_service_error" noBorder />}
      {data?.getAnsweredQuestionnaire && !loading && !error && (
        <Box>
          {/* Add your questionnaire display logic here */}
          <AnsweredQuestionnaire
            questionnaire={data.getAnsweredQuestionnaire?.data[0]}
          />
        </Box>
      )}
      {!loading && !data?.getAnsweredQuestionnaire && !error && (
        <Box background="white" margin={4} borderRadius="lg">
          <Problem
            type="not_found"
            noBorder={false}
            title={formatMessage(messages.questionnaireNotFound)}
            message={formatMessage(messages.questionnaireNotFoundDetail)}
          />
        </Box>
      )}
    </IntroWrapper>
  )
}

export default QuestionnaireAnswered
