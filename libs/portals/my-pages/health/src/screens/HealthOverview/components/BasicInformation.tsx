import {
  HealthDirectorateOrganDonor,
  RightsPortalHealthCenterRegistrationHistory,
  RightsPortalInsuranceOverview,
} from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  InfoCardGrid,
  isDateAfterToday,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../..'
import { HealthPaths } from '../../../lib/paths'

interface Props {
  healthCenterData?: RightsPortalHealthCenterRegistrationHistory | null
  healthCenterLoading: boolean
  healthCenterError: boolean
  dentistsData?: string | null
  dentistsLoading: boolean
  dentistError: boolean
  insuranceData?: RightsPortalInsuranceOverview | null
  insuranceLoading: boolean
  insuranceError: boolean
  donorData?: Pick<
    HealthDirectorateOrganDonor,
    'isDonor' | 'limitations'
  > | null
  donorLoading: boolean
  donorError: boolean
}
const BasicInformation: React.FC<Props> = ({
  healthCenterData,
  healthCenterLoading,
  healthCenterError,
  dentistsData,
  dentistsLoading,
  dentistError,
  donorData,
  donorLoading,
  donorError,
  insuranceData,
  insuranceLoading,
  insuranceError,
}) => {
  const { formatMessage } = useLocale()

  const doctor = healthCenterData?.current?.doctor
  const isInsuranceCardValid = isDateAfterToday(
    insuranceData?.ehicCardExpiryDate ?? undefined,
  )
  const isInsured = insuranceData?.isInsured

  return (
    <Box>
      <Text variant="eyebrow" color="foregroundBrandSecondary" marginBottom={2}>
        {formatMessage(messages.basicInformation)}
      </Text>
      <InfoCardGrid
        cards={[
          healthCenterError
            ? null
            : {
                title:
                  healthCenterData?.current?.healthCenterName ??
                  formatMessage(messages.healthCenterNoHealthCenterRegistered),
                description: doctor
                  ? formatMessage(messages.healthCenterDoctorLabel, {
                      doctor: doctor,
                    })
                  : formatMessage(messages.healthCenterNoDoctor),
                to: HealthPaths.HealthCenter,
                loading: healthCenterLoading,
              },
          dentistError
            ? null
            : {
                title: formatMessage(messages.dentist),
                description:
                  dentistsData ?? formatMessage(messages.noDentistRegistered),
                to: HealthPaths.HealthDentists, // TODO -> Hvert fer þessi síða
                loading: dentistsLoading,
              },
          insuranceError
            ? null
            : {
                title: formatMessage(messages.hasHealthInsurance),
                description: `${formatMessage(messages.from)} ${formatDate(
                  insuranceData?.from,
                )}`,
                to: HealthPaths.HealthInsurance, // TODO -> Hvert fer þessi síða
                icon: {
                  color: isInsured ? 'mint600' : 'red400',
                  type: isInsured ? 'checkmarkCircle' : 'closeCircle',
                },
                loading: insuranceLoading,
              },
          insuranceError
            ? null
            : {
                title: formatMessage(messages.ehic),
                description: `${formatMessage(
                  isInsuranceCardValid
                    ? messages.medicineValidTo
                    : messages.medicineIsExpiredCertificate,
                )} ${formatDate(insuranceData?.ehicCardExpiryDate)}`,
                to: HealthPaths.HealthInsurance, // TODO -> Hvert fer þessi síða
                icon: {
                  color: isInsuranceCardValid ? 'mint600' : 'red400',
                  type: isInsuranceCardValid
                    ? 'checkmarkCircle'
                    : 'closeCircle',
                },
                loading: insuranceLoading,
              },
          donorError
            ? null
            : {
                title: formatMessage(messages.organDonation),
                description: donorData?.isDonor
                  ? formatMessage(messages.youAreOrganDonor)
                  : donorData?.limitations?.hasLimitations
                  ? formatMessage(messages.youAreOrganDonorWithExceptions)
                  : formatMessage(messages.youAreNotOrganDonor),

                to: HealthPaths.HealthOrganDonation,
                loading: donorLoading,
              },
          // TODO: Kemur inn þegar blóðflokka pull requestan er komin inn
          // {
          //   title: 'Blóðflokkur',
          //   description: 'Þú ert í blóðflokki A+',
          //   to: HealthPaths.HealthCenter,
          // },
          // TODO: Kemur inn þegar ofnæmisþjónustan er ready
          // {
          //   title: 'Ofnæmi',
          //   description: 'Ekkert skráð ofnæmi',
          //   to: HealthPaths.HealthCenter,
          // },
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
