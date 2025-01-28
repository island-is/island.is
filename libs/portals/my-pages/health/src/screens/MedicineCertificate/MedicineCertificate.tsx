import {
  Box,
  Icon,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useParams } from 'react-router-dom'
import { useGetCertificateByIdQuery } from './MedicineCertificate.generated'

import { useLocale } from '@island.is/localization'
import {
  IntroWrapper,
  SJUKRATRYGGINGAR_SLUG,
  UserInfoLine,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { ExtraDoctors } from './components/ExtraDoctors'

type UseParams = {
  type: string
  id: string
}

export const MedicineCertificate = () => {
  const params = useParams() as UseParams

  const { formatMessage, formatDateFns } = useLocale()

  const { data, loading, error } = useGetCertificateByIdQuery({
    variables: {
      input: {
        id: parseInt(params.id),
      },
    },
  })

  const certificate = data?.rightsPortalGetCertificateById

  const isLoading = loading && !error && !data
  const hasError = error && !loading && !data

  return (
    <IntroWrapper
      title={formatMessage(messages.medicineLicenseTitle)}
      intro={formatMessage(messages.medicineLicenseIntroText)}
      serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
      serviceProviderTooltip={formatMessage(messages.healthTooltip)}
    >
      <Stack dividers="blueberry200" space={1}>
        {isLoading && <SkeletonLoader height={35} space={2} repeat={4} />}
        {hasError && <Problem error={error} noBorder={false} />}
        {certificate && !isLoading && (
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
            {certificate.methylDoctors && certificate.methylDoctors.length && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineNameOfDocExtra)}
                content={<ExtraDoctors doctors={certificate.methylDoctors} />}
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
                        certificate.processed === false
                          ? messages.medicineIsProcessedCertificate
                          : certificate.valid
                          ? messages.medicineIsValidCertificate
                          : certificate.rejected
                          ? messages.medicineIsRejectedCertificate
                          : certificate.expired
                          ? messages.medicineIsExpiredCertificate
                          : messages.medicineIsNotValidCertificate,
                      )}
                    </Text>
                    <Icon
                      icon={
                        certificate.processed === false
                          ? 'informationCircle'
                          : certificate.valid
                          ? 'checkmarkCircle'
                          : 'closeCircle'
                      }
                      color={
                        certificate.processed === false
                          ? 'blue600'
                          : certificate.valid
                          ? 'mint600'
                          : 'red600'
                      }
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
    </IntroWrapper>
  )
}

export default MedicineCertificate
