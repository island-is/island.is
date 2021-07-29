import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { AccidentNotification } from '../../lib/dataSchema'
import { ReviewGroup } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FileValueLine, ValueLine } from './ValueLine'
import {
  accidentDetails,
  accidentType,
  applicantInformation,
  companyInfo,
  injuredPerson,
  locationAndPurpose,
  overview,
} from '../../lib/messages'
import { AccidentTypeEnum, WhoIsTheNotificationForEnum } from '../../types'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import { YES } from '../../constants'
import { getWorkplaceData } from '../../utils'

export const FormOverview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as AccidentNotification
  const { formatMessage } = useLocale()

  const { timeOfAccident, dateOfAccident } = answers.accidentDetails
  const time = `${timeOfAccident.slice(0, 2)}:${timeOfAccident.slice(2, 4)}`
  const date = format(parseISO(dateOfAccident), 'dd.MM.yy', { locale: is })

  const workplaceData = getWorkplaceData(application.answers)

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

      {/* TODO: Get this data from answers once form is ready */}
      {answers.whoIsTheNotificationFor.answer !==
        WhoIsTheNotificationForEnum.ME && (
        <>
          <Text variant="h4" paddingTop={6} paddingBottom={3}>
            {formatText(
              injuredPerson.general.title,
              application,
              formatMessage,
            )}
          </Text>
          <ReviewGroup isLast editAction={() => null}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPerson.labels.name}
                  value="Hans Klaufi"
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPerson.labels.nationalId}
                  value="525458-8548"
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPerson.labels.address}
                  value="Kötluhlíð"
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPerson.labels.city}
                  value="270, Mosfellsbær"
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPerson.labels.email}
                  value="hansklaufi@gmail.com"
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine
                  label={injuredPerson.labels.phoneNumber}
                  value="868-2888"
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
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={locationAndPurpose.labels.postalCode}
              value={answers.locationAndPurpose.postalCode}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine
              label={locationAndPurpose.labels.city}
              value={answers.locationAndPurpose.city}
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

      {workplaceData && (
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
              value={accidentType.labels[AccidentTypeEnum.SPORTS]}
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
              files={answers.attachments.injuryCertificateFile}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
