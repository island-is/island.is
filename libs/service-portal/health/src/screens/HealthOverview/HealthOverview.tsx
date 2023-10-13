import { useLocale, useNamespaces } from '@island.is/localization'
import {
  useGetInsuranceConfirmationQuery,
  useGetInsuranceOverviewQuery,
} from './HealthOverview.generated'
import {
  ErrorScreen,
  ICELAND_ID,
  IntroHeader,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useUserInfo } from '@island.is/auth/react'
import { CONTENT_GAP, SECTION_GAP } from '../Medicine/constants'

export const HealthOverview = () => {
  useNamespaces('sp.health')

  const { formatMessage, formatDateFns } = useLocale()
  const user = useUserInfo()

  const { data, error, loading } = useGetInsuranceOverviewQuery()

  const insurance = data?.rightsPortalInsuranceOverview.items[0]
  const errors = data?.rightsPortalInsuranceOverview.errors

  const {
    data: file,
    error: fileError,
    loading: fileLoading,
  } = useGetInsuranceConfirmationQuery()

  const insuranceFile = file?.rightsPortalInsuranceConfirmation?.items[0]

  const getDocumentLink = (data: string) =>
    encodeURI(`data:application/pdf;base64,${data}`)

  if (error) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.overview).toLowerCase(),
        })}
      />
    )
  }

  return (
    <Box paddingY={4}>
      <Box marginBottom={SECTION_GAP}>
        <IntroHeader
          title={formatMessage(user.profile.name)}
          intro={formatMessage(messages.overviewIntro)}
          serviceProviderID={ICELAND_ID}
        />
      </Box>
      {loading || fileLoading ? (
        <SkeletonLoader
          repeat={3}
          space={2}
          height={24}
          borderRadius="standard"
        />
      ) : !insurance ? (
        <AlertMessage
          type="info"
          message={formatMessage(messages.noHealthInsurance)}
        />
      ) : (
        <Box>
          {!!errors?.length && (
            <Box marginBottom={CONTENT_GAP}>
              <Stack space={2}>
                {errors?.map((error, i) => (
                  <AlertMessage
                    // We can switch on error.status to show different messages, but for now there is only one error message
                    key={i}
                    type="warning"
                    title={formatMessage(
                      messages.healthInternalServiceErrorTitle,
                    )}
                    message={formatMessage(
                      messages.healthInternalServiceErrorInfo,
                    )}
                  />
                ))}
              </Stack>
            </Box>
          )}
          <Box
            marginBottom={SECTION_GAP}
            borderBottomWidth="standard"
            borderColor="blue200"
          >
            <Stack space={1} dividers="blueberry200">
              <Text variant="eyebrow" marginBottom={1} color="purple600">
                {formatMessage(messages.statusOfRights)}
              </Text>
              <UserInfoLine
                label={formatMessage(messages.hasHealthInsurance)}
                content={formatDateFns(insurance.updated)}
                labelColumnSpan={['5/12']}
                valueColumnSpan={['5/12']}
                editColumnSpan={['2/12']}
              />
              <UserInfoLine
                label={formatMessage(messages.healthInsuranceStart)}
                content={formatDateFns(insurance.from)}
                labelColumnSpan={['5/12']}
                valueColumnSpan={['5/12']}
                editColumnSpan={['2/12']}
                editLink={
                  insuranceFile && insuranceFile?.data
                    ? {
                        external: true,
                        url: getDocumentLink(insuranceFile?.data),
                        title: messages.seeCertificate,
                      }
                    : undefined
                }
              />
              <UserInfoLine
                label={formatMessage(messages.status)}
                content={insurance.status?.display ?? undefined}
                labelColumnSpan={['5/12']}
                valueColumnSpan={['5/12']}
                editColumnSpan={['2/12']}
              />
            </Stack>
          </Box>
          <Box
            marginBottom={SECTION_GAP}
            borderBottomWidth="standard"
            borderColor="blue200"
          >
            <Stack space={1} dividers="blueberry200">
              <Text variant="eyebrow" marginBottom={1} color="purple600">
                {formatMessage(messages.paymentParticipation)}
              </Text>
              <UserInfoLine
                label={formatMessage(messages.paymentTarget)}
                content={
                  formatMessage(messages.medicinePaymentPaidAmount, {
                    amount: insurance.maximumPayment,
                  }) ?? undefined
                }
                labelColumnSpan={['5/12']}
                valueColumnSpan={['5/12']}
                editColumnSpan={['2/12']}
              />
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HealthOverview
