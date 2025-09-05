import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { useParams } from 'react-router-dom'
import LSHQuestionnaire from './LSH/LSHQuestionnaire'

const QuestionnaireDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>()

  //TODO: fetch questionnaire data by ID

  if (!id) {
    return <Problem type="no_data" />
  }

  //   if (!questions) {
  //     return <Problem type="no_data" />
  //   }

  // TODO: send data down to the generic question component instead
  return <LSHQuestionnaire />
}

export default QuestionnaireDetail
