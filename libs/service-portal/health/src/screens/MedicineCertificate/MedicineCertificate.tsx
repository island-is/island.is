import { useParams } from 'react-router-dom'
import { useGetCertificateByIdQuery } from './MedicineCertificate.generated'
import { Box, Icon, Stack, Text } from '@island.is/island-ui/core'
import { GoBack, UserInfoLine } from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { HealthPaths } from '../../lib/paths'

type UseParams = {
  type: string
  id: string
}

export const MedicineCertificate = () => {
  const params = useParams() as UseParams

  const { formatMessage, formatDateFns } = useLocale()

  const { data } = useGetCertificateByIdQuery({
    variables: {
      input: {
        id: parseInt(params.id),
      },
    },
  })

  const certificate = data?.rightsPortalGetCertificateById

  return (
    <Box paddingTop={4}>
      <Stack dividers="blueberry200" space={1}>
        <GoBack
          path={HealthPaths.HealthMedicineCertificates}
          label={formatMessage(messages.medicineLicenseIntroTitle)}
        />
        {certificate && (
          <>
            {certificate.drugName && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineDrugName)}
                content={certificate.drugName}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.atcCode && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineAtcCode)}
                content={certificate.atcCode}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.atcName && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineAtcName)}
                content={certificate.atcName}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.validFrom && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineValidFrom)}
                content={formatDateFns(certificate.validFrom, 'dd.MM.yyyy')}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.validTo && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineValidTo)}
                content={formatDateFns(certificate.validTo, 'dd.MM.yyyy')}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.doctor && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineNameOfDoctor)}
                content={certificate.doctor}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.approved !== null && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.status)}
                content={
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    columnGap="p1"
                  >
                    <Text>
                      {formatMessage(
                        certificate.approved
                          ? messages.medicineIsValidCertificate
                          : messages.medicineIsNotValidCertificate,
                      )}
                    </Text>
                    <Icon
                      icon={
                        certificate.approved ? 'checkmarkCircle' : 'closeCircle'
                      }
                      color={certificate.approved ? 'mint600' : 'red600'}
                      type="filled"
                    />
                  </Box>
                }
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
          </>
        )}
      </Stack>
    </Box>
  )
}

export default MedicineCertificate
