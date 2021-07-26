import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { AccidentNotification } from '../../lib/dataSchema'
import { ReviewGroup } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { ValueLine } from './ValueLine'
import {
  accidentDetails,
  accidentType,
  applicantInformation,
  overview,
} from '../../lib/messages'
import { AccidentTypeEnum, WhoIsTheNotificationForEnum } from '../../types'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'

export const FormOverview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as AccidentNotification
  const { formatMessage } = useLocale()

  const { timeOfAccident, dateOfAccident } = answers.accidentDetails
  const time = `${timeOfAccident.slice(0, 2)}:${timeOfAccident.slice(2, 4)}`
  const date = format(parseISO(dateOfAccident), 'dd.MM.yy', { locale: is })

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
            Upplýsingar um þann slasaða
          </Text>
          <ReviewGroup isLast editAction={() => null}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine label="Nafn" value="Knattspyrnufélag Reykjavíkur" />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine label="Kennitala" value="525458-8548" />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine label="Heimili" value="Kötluhlíð" />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine label="Sveitarfélag" value="270, Mosfellsbær" />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine label="Netfang" value="hansklaufi@gmail.com" />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <ValueLine label="Símanúmer" value="868-2888" />
              </GridColumn>
            </GridRow>
          </ReviewGroup>
        </>
      )}

      {/* TODO: Only display this if individual household accident */}
      <Text variant="h4" paddingTop={6} paddingBottom={3}>
        Staðsetning á slysi
      </Text>
      <ReviewGroup isLast editAction={() => null}>
        <GridRow>
          <GridColumn span="12/12">
            <ValueLine label="Heimili / póstfang" value="Fálkagata 13" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Póstnúmer" value="107" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Sveitarfélag" value="Reykjavík" />
          </GridColumn>
          <GridColumn span="12/12">
            <ValueLine label="Nánar" value="Íbúð 101" />
          </GridColumn>
        </GridRow>
      </ReviewGroup>

      {/* TODO: Only display this if sporting accident - and add this for other all accident types */}
      <Text variant="h4" paddingTop={6} paddingBottom={3}>
        Upplýsingar um Íþróttafélag
      </Text>
      <ReviewGroup isLast editAction={() => null}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Nafn" value="Knattspyrnufélag Reykjavíkur" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Kennitala" value="525458-8548" />
          </GridColumn>
        </GridRow>
      </ReviewGroup>

      {/* TODO: Only display this if representative */}
      <Text variant="h4" paddingTop={6} paddingBottom={3}>
        Upplýsingar um forsvarsmann
      </Text>
      <ReviewGroup isLast editAction={() => null}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Nafn" value="Andrés Önd" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Kennitala" value="200496-5182" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Netfang" value="andres@simnet.is" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Símanúmer" value="868-5854" />
          </GridColumn>
        </GridRow>
      </ReviewGroup>

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
          {answers.attachments.injuryCertificateFile && (
            <GridColumn span={['12/12', '12/12', '9/12']}>
              <ValueLine
                label={overview.labels.attachments}
                value={answers.attachments.injuryCertificateFile
                  ?.map((x) => x.name)
                  .join(', ')}
              />
            </GridColumn>
          )}
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
