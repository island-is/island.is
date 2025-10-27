import { Questionnaire } from '@island.is/api/schema'
import React from 'react'

interface AnsweredQuestionnaireProps {
  // Define your props here
  questionnaire?: Questionnaire
}

export const AnsweredQuestionnaire: React.FC<AnsweredQuestionnaireProps> = ({
  questionnaire,
}) => {
  return (
    <div>
      <h2>Answered Questionnaire</h2>
      {/* Add your component content here */}
      {questionnaire?.sections?.map((section) => (
        <div key={section.title}>
          {section?.questions?.map((question) => (
            <div key={question.id}>
              <p>{question.label}</p>
              {/* Render the answer here */}
            </div>
          ))}
          <h3>{section.title}</h3>
        </div>
      ))}
    </div>
  )
}

export default AnsweredQuestionnaire
