import { SkeletonLoader, toast } from '@island.is/island-ui/core'
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
import { useGetQuestionnaireQuery } from './questionnaries.generated'

const QuestionnaireDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()

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

  // TODO: send data down to the generic question component instead
  return (
    <>
      {loading && !error && <SkeletonLoader repeat={16} space={4} />}
      {error && !loading && <Problem type="internal_service_error" noBorder />}
      {data?.questionnairesDetail && !loading && !error && (
        <GenericQuestionnaire
          questionnaire={data.questionnairesDetail}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          cancelLabel={formatMessage(m.buttonCancel)}
          submitLabel={formatMessage(m.submit)}
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
    </>
  )
}

export default QuestionnaireDetail
