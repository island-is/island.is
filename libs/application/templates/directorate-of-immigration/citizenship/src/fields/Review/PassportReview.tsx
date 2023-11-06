import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { supportingDocuments } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import { getValueViaPath } from '@island.is/application/core'
import { OptionSetItem } from '@island.is/clients/directorate-of-immigration'
import { GenericReview } from '../../components/GenericReview'

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
    <GenericReview
      leftColumnItems={[
        `${formatMessage(
          supportingDocuments.labels.passport.publishDate,
        )}: ${publishDate}`,
        `${formatMessage(
          supportingDocuments.labels.passport.expirationDate,
        )}: ${expirationDate}`,
        `${formatMessage(
          supportingDocuments.labels.passport.passportNumber,
        )}: ${passportNumber}`,
      ]}
      rightColumnItems={[
        `${formatMessage(supportingDocuments.labels.passport.passportType)}: ${
          travelDocumentTypes.find((x) => x.id?.toString() === passportTypeId)
            ?.name
        }`,
        `${formatMessage(
          supportingDocuments.labels.passport.expirationDate,
        )}: ${expirationDate}`,
        `${formatMessage(supportingDocuments.labels.passport.publisher)}: ${
          countryOptions.find((x) => x.id?.toString() === countryOfIssuerId)
            ?.name
        }`,
      ]}
      leftDescription={supportingDocuments.labels.passport.title}
      goToScreen={goToScreen}
      route={route}
    />
  )
}
