import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import {
  EducationDetailsItem,
  EducationDetailsItemExemption,
  EducationDetailsItemNotFinished,
} from '../../shared/types'
import { formerEducation } from '../../lib/messages/formerEducation'
import { coreMessages } from '@island.is/application/core'
import SummaryBlock from '../../components/SummaryBlock'
import { Box, GridColumn, GridRow, Icon, Text } from '@island.is/island-ui/core'
import { formatDateStr, getCountryName, getDegreeLevelLabel } from '../../utils'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
  educationItemsFinished?: Array<EducationDetailsItem>
  educationItemExemption?: EducationDetailsItemExemption
  educationItemNotFinished?: EducationDetailsItemNotFinished
  educationItemThirdLevel?: EducationDetailsItem
}

export const SchoolCareerReview: FC<Props> = ({
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
              {educationItemExemption.degreeAttachments && (
                <Text>{`${formatMessage(review.labels.documents)}:`}</Text>
              )}
              {educationItemExemption.degreeAttachments?.map((file) => {
                return (
                  <Box
                    display="flex"
                    alignItems="center"
                    marginBottom="smallGutter"
                  >
                    <Box marginRight={1} display="flex" alignItems="center">
                      <Icon
                        color="blue400"
                        icon="document"
                        size="small"
                        type="outline"
                      />
                    </Box>
                    <Text>{file.name}</Text>
                  </Box>
                )
              })}
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
              )}: ${formatMessage(
                getDegreeLevelLabel(educationItemThirdLevel.degreeLevel),
              )}`}</Text>
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
              )}: ${getCountryName(
                educationItemThirdLevel.degreeCountry,
              )}`}</Text>
              {educationItemThirdLevel.beginningDate && (
                <Text>{`${formatMessage(
                  formerEducation.labels.educationDetails.beginningDateLabel,
                )}: ${formatDateStr(
                  educationItemThirdLevel.beginningDate,
                )}`}</Text>
              )}
              <Text>{`${formatMessage(
                formerEducation.labels.educationDetails.endDateLabel,
              )}: ${formatDateStr(educationItemThirdLevel.endDate)}`}</Text>
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
              {educationItemThirdLevel.degreeAttachments && (
                <Text>{`${formatMessage(review.labels.documents)}:`}</Text>
              )}
              {educationItemThirdLevel.degreeAttachments?.map((file) => {
                return (
                  <Box
                    display="flex"
                    alignItems="center"
                    marginBottom="smallGutter"
                  >
                    <Box marginRight={1} display="flex" alignItems="center">
                      <Icon
                        color="blue400"
                        icon="document"
                        size="small"
                        type="outline"
                      />
                    </Box>
                    <Text>{file.name}</Text>
                  </Box>
                )
              })}
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
                  )}: ${formatMessage(
                    getDegreeLevelLabel(educationItem.degreeLevel),
                  )}`}</Text>
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
                  )}: ${getCountryName(educationItem.degreeCountry)}`}</Text>
                  {educationItem.beginningDate && (
                    <Text>{`${formatMessage(
                      formerEducation.labels.educationDetails
                        .beginningDateLabel,
                    )}: ${formatDateStr(educationItem.beginningDate)}`}</Text>
                  )}
                  <Text>{`${formatMessage(
                    formerEducation.labels.educationDetails.endDateLabel,
                  )}: ${formatDateStr(educationItem.endDate)}`}</Text>
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
                  {educationItem.degreeAttachments && (
                    <Text>{`${formatMessage(review.labels.documents)}:`}</Text>
                  )}
                  {educationItem.degreeAttachments?.map((file) => {
                    return (
                      <Box
                        display="flex"
                        alignItems="center"
                        marginBottom="smallGutter"
                      >
                        <Box marginRight={1} display="flex" alignItems="center">
                          <Icon
                            color="blue400"
                            icon="document"
                            size="small"
                            type="outline"
                          />
                        </Box>
                        <Text>{file.name}</Text>
                      </Box>
                    )
                  })}
                </GridColumn>
              )
            })}
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
