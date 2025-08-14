import { Application, Field, RecordObject } from '@island.is/application/types'
//import { useLocale } from '@island.is/localization'
import get from 'lodash/get'
import has from 'lodash/has'
import { FC } from 'react'
import { SelfEvaluationReview } from './review-groups/SelfEvaluationReview'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  refetch?: () => void
  errors?: RecordObject
  editable?: boolean
}
export const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
  //refetch,
  errors,
}) => {
  const editable = field.props?.editable ?? false
  //const { formatMessage } = useLocale()
  //const { state } = application

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

  const handleSubmit = async (event: string) => {
    console.log('Submitting application with event:', event)
    // const res = await submitApplication({
    //   variables: {
    //     input: {
    //       id: application.id,
    //       event,
    //       answers: application.answers,
    //     },
    //   },
    // })
    // if (res?.data) {
    //   // Takes them to the next state (which loads the relevant form)
    //   refetch?.()
    // }
  }
  return (
    <div>
      <SelfEvaluationReview {...childProps} />
    </div>
  )
}

export default Review
