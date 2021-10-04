import { FieldBaseProps } from '@island.is/application/core'
import React, { FC, useState } from 'react'
import { FormOverviewInReview } from '../FormOverviewInReview'
import { InReviewSteps } from '../InReviewSteps'
import { UploadAttachmentsInReview } from '../UploadAttachmentsInReview'

type InReviewStepsProps = {
  field: {
    props: {
      isAssignee?: boolean
    }
  }
}

export const ReviewForm: FC<FieldBaseProps & InReviewStepsProps> = (props) => {
  const { application, refetch, field } = props
  const isAssignee = field.props.isAssignee || false
  const [state, setState] = useState('inReviewSteps')
  console.log(isAssignee)
  console.log(state)

  const ShowScreen = () => {
    switch (state) {
      case 'inReviewSteps':
        return (
          <InReviewSteps
            application={application}
            isAssignee={isAssignee}
            setState={setState}
          />
        )
      case 'uploadDocuments':
        return (
          <UploadAttachmentsInReview
            application={application}
            setState={setState}
          />
        )
      case 'overview':
        return <FormOverviewInReview setState={setState} {...props} />
      default:
        return null
    }
  }

  return <ShowScreen />
}
