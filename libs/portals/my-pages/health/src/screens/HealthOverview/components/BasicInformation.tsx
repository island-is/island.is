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
          healthCenter.error
            ? null
            : {
                title:
                  healthCenter.data?.current?.healthCenterName ??
                  formatMessage(messages.healthCenterNoHealthCenterRegistered),
                description: doctor
                  ? formatMessage(messages.healthCenterDoctorLabel, {
                      doctor: doctor,
                    })
                  : formatMessage(messages.healthCenterNoDoctor),
                to: HealthPaths.HealthCenter,
                loading: healthCenter.loading,
              },
          dentists.error
            ? null
            : {
                title: formatMessage(messages.dentist),
                description:
                  dentists.data ?? formatMessage(messages.noDentistRegistered),
                to: HealthPaths.HealthDentists,
                loading: dentists.loading,
              },

          donor.error
            ? null
            : {
                title: formatMessage(messages.organDonation),
                description: donor.data?.isDonor
                  ? formatMessage(messages.youAreOrganDonor)
                  : donor.data?.limitations?.hasLimitations
                  ? formatMessage(messages.youAreOrganDonorWithExceptions)
                  : formatMessage(messages.youAreNotOrganDonor),

                to: HealthPaths.HealthOrganDonation,
                loading: donor.loading,
              },
          showBloodtype
            ? blood.error
              ? null
              : {
                  title: formatMessage(messages.bloodtype),
                  description: blood.data?.registered
                    ? blood.data.type
                    : formatMessage(messages.notRegistered),

                  to: HealthPaths.HealthBloodtype,
                  loading: blood.loading,
                }
            : null,
        ]}
        empty={{
          title: formatMessage(messages.noBasicInfo),
          description: '',
        }}
        variant="link"
      />
    </Box>
  )
}

export default BasicInformation
