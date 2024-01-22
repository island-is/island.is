import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { useGetDrugCertificatesQuery } from './Medicine.generated'
import { SECTION_GAP } from './constants'
import { ActionCard, m } from '@island.is/service-portal/core'
import { HealthPaths } from '../../lib/paths'
import { MedicineWrapper } from './wrapper/MedicineWrapper'
import { Problem } from '@island.is/react-spa/shared'

export const MedicineLicense = () => {
  const { formatMessage } = useLocale()

  const { data, error, loading } = useGetDrugCertificatesQuery()

  return (
    <MedicineWrapper pathname={HealthPaths.HealthMedicineCertificates}>
      <Box marginBottom={SECTION_GAP}>
        <Text variant="h5" marginBottom={1}>
          {formatMessage(messages.medicineCalculatorIntroTitle)}
        </Text>
        <Text>{formatMessage(messages.medicineCalculatorIntroText)}</Text>
      </Box>
      {error ? (
        <Problem
          size="small"
          noBorder={false}
          type="internal_service_error"
          error={error}
        />
      ) : loading ? (
        <SkeletonLoader space={2} repeat={3} />
      ) : (
        <Box marginY={5}>
          {data?.rightsPortalDrugCertificates.length === 0 ? (
            <AlertMessage
              type="info"
              message={formatMessage(messages.medicineNoIssuedCertificates)}
            />
          ) : (
            <Stack space={3}>
              {data?.rightsPortalDrugCertificates.map((certificate, i) => {
                return (
                  <ActionCard
                    key={i}
                    heading={certificate.drugName ?? undefined}
                    tag={{
                      label: formatMessage(
                        certificate.processed === false
                          ? messages.medicineIsProcessedCertificate
                          : certificate.valid
                          ? messages.medicineIsValidCertificate
                          : certificate.rejected
                          ? messages.medicineIsRejectedCertificate
                          : certificate.expired
                          ? messages.medicineIsExpiredCertificate
                          : messages.medicineIsNotValidCertificate,
                      ),
                      variant:
                        certificate.processed === false
                          ? 'darkerBlue'
                          : certificate.valid
                          ? 'blue'
                          : 'red',
                    }}
                    text={certificate.atcName ?? undefined}
                    cta={{
                      label: formatMessage(m.view),
                      variant: 'text',
                      url: certificate.id
                        ? HealthPaths.HealthMedicineCertificate.replace(
                            ':name',
                            certificate.drugName ?? certificate.id.toString(),
                          ).replace(':id', certificate.id.toString())
                        : undefined,
                    }}
                  />
                )
              })}
            </Stack>
          )}
        </Box>
      )}
    </MedicineWrapper>
  )
}

export default MedicineLicense
