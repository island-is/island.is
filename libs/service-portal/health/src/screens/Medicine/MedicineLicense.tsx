import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { useGetDrugCertificatesQuery } from './Medicine.generated'
import { SECTION_GAP } from './constants'
import { ActionCard, IntroHeader, m } from '@island.is/service-portal/core'
import { HealthPaths } from '../../lib/paths'
import { MedicineWrapper } from './wrapper/MedicineWrapper'

export const MedicineLicense = () => {
  const { formatMessage } = useLocale()

  const { data, error, loading } = useGetDrugCertificatesQuery()

  return (
    <MedicineWrapper pathname={HealthPaths.HealthMedicineCertificates}>
      <Box marginBottom={SECTION_GAP}>
        <IntroHeader
          title={formatMessage(messages.medicineLicenseIntroTitle)}
          span={['8/8', '8/8', '8/8', '5/8', '5/8']}
          intro={formatMessage(messages.medicineLicenseIntroText)}
          isSubheading
        />
      </Box>
      {error ? (
        <AlertMessage
          type="error"
          title={formatMessage(m.errorTitle)}
          message={formatMessage(m.errorFetch)}
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
                        certificate.approved
                          ? messages.medicineIsValidCertificate
                          : messages.medicineIsNotValidCertificate,
                      ),
                      variant: certificate?.approved ? 'blue' : 'red',
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
