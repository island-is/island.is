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
import {
  licenseHasAreaSelection,
  licenseHasFileUploadField,
  licenseHasRailNetAndRoeNetField,
} from '../../utils/licenses'

export const FishingLicenseFurtherInfoTitleSection: FC<FieldBaseProps> = ({
  application,
}) => {
  const areaId = 'fishingLicenseFurtherInformation.area'
  const attachmentsId = 'fishingLicenseFurtherInformation.attachments'
  const railnetId = 'fishingLicenseFurtherInformation.railAndRoeNet.railNet'
  const roenetId = 'fishingLicenseFurtherInformation.railAndRoeNet.roeNet'
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
    </>
  )
}
