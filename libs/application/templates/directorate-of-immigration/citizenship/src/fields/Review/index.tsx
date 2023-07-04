import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, Divider } from '@island.is/island-ui/core'
import { ApplicantReview } from './ApplicantReview'
import { ChildrenReview } from './ChildrenReview'
import { ResidencyConditionReview } from './ResidencyConditionReview'
import { ParentsReview } from './ParentsReview'
import { MaritalStatusReview } from './MaritalStatusReview'
import { ResidencyReview } from './ResidencyReview'
import { DocumentReview } from './DocumentReview'
import { StaysAbroadReview } from './StaysAbroadReview'
import { Citizenship } from '../../lib/dataSchema'
import { getSelectedCustodyChildren } from '../../utils/childrenInfo'

export const Review: FC<FieldBaseProps> = ({ application, field }) => {
  const answers = application.answers as Citizenship

  const selectedChildren = getSelectedCustodyChildren(
    application.externalData,
    application.answers,
  )
  const showParents =
    answers?.residenceCondition.radio === 'childOfIcelander' &&
    answers?.parents &&
    answers?.parents.length > 0

  return (
    <Box>
      <Divider></Divider>
      <ApplicantReview field={field} application={application} />
      <Divider></Divider>
      {selectedChildren && selectedChildren.length > 0 && (
        <ChildrenReview selectedChildren={selectedChildren} />
      )}
      <Divider></Divider>
      <ResidencyConditionReview field={field} application={application} />
      <Divider></Divider>
      {showParents && <ParentsReview field={field} application={application} />}
      <Divider></Divider>
      {answers?.maritalStatus && (
        <MaritalStatusReview field={field} application={application} />
      )}
      <Divider></Divider>
      <ResidencyReview field={field} application={application} />
      <Divider></Divider>
      <StaysAbroadReview field={field} application={application} />
      <Divider></Divider>
      <DocumentReview field={field} application={application} />
    </Box>
  )
}
