import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import { GenericReview } from '../../components/GenericReview'
import {
  EducationDetailsItem,
  EducationDetailsItemExemption,
  EducationDetailsItemNotFinished,
} from '../../shared/types'
import { formerEducation } from '../../lib/messages/formerEducation'
import { coreMessages } from '@island.is/application/core'
import SummaryBlock from '../../components/SummaryBlock'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
  educationItemsFinished?: Array<EducationDetailsItem>
  educationItemExemption?: EducationDetailsItemExemption
  educationItemNotFinished?: EducationDetailsItemNotFinished
  educationItemThirdLevel?: EducationDetailsItem
}

export const SchoolCareerReview: FC<Props> = ({
  application,
  goToScreen,
  educationItemsFinished,
  educationItemExemption,
  educationItemNotFinished,
  educationItemThirdLevel,
  route,
}) => {
  const { formatMessage } = useLocale()

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <GridRow>
          {educationItemExemption && (
            <GridColumn span="1/2">
              <Text variant="h5">
                {formatMessage(review.labels.exemptionInformation)}
              </Text>
              <Text>{`${formatMessage(
                formerEducation.labels.educationDetails.moreDetailsLabel,
              )}: ${educationItemExemption.moreDetails}`}</Text>
              <Text>{`${formatMessage(review.labels.documents)}: TODO`}</Text>
            </GridColumn>
          )}
          {educationItemThirdLevel && (
            <GridColumn span="1/2">
              <Text variant="h5">
                {formatMessage(review.labels.exemptionInformation)}
              </Text>
              <Text>{`${formatMessage(
                formerEducation.labels.educationDetails.schoolLabel,
              )}: ${educationItemThirdLevel.school}`}</Text>

              <Text>{`${formatMessage(
                formerEducation.labels.educationDetails.degreeLevelLabel,
              )}: ${educationItemThirdLevel.degreeLevel}`}</Text>
              {educationItemThirdLevel.degreeAttachments && (
                <Text>{`${formatMessage(
                  formerEducation.labels.educationDetails.degreeMajorLabel,
                )}: ${educationItemThirdLevel.degreeMajor}`}</Text>
              )}
              {educationItemThirdLevel.finishedUnits && (
                <Text>{`${formatMessage(
                  formerEducation.labels.educationDetails.finishedUnitsLabel,
                )}: ${educationItemThirdLevel.finishedUnits}`}</Text>
              )}
              {educationItemThirdLevel.averageGrade && (
                <Text>{`${formatMessage(
                  formerEducation.labels.educationDetails.averageGradeLabel,
                )}: ${educationItemThirdLevel.averageGrade}`}</Text>
              )}
              <Text>{`${formatMessage(
                formerEducation.labels.educationDetails.degreeCountryLabel,
              )}: ${educationItemThirdLevel.degreeCountry}`}</Text>
              {educationItemThirdLevel.beginningDate && (
                <Text>{`${formatMessage(
                  formerEducation.labels.educationDetails.beginningDateLabel,
                )}: ${educationItemThirdLevel.beginningDate}`}</Text>
              )}
              <Text>{`${formatMessage(
                formerEducation.labels.educationDetails.endDateLabel,
              )}: ${educationItemThirdLevel.endDate}`}</Text>
              {educationItemThirdLevel.degreeFinished && (
                <Text>{`${formatMessage(
                  formerEducation.labels.educationDetails
                    .degreeFinishedCheckboxLabel,
                )}: ${
                  educationItemThirdLevel.degreeFinished
                    ? formatMessage(coreMessages.radioYes)
                    : formatMessage(coreMessages.radioNo)
                }`}</Text>
              )}
              {educationItemThirdLevel.moreDetails && (
                <Text>{`${formatMessage(
                  formerEducation.labels.educationDetails.moreDetailsLabel,
                )}: ${educationItemThirdLevel.moreDetails}`}</Text>
              )}
            </GridColumn>
          )}
          {educationItemNotFinished && (
            <GridColumn span="1/2">
              <Text variant="h5">
                {formatMessage(review.labels.notFinishedInformation)}
              </Text>
              <Text>{`${formatMessage(
                formerEducation.labels.educationDetails.schoolLabel,
              )}: ${educationItemNotFinished.school}`}</Text>
              <Text>{`${formatMessage(
                formerEducation.labels.educationDetails.degreeLevelLabel,
              )}: ${educationItemNotFinished.degreeLevel}`}</Text>
              <Text>{`${formatMessage(
                formerEducation.labels.educationDetails.moreDetailsLabel,
              )}: ${educationItemNotFinished.moreDetails}`}</Text>
            </GridColumn>
          )}
          {educationItemsFinished &&
            educationItemsFinished.map((educationItem, index) => {
              return (
                <GridColumn span="1/2">
                  <Text variant="h5">
                    {formatMessage(
                      formerEducation.labels.educationDetails.itemTitle,
                      { index: index + 1 },
                    )}
                  </Text>

                  <Text>{`${formatMessage(
                    formerEducation.labels.educationDetails.schoolLabel,
                  )}: ${educationItem.school}`}</Text>

                  <Text>{`${formatMessage(
                    formerEducation.labels.educationDetails.degreeLevelLabel,
                  )}: ${educationItem.degreeLevel}`}</Text>
                  {educationItem.degreeAttachments && (
                    <Text>{`${formatMessage(
                      formerEducation.labels.educationDetails.degreeMajorLabel,
                    )}: ${educationItem.degreeMajor}`}</Text>
                  )}
                  {educationItem.finishedUnits && (
                    <Text>{`${formatMessage(
                      formerEducation.labels.educationDetails
                        .finishedUnitsLabel,
                    )}: ${educationItem.finishedUnits}`}</Text>
                  )}
                  {educationItem.averageGrade && (
                    <Text>{`${formatMessage(
                      formerEducation.labels.educationDetails.averageGradeLabel,
                    )}: ${educationItem.averageGrade}`}</Text>
                  )}
                  <Text>{`${formatMessage(
                    formerEducation.labels.educationDetails.degreeCountryLabel,
                  )}: ${educationItem.degreeCountry}`}</Text>
                  {educationItem.beginningDate && (
                    <Text>{`${formatMessage(
                      formerEducation.labels.educationDetails
                        .beginningDateLabel,
                    )}: ${educationItem.beginningDate}`}</Text>
                  )}
                  <Text>{`${formatMessage(
                    formerEducation.labels.educationDetails.endDateLabel,
                  )}: ${educationItem.endDate}`}</Text>
                  {educationItem.degreeFinished && (
                    <Text>{`${formatMessage(
                      formerEducation.labels.educationDetails
                        .degreeFinishedCheckboxLabel,
                    )}: ${
                      educationItem.degreeFinished
                        ? formatMessage(coreMessages.radioYes)
                        : formatMessage(coreMessages.radioNo)
                    }`}</Text>
                  )}
                  {educationItem.moreDetails && (
                    <Text>{`${formatMessage(
                      formerEducation.labels.educationDetails.moreDetailsLabel,
                    )}: ${educationItem.moreDetails}`}</Text>
                  )}
                </GridColumn>
              )
            })}
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
