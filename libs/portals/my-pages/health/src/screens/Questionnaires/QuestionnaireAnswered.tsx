import { Questionnaire } from '@island.is/api/schema'
import { Box, LoadingDots, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  AnsweredQuestionnaire,
  formatDateWithTime,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../..'
import { useGetAnsweredQuestionnaireQuery } from './questionnaires.generated'

const QuestionnaireAnswered: React.FC = () => {
  const { id, formID, org } = useParams<{
    id?: string
    formID?: string
    org?: string
  }>()
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const [selected, setSelected] = React.useState<{
    id?: string
    questionnaire?: Questionnaire
  }>()

  const { data, loading, error } = useGetAnsweredQuestionnaireQuery({
    variables: {
      input: {
        id: id || '',
        formId: formID || '',
        organization: org || '',
      },
      locale: lang,
    },
    skip: !id,
  })

  const getSentDates = () => {
    const options = data?.getAnsweredQuestionnaires?.map((q) => ({
      label: formatDateWithTime(q.sentDate),
      value: q.id,
    }))

    return options
  }

  const handleSelectChange = (
    option: { label: string; value: string } | null,
  ) => {
    if (!option) {
      setSelected(undefined)
      return
    }
    const selected = data?.getAnsweredQuestionnaires?.find(
      (q) => q.id === option.value,
    )
    setSelected({ id: selected?.id, questionnaire: selected as Questionnaire })
  }
  if (!id) {
    return (
      <Box background="white">
        <Problem type="not_found" noBorder={false} />
      </Box>
    )
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.questionnaires)}
      intro={formatMessage(messages.questionnairesIntro)}
      loading={loading}
      buttonGroup={[
        <Select
          options={getSentDates() || []}
          onChange={handleSelectChange}
          value={getSentDates()?.find((o) => o.value === selected) || null}
          label="Select a date"
          size="xs"
        />,
      ]}
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
      {error && !loading && <Problem type="internal_service_error" noBorder />}
      {data?.getAnsweredQuestionnaires && !loading && !error && (
        <Box>
          {/* Add your questionnaire display logic here */}
          <AnsweredQuestionnaire questionnaire={selected?.questionnaire} />
        </Box>
      )}
      {!loading && !data?.getAnsweredQuestionnaires && !error && (
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
