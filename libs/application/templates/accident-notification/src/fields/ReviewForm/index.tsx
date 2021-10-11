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
  const { application, field } = props
  const isAssignee = field.props.isAssignee || false
  const [state, setState] = useState('inReviewSteps')

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
        return (
          <FormOverviewInReview
            setState={setState}
            isAssignee={isAssignee}
            props={props}
          />
        )
      default:
        return (
          <InReviewSteps
            application={application}
            isAssignee={isAssignee}
            setState={setState}
          />
        )
    }
  }

  return <ShowScreen />
}
