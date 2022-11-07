import React, { FC, useEffect } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  fishingLicense,
  fishingLicenseFurtherInformation,
} from '../../lib/messages'
import { FishingLicenseEnum } from '../../types'
import * as styles from './FishingLicenseFurtherInfoTitleSection.css'
import { useFormContext } from 'react-hook-form'

export const FishingLicenseFurtherInfoTitleSection: FC<FieldBaseProps> = ({
  application,
}) => {
  const licenseId = 'fishingLicenseFurtherInformation.license'
  const { setValue, getValues } = useFormContext()
  const { formatMessage } = useLocale()
  const selectedChargeType = getValueViaPath(
    application.answers,
    'fishingLicense.license',
    '',
  ) as FishingLicenseEnum
  const licenseName =
    formatMessage(fishingLicense.labels[selectedChargeType]) || ''

  // Reinitialize license type if needed
  useEffect(() => {
    const licenseType = getValues(licenseId)
    if (selectedChargeType !== licenseType) {
      setValue(licenseId, selectedChargeType)
    }
  }, [])

  return (
    <>
      <Box className={styles.sectionTitle} marginBottom={4}>
        <Text variant="h2" as="h2">
          {licenseName || fishingLicenseFurtherInformation.general.title}
        </Text>
      </Box>
      <Box>
        <Text>
          {formatMessage(fishingLicenseFurtherInformation.general.subtitle)}
        </Text>
      </Box>
      {/* Hidden input to monitor which license is chosen in order to validate according to the license chosen */}
      <input
        type="hidden"
        id={licenseId}
        name={licenseId}
        value={selectedChargeType}
      />
    </>
  )
}
