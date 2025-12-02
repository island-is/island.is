import {
  HealthDirectorateOrganDonor,
  RightsPortalBloodType,
  RightsPortalHealthCenterRegistrationHistory,
} from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InfoCardGrid } from '@island.is/portals/my-pages/core'
import { isDefined } from '@island.is/shared/utils'
import React from 'react'
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

  const doctor = healthCenter.data?.current?.doctor

  const allEmpty =
    !isDefined(healthCenter.data) &&
    !isDefined(dentists.data) &&
    !isDefined(donor.data) &&
    !isDefined(blood.data)

  const anyLoading =
    healthCenter.loading || dentists.loading || donor.loading || blood.loading

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
            description: donor.data?.limitations?.hasLimitations
              ? formatMessage(messages.youAreOrganDonorWithExceptions)
              : donor.data?.isDonor
              ? formatMessage(messages.youAreOrganDonor)
              : formatMessage(messages.youAreNotOrganDonor),

            to: HealthPaths.HealthOrganDonation,
            loading: donor.loading,
            error: donor.error,
          },
          {
            title: formatMessage(messages.bloodtype),
            description: blood.data?.registered
              ? formatMessage(messages.youAreInBloodGroup, {
                  arg: blood.data.type,
                })
              : formatMessage(messages.notRegistered),

            to: HealthPaths.HealthBloodtype,
            loading: blood.loading,
            error: blood.error,
          },
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
