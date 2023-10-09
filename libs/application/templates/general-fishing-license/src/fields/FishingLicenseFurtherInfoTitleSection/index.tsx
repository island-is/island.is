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
import {
  AREA_FIELD_ID,
  ATTACHMENTS_FIELD_ID,
  RAILNET_FIELD_ID,
  ROENET_FIELD_ID,
} from '../../utils/fields'

export const FishingLicenseFurtherInfoTitleSection: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
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
  // If any values are undefined in this step but shouldn't be or vice versa
  // The validation doesn't validate these fields, so we must initialize them
  useEffect(() => {
    // Setting area to undefined if charge type does not have area selection
    if (
      !licenseHasAreaSelection(selectedChargeType) &&
      getValues(AREA_FIELD_ID) !== undefined
    ) {
      setValue(AREA_FIELD_ID, undefined)
    }
    // Setting rail and roe net to undefined if charge type does not have that selection
    if (
      !licenseHasRailNetAndRoeNetField(selectedChargeType) &&
      (getValues(RAILNET_FIELD_ID) !== undefined ||
        getValues(ROENET_FIELD_ID) !== undefined)
    ) {
      setValue(RAILNET_FIELD_ID, undefined)
      setValue(ROENET_FIELD_ID, undefined)
    }
    // Setting attachment to undefined if charge type should not provide attachments
    if (
      !licenseHasFileUploadField(selectedChargeType) &&
      getValues(ATTACHMENTS_FIELD_ID) !== undefined
    ) {
      setValue(ATTACHMENTS_FIELD_ID, undefined)
    }
    // If attachments should be with current charge type, initialize as empty array
    if (
      licenseHasFileUploadField(selectedChargeType) &&
      getValues(ATTACHMENTS_FIELD_ID) === undefined
    ) {
      setValue(ATTACHMENTS_FIELD_ID, [])
    }
  }, [])

  return (
    <>
      <Box className={styles.sectionTitle} marginBottom={4}>
        <Text variant="h2" as="h2">
          {licenseName ||
            formatMessage(fishingLicenseFurtherInformation.general.title)}
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
