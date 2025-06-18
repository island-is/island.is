import {
  HealthDirectorateOrganDonor,
  RightsPortalHealthCenterRegistrationHistory,
} from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InfoCardGrid } from '@island.is/portals/my-pages/core'
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
}
const BasicInformation: React.FC<Props> = ({
  healthCenter,
  dentists,
  donor,
}) => {
  const { formatMessage } = useLocale()

  const doctor = healthCenter.data?.current?.doctor

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
