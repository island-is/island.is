import {
  HealthDirectorateOrganDonor,
  RightsPortalBloodType,
  RightsPortalHealthCenterRegistrationHistory,
} from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InfoCardGrid } from '@island.is/portals/my-pages/core'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import React, { useEffect, useState } from 'react'
import { messages } from '../../..'
import { HealthPaths } from '../../../lib/paths'
import { DataState } from '../../../utils/types'
import { isDefined } from '@island.is/shared/utils'

interface Props {
  healthCenter: DataState<RightsPortalHealthCenterRegistrationHistory | null>
  dentists: DataState<string | null>
  donor: DataState<Pick<
    HealthDirectorateOrganDonor,
    'isDonor' | 'limitations'
  > | null>
  blood: DataState<RightsPortalBloodType | null>
}
const BasicInformation: React.FC<Props> = ({
  healthCenter,
  dentists,
  donor,
  blood,
}) => {
  const { formatMessage } = useLocale()
  const [showBloodtype, setShowBloodtype] = useState<boolean>(false)

  const doctor = healthCenter.data?.current?.doctor
  const featureFlagClient = useFeatureFlagClient()

  const allEmpty =
    !isDefined(healthCenter.data) &&
    !isDefined(dentists.data) &&
    !isDefined(donor.data) &&
    !isDefined(blood.data)

  const anyLoading =
    healthCenter.loading || dentists.loading || donor.loading || blood.loading

  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.servicePortalHealthBloodPageEnabled,
        false,
      )
      if (ffEnabled) {
        setShowBloodtype(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Text variant="eyebrow" color="foregroundBrandSecondary" marginBottom={2}>
        {formatMessage(messages.basicInformation)}
      </Text>
      <InfoCardGrid
        cards={[
          {
            title: healthCenter.error
              ? formatMessage(messages.healthCenter)
              : healthCenter.data?.current?.healthCenterName ??
                formatMessage(messages.healthCenterNoHealthCenterRegistered),
            description: doctor
              ? formatMessage(messages.healthCenterDoctorLabel, {
                  doctor: doctor,
                })
              : formatMessage(messages.healthCenterNoDoctor),
            to: HealthPaths.HealthCenter,
            loading: healthCenter.loading,
            error: healthCenter.error,
          },
          {
            title: formatMessage(messages.dentist),
            description:
              dentists.data ?? formatMessage(messages.noDentistRegistered),
            to: HealthPaths.HealthDentists,
            loading: dentists.loading,
            error: dentists.error,
          },

          {
            title: formatMessage(messages.organDonation),
            description: donor.data?.isDonor
              ? formatMessage(messages.youAreOrganDonor)
              : donor.data?.limitations?.hasLimitations
              ? formatMessage(messages.youAreOrganDonorWithExceptions)
              : formatMessage(messages.youAreNotOrganDonor),

            to: HealthPaths.HealthOrganDonation,
            loading: donor.loading,
            error: donor.error,
          },
          showBloodtype
            ? {
                title: formatMessage(messages.bloodtype),
                description: blood.data?.registered
                  ? formatMessage(messages.youAreInBloodGroup, {
                      arg: blood.data.type,
                    })
                  : formatMessage(messages.notRegistered),

                to: HealthPaths.HealthBloodtype,
                loading: blood.loading,
                error: blood.error,
              }
            : null,
        ]}
        empty={
          !anyLoading && allEmpty
            ? {
                title: formatMessage(messages.noBasicInfo),
                description: '',
              }
            : undefined
        }
        variant="link"
      />
    </Box>
  )
}

export default BasicInformation
