import React, { FC } from 'react'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DatePickerController } from '@island.is/shared/form-fields'
import {
  fishingLicense,
  fishingLicenseFurtherInformation,
} from '../../lib/messages'
import { FishingLicenseEnum } from '../../types'
import * as styles from './FishingLicenseFurtherInfo.css'

export const FishingLicenseFurtherInfo: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage, lang } = useLocale()
  const selectedChargeType = getValueViaPath(
    application.answers,
    'fishingLicense.license',
    '',
  ) as FishingLicenseEnum
  const licenseName =
    formatMessage(fishingLicense.labels[selectedChargeType]) || ''
  return (
    <>
      <Box className={styles.sectionTitle} marginBottom={4}>
        <Text variant="h2" as="h2">
          {licenseName || fishingLicenseFurtherInformation.general.title}
        </Text>
      </Box>
      {/* Date validity/gildistaka is chosen for all types of licenses */}
      <Box marginBottom={6}>
        <Text marginBottom={4}>
          {formatMessage(fishingLicenseFurtherInformation.general.subtitle)}
        </Text>
        <Text fontWeight="semiBold" marginBottom={2}>
          {formatMessage(fishingLicenseFurtherInformation.labels.date)}
        </Text>
        <DatePickerController
          id={`${field.id}.date`}
          error={errors && getErrorViaPath(errors, `${field.id}.date`)}
          backgroundColor="blue"
          locale={lang}
          label={formatMessage(
            fishingLicenseFurtherInformation.fieldInformation.date,
          )}
          placeholder={formatMessage(
            fishingLicenseFurtherInformation.placeholders.date,
          )}
          minDate={new Date()}
        />
      </Box>
    </>
  )
}
