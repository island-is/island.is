import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { supportingDocuments } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'
import { getValueViaPath } from '@island.is/application/core'
import { OptionSetItem } from '@island.is/clients/directorate-of-immigration'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const PassportReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as Citizenship
  const { formatMessage } = useLocale()

  const travelDocumentTypes = getValueViaPath(
    application.externalData,
    'travelDocumentTypes.data',
    [],
  ) as OptionSetItem[]

  const countryOptions = getValueViaPath(
    application.externalData,
    'countries.data',
    [],
  ) as OptionSetItem[]

  const passport = answers.passport
  const {
    publishDate,
    expirationDate,
    passportNumber,
    passportTypeId,
    countryOfIssuerId,
  } = passport

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <DescriptionText
          text={supportingDocuments.labels.passport.title}
          textProps={{
            as: 'h4',
            fontWeight: 'semiBold',
            marginBottom: 0,
          }}
        />
        <GridRow>
          <GridColumn span="1/2">
            <Text>
              {`${formatMessage(
                supportingDocuments.labels.passport.publishDate,
              )}: ${publishDate}`}
            </Text>
            <Text>
              {`${formatMessage(
                supportingDocuments.labels.passport.expirationDate,
              )}: ${expirationDate}`}
            </Text>
            <Text>
              {`${formatMessage(
                supportingDocuments.labels.passport.passportNumber,
              )}: ${passportNumber}`}
            </Text>
          </GridColumn>
          <GridColumn span="1/2">
            <Text>
              {`${formatMessage(
                supportingDocuments.labels.passport.passportType,
              )}: ${
                travelDocumentTypes.find(
                  (x) => x.id?.toString() === passportTypeId,
                )?.name
              }`}
            </Text>
            <Text>
              {`${formatMessage(
                supportingDocuments.labels.passport.expirationDate,
              )}: ${expirationDate}`}
            </Text>
            <Text>
              {`${formatMessage(
                supportingDocuments.labels.passport.publisher,
              )}: ${
                countryOptions.find(
                  (x) => x.id?.toString() === countryOfIssuerId,
                )?.name
              }`}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
