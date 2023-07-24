import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, Divider } from '@island.is/island-ui/core'
import { ApplicantReview } from './ApplicantReview'
import { ChildrenReview } from './ChildrenReview'
import { ParentsReview } from './ParentsReview'
import { MaritalStatusReview } from './MaritalStatusReview'
import { ResidencyReview } from './ResidencyReview'
import { DocumentReview } from './DocumentReview'
import { StaysAbroadReview } from './StaysAbroadReview'
import { Citizenship } from '../../lib/dataSchema'
import { getSelectedCustodyChildren } from '../../utils/childrenInfo'
import { Routes } from '../../lib/constants'

export const Review: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const answers = application.answers as Citizenship

  const selectedChildren = getSelectedCustodyChildren(
    application.externalData,
    application.answers,
  )
  const showParents =
    answers?.parentInformation?.parents &&
    answers?.parentInformation?.parents.length > 0 &&
    answers?.parentInformation?.parents.filter((x) => x.wasRemoved === 'false')
      .length > 0

  return (
    <Box>
      <Divider></Divider>
      <ApplicantReview
        field={field}
        application={application}
        route={Routes.USERINFORMATION}
        goToScreen={goToScreen}
      />
      <Divider></Divider>
      {selectedChildren && selectedChildren.length > 0 && (
        <ChildrenReview
          field={field}
          application={application}
          selectedChildren={selectedChildren}
          route={Routes.PICKCHILDREN}
          goToScreen={goToScreen}
        />
      )}
      <Divider></Divider>
      <Divider></Divider>
      {showParents && (
        <ParentsReview
          field={field}
          application={application}
          route={Routes.PARENTINFORMATION}
          goToScreen={goToScreen}
        />
      )}
      <Divider></Divider>
      {answers?.maritalStatus && (
        <MaritalStatusReview
          field={field}
          application={application}
          route={Routes.MARITALSTATUS}
          goToScreen={goToScreen}
        />
      )}
      <Divider></Divider>
      <ResidencyReview
        field={field}
        application={application}
        route={Routes.COUNTRIESOFRESIDENCE}
        goToScreen={goToScreen}
      />
      <Divider></Divider>
      <StaysAbroadReview
        field={field}
        application={application}
        route={Routes.STAYSABROAD}
        goToScreen={goToScreen}
      />
      <Divider></Divider>
      <DocumentReview
        field={field}
        application={application}
        route={Routes.PASSPORT}
        goToScreen={goToScreen}
      />
    </Box>
  )
}
