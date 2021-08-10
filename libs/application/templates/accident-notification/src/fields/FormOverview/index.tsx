import React, { FC } from 'react'
import {
  FieldBaseProps,
  formatText,
  FormValue,
} from '@island.is/application/core'
import { AccidentNotification } from '../../lib/dataSchema'
import { ReviewGroup } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FileValueLine, ValueLine } from './ValueLine'
import {
  accidentDetails,
  accidentType,
  applicantInformation,
  injuredPersonInformation,
  juridicalPerson,
  locationAndPurpose,
  application as applicationMessages,
  overview,
  sportsClubInfo,
} from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import { YES } from '../../constants'
import {
  getWorkplaceData,
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
  isProfessionalAthleteAccident,
} from '../../utils'

export const FormOverview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as AccidentNotification
  const { formatMessage } = useLocale()

  const { timeOfAccident, dateOfAccident } = answers.accidentDetails
  const time = `${timeOfAccident.slice(0, 2)}:${timeOfAccident.slice(2, 4)}`
  const date = format(parseISO(dateOfAccident), 'dd.MM.yy', { locale: is })

  const workplaceData = getWorkplaceData(application.answers)

  const attachments = [
    ...(answers.attachments.deathCertificateFile
      ? answers.attachments.deathCertificateFile
      : []),
    ...(answers.attachments.injuryCertificateFile
      ? answers.attachments.injuryCertificateFile
      : []),
  ]

  return (
    <Box component="section" paddingTop={2}>
      <Text>
        {formatText(overview.general.description, application, formatMessage)}
      </Text>

      <Text variant="h4" paddingTop={10} paddingBottom={3}>
        {formatText(
          applicantInformation.general.title,
          application,
          formatMessage,
        )}
      </Text>
      <ReviewGroup isLast editAction={() => null}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={applicantInformation.labels.name}
              value={answers.applicant.name}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={applicantInformation.labels.nationalId}
              value={answers.applicant.nationalId}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={applicantInformation.labels.address}
              value={answers.applicant.address}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={applicantInformation.labels.city}
              value={answers.applicant.city}
            />
          </GridColumn>
          {answers.applicant.email && (
            <GridColumn span={['12/12', '12/12', '6/12']}>
              <ValueLine
                label={applicantInformation.labels.email}
                value={answers.applicant.email}
              />
            </GridColumn>
          )}
          {answers.applicant.phoneNumber && (
            <GridColumn span={['12/12', '12/12', '6/12']}>
              <ValueLine
                label={applicantInformation.labels.tel}
                value={answers.applicant.phoneNumber}
              />
            </GridColumn>
          )}
        </GridRow>
      </ReviewGroup>

      {isReportingOnBehalfOfInjured(answers as FormValue) && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              injuredPersonInformation.general.heading,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup isLast editAction={() => null}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.name}
                  value={answers.injuredPersonInformation.name}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.nationalId}
                  value={answers.injuredPersonInformation.nationalId}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.email}
                  value={answers.injuredPersonInformation.email}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPersonInformation.labels.tel}
                  value={answers.injuredPersonInformation.phoneNumber ?? ''}
                />
              </GridColumn>
            </GridRow>
          </ReviewGroup>
        </>
      )}

      {isReportingOnBehalfOfEmployee(answers as FormValue) && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              juridicalPerson.general.title,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup isLast editAction={() => null}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={juridicalPerson.labels.companyName}
                  value={answers.juridicalPerson.companyName}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={juridicalPerson.labels.companyNationalId}
                  value={answers.juridicalPerson.companyNationalId}
                />
              </GridColumn>
            </GridRow>
          </ReviewGroup>
        </>
      )}

      <Text variant="h4" paddingTop={6} paddingBottom={3}>
        {formatText(
          locationAndPurpose.general.title,
          application,
          formatMessage,
        )}
      </Text>
      <ReviewGroup isLast editAction={() => null}>
        <GridRow>
          <GridColumn span="12/12">
            <ValueLine
              label={locationAndPurpose.labels.location}
              value={answers.locationAndPurpose.location}
            />
          </GridColumn>
          <GridColumn span="12/12">
            <ValueLine
              label={locationAndPurpose.labels.purpose}
              value={answers.locationAndPurpose.purpose}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>

      {workplaceData && !isReportingOnBehalfOfEmployee(answers as FormValue) && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              workplaceData.general.title,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup isLast editAction={() => null}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={workplaceData.labels.companyName}
                  value={workplaceData.info.companyName}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={workplaceData.labels.nationalId}
                  value={workplaceData.info.nationalRegistrationId ?? ''}
                />
              </GridColumn>
              {isProfessionalAthleteAccident(answers as FormValue) &&
                workplaceData.info.employee && (
                  <GridColumn span="12/12">
                    <ValueLine
                      label={sportsClubInfo.employee.sectionTitle}
                      value={
                        workplaceData.info.employee.radioButton === YES
                          ? applicationMessages.general.yesOptionLabel
                          : applicationMessages.general.noOptionLabel
                      }
                    />
                  </GridColumn>
                )}
            </GridRow>
          </ReviewGroup>

          {answers.isRepresentativeOfCompanyOrInstitue?.toString() !== YES && (
            <>
              <Text variant="h4" paddingTop={6} paddingBottom={3}>
                {formatText(
                  workplaceData.labels.descriptionField,
                  application,
                  formatMessage,
                )}
              </Text>
              <ReviewGroup isLast editAction={() => null}>
                <GridRow>
                  <GridColumn span="12/12">
                    <ValueLine
                      label={workplaceData.labels.name}
                      value={workplaceData.info.name}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={workplaceData.labels.email}
                      value={workplaceData.info.email}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <ValueLine
                      label={workplaceData.labels.tel}
                      value={workplaceData.info.phoneNumber}
                    />
                  </GridColumn>
                </GridRow>
              </ReviewGroup>
            </>
          )}
        </>
      )}

      <Text variant="h4" paddingTop={6} paddingBottom={3}>
        {formatText(
          accidentDetails.general.sectionTitle,
          application,
          formatMessage,
        )}
      </Text>
      <ReviewGroup isLast editAction={() => null}>
        <GridRow>
          <GridColumn span="12/12">
            <ValueLine
              label={overview.labels.accidentType}
              value={accidentType.labels[answers.accidentType.radioButton]}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label={accidentDetails.labels.date} value={date} />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label={accidentDetails.labels.time} value={time} />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '9/12']}>
            <ValueLine
              label={accidentDetails.labels.description}
              value={answers.accidentDetails.descriptionOfAccident}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '9/12']}>
            <FileValueLine
              label={overview.labels.attachments}
              files={attachments}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
