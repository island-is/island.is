import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, SkeletonLoader, Text } from '@island.is/island-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { FishingLicenseAlertMessage, ShipInformation } from '../components'
import {
  FishingLicenseLicense as FishingLicenseSchema,
  FishingLicenseListOptions,
  FishingLicenseShip as Ship,
} from '@island.is/api/schema'
import { useQuery } from '@apollo/client'
import { queryFishingLicense } from '../../graphql/queries'
import { RadioController } from '@island.is/shared/form-fields'
import { fishingLicense } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { FishingLicenseEnum } from '../../types'
import {
  AREAS_FIELD_ID,
  AREA_FIELD_ID,
  ATTACHMENTS_FIELD_ID,
  ATTACHMENT_INFO_FIELD_ID,
  DATE_CONSTRAINTS_FIELD_ID,
  NEEDS_OWNERSHIP_REGISTRATION_FIELD_ID,
  RAILNET_FIELD_ID,
  ROENET_FIELD_ID,
} from '../../utils/fields'

export const FishingLicense: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { register, getValues, setValue } = useFormContext()
  const selectedChargeType = getValueViaPath(
    application.answers,
    'fishingLicense.chargeType',
    '',
  ) as string
  const [chargeType, setChargeType] = useState<string>(selectedChargeType || '')
  const ships = getValueViaPath(
    application.externalData,
    'directoryOfFisheries.data.ships',
  ) as Ship[]
  const shipIndex = getValueViaPath(
    application.answers,
    'shipSelection.ship',
    '0',
  ) as string
  const registrationNumber = getValueViaPath(
    application.answers,
    'shipSelection.registrationNumber',
  ) as string

  const { data, loading } = useQuery(queryFishingLicense, {
    variables: {
      registrationNumber: parseInt(registrationNumber),
    },
  })

  const ship = ships[parseInt(shipIndex)]

  // Updates areas for answer object for current license
  const handleAreaChange = (areas: FishingLicenseListOptions[]) => {
    setValue(AREAS_FIELD_ID, areas)
  }

  // Updates areas for answer object for current license
  const handleDateConstraintChange = (
    dateFrom?: string | null,
    dateTo?: string | null,
  ) => {
    setValue(DATE_CONSTRAINTS_FIELD_ID, { dateFrom, dateTo })
  }

  // Updates attachment info for answer object for current license
  const handleAttatchmentInfoChange = (info: string) => {
    setValue(ATTACHMENT_INFO_FIELD_ID, info)
  }

  // setup extra fields, i.e. areas and attachment info for application
  // based on selected application for current license
  const initializeExtraFields = (licenseCode: string) => {
    const selectedLicense = data?.fishingLicenses?.find(
      ({ fishingLicenseInfo }: FishingLicenseSchema) =>
        fishingLicenseInfo.code === licenseCode,
    ) as FishingLicenseSchema
    if (selectedLicense) {
      handleAreaChange(selectedLicense.areas || [])
      handleAttatchmentInfoChange(selectedLicense.attachmentInfo || '')
    }
  }

  const handleOnSelect = (value: string) => {
    const selectedLicense = data?.fishingLicenses?.find(
      ({ fishingLicenseInfo }: FishingLicenseSchema) =>
        fishingLicenseInfo.code === value,
    ) as FishingLicenseSchema

    if (selectedLicense) {
      setChargeType(selectedLicense.fishingLicenseInfo.chargeType)
      handleAreaChange(selectedLicense.areas || [])
      handleAttatchmentInfoChange(selectedLicense.attachmentInfo || '')
      handleDateConstraintChange(
        selectedLicense.dateRestriction?.dateFrom || null,
        selectedLicense.dateRestriction?.dateTo || null,
      )
      setValue(
        NEEDS_OWNERSHIP_REGISTRATION_FIELD_ID,
        selectedLicense.needsOwnershipRegistration || false,
      )
    }
  }

  // If charge type is set to unknown initially the front-end signals error
  // And nullifies the selected charge type so user cannot continue
  useEffect(() => {
    if (selectedChargeType === FishingLicenseEnum.UNKNOWN) {
      setValue(`${field.id}.license`, null)
    }
    initializeExtraFields(selectedChargeType)
  }, [])

  // Reinitialize license type when user changes charge type
  // If any values are not undefined in this step where they should be
  // User cannot proceed, so this fixes the problem of user getting stuck
  // after navigating here from the next step after inputting values there
  useEffect(() => {
    if (getValues(AREA_FIELD_ID) !== undefined) {
      setValue(AREA_FIELD_ID, undefined)
    }
    if (getValues(RAILNET_FIELD_ID) !== undefined) {
      setValue(RAILNET_FIELD_ID, undefined)
    }
    if (getValues(ROENET_FIELD_ID) !== undefined) {
      setValue(ROENET_FIELD_ID, undefined)
    }
    if (getValues(ATTACHMENTS_FIELD_ID) !== undefined) {
      setValue(ATTACHMENTS_FIELD_ID, undefined)
    }
    setValue(`${field.id}.chargeType`, chargeType)
  }, [chargeType])

  return (
    <>
      <Box marginBottom={3}>
        <Box
          border="standard"
          borderRadius="large"
          padding={3}
          width="full"
          display="flex"
          justifyContent="spaceBetween"
        >
          <ShipInformation ship={ship} seaworthinessHasColor />
        </Box>
      </Box>
      <Box>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(fishingLicense.labels.radioButtonTitle)}
        </Text>
        {loading ? (
          <SkeletonLoader
            repeat={2}
            space={2}
            height={75}
            borderRadius="standard"
          />
        ) : (
          <>
            <RadioController
              id={`${field.id}.license`}
              largeButtons
              backgroundColor="blue"
              error={errors && getErrorViaPath(errors, `${field.id}.license`)}
              onSelect={(value) => handleOnSelect(value)}
              options={data?.fishingLicenses
                ?.filter(
                  ({ answer, fishingLicenseInfo }: FishingLicenseSchema) =>
                    answer && fishingLicenseInfo.code !== 'unknown',
                )
                .map(({ fishingLicenseInfo }: FishingLicenseSchema) => {
                  return {
                    value: fishingLicenseInfo.code,
                    label:
                      formatMessage(
                        fishingLicense.labels[fishingLicenseInfo.code],
                      ) || '',
                    tooltip:
                      fishingLicenseInfo.code !== 'hookCatchLimit' &&
                      fishingLicenseInfo.code !== 'catchMark'
                        ? ''
                        : formatMessage(
                            fishingLicense.tooltips[fishingLicenseInfo.code],
                          ),
                  }
                })}
            />
            {data?.fishingLicenses.map(
              ({
                fishingLicenseInfo,
                answer,
                reasons,
              }: FishingLicenseSchema) => {
                if (
                  answer ||
                  reasons.length === 0 ||
                  fishingLicenseInfo.code === 'unknown'
                )
                  return null
                const warningTitle = formatMessage(
                  fishingLicense.warningMessageTitle.licenseForbidden,
                )
                const warningText = formatMessage(
                  fishingLicense.warningMessageDescription.licenseForbidden,
                )
                const licenseName =
                  formatMessage(
                    fishingLicense.labels[fishingLicenseInfo.code],
                  ) || ''
                return (
                  <Box marginBottom={2} key={fishingLicenseInfo.code}>
                    <FishingLicenseAlertMessage
                      title={`${warningTitle} ${licenseName}`}
                      description={`${warningText} ${licenseName}`}
                      reasons={reasons}
                    />
                  </Box>
                )
              },
            )}
          </>
        )}
        <input
          type="hidden"
          id={`${field.id}.chargeType`}
          {...register(`${field.id}.chargeType`, { required: true })}
          value={chargeType}
        />
      </Box>
    </>
  )
}
