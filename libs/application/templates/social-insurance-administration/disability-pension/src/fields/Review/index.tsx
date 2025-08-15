import { Application, Field, RecordObject } from '@island.is/application/types'
import get from 'lodash/get'
import has from 'lodash/has'
import { FC } from 'react'
import { SelfEvaluationReview } from './review-groups/SelfEvaluationReview'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  errors?: RecordObject
  editable?: boolean
}
export const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
  errors,
}) => {
  const editable = field.props?.editable ?? false

  const hasError = (id: string) => get(errors, id) as string
  const groupHasNoErrors = (ids: string[]) =>
    ids.every((id) => !has(errors, id))

  const childProps = {
    application,
    editable,
    field,
    groupHasNoErrors,
    hasError,
    goToScreen,
  }

  return (
    <div>
      <SelfEvaluationReview {...childProps} />
    </div>
  )
}

export default Review
