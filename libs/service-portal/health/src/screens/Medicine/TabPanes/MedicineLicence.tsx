import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, m } from '@island.is/portals/core'
import { messages } from '../../../lib/messages'
import { useGetDrugCertificatesQuery } from '../Medicine.generated'
import { SECTION_GAP } from '../constants'
import { ActionCard } from '@island.is/service-portal/core'
import { HealthPaths } from '../../../lib/paths'

export const MedicineLicence = () => {
  const { formatMessage } = useLocale()

  const { data, error, loading } = useGetDrugCertificatesQuery()

  return (
    <Box paddingY={4}>
      <Box marginBottom={SECTION_GAP}>
        <IntroHeader
          title={formatMessage(messages.medicineLicenseIntroTitle)}
          intro={formatMessage(messages.medicineLicenseIntroText)}
          isSubheading
        />
      </Box>
      {error ? (
        <AlertMessage
          type="error"
          title={formatMessage(m.errorPageHeading)}
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
                      variant: 'blue',
                    }}
                    text={certificate.atcName ?? undefined}
                    cta={{
                      label: formatMessage(m.view),
                      variant: 'text',
                      url: certificate.id
                        ? HealthPaths.HealthMedicineCertificate.replace(
                            ':name',
                            certificate.drugName ?? '',
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
    </Box>
  )
}
