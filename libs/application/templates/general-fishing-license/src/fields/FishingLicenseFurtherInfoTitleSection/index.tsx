import React, { FC } from 'react'
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

export const FishingLicenseFurtherInfoTitleSection: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
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
      <Box marginBottom={6}>
        <Text marginBottom={4}>
          {formatMessage(fishingLicenseFurtherInformation.general.subtitle)}
        </Text>
      </Box>
    </>
  )
}
