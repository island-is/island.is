import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  EmptyState,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  SJUKRATRYGGINGAR_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import subYears from 'date-fns/subYears'
import { useLocation } from 'react-router-dom'
import { messages as hm, messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetHealthCenterQuery } from './HealthCenter.generated'
import HistoryTable from './HistoryTable'

const DEFAULT_DATE_TO = new Date()
const DEFAULT_DATE_FROM = subYears(DEFAULT_DATE_TO, 10)

const HealthCenter = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const location = useLocation()

  // Check if the user was transfered from another health center
  const wasSuccessfulTransfer = location?.state?.transferSuccess

  const { loading, error, data } = useGetHealthCenterQuery({
    variables: {
      input: {
        dateFrom: DEFAULT_DATE_FROM,
        dateTo: DEFAULT_DATE_TO,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const healthCenterData = data?.rightsPortalHealthCenterRegistrationHistory

  const canRegister = healthCenterData?.canRegister ?? false
  const neighborhoodCenter = healthCenterData?.neighborhoodCenter ?? null

  if (loading)
    return (
      <Box>
        <Stack space={4}>
          <SkeletonLoader repeat={4} space={2} />
          <CardLoader />
        </Stack>
      </Box>
    )

  if (error && !loading) {
    return <Problem error={error} noBorder={false} />
  }

  return (
    <IntroWrapper
      marginBottom={[6, 6, 10]}
      title={formatMessage(messages.healthCenterTitle)}
      intro={formatMessage(messages.healthCenterDescription)}
      serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
      serviceProviderTooltip={formatMessage(messages.healthTooltip)}
    >
      {wasSuccessfulTransfer && !loading && (
        <Box width="full" marginTop={4}>
          <AlertMessage
            type="success"
            title={formatMessage(
              messages.healthCenterRegistrationTransferSuccessTitle,
            )}
            message={`${formatMessage(
              messages.healthCenterRegistrationTransferSuccessInfo,
            )} ${healthCenterData?.current?.healthCenterName}`}
          />
        </Box>
      )}

      {!loading && !healthCenterData?.current && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {healthCenterData?.current && (
        <Box width="full" marginTop={[1, 1, 4]}>
          <InfoLineStack
            space={2}
            label={formatMessage(messages.myRegistration)}
          >
            <InfoLine
              label={formatMessage(messages.healthCenterTitle)}
              content={
                healthCenterData.current.healthCenterName ??
                formatMessage(messages.healthCenterNoHealthCenterRegistered)
              }
              button={
                canRegister
                  ? {
                      type: 'link',
                      to: HealthPaths.HealthCenterRegistration,
                      label: hm.changeRegistration,
                    }
                  : undefined
              }
            />
            <InfoLine
              label={formatMessage(messages.personalDoctor)}
              content={
                healthCenterData.current.doctor ??
                formatMessage(messages.healthCenterNoDoctor)
              }
            />
            {neighborhoodCenter && (
              <InfoLine
                label={formatMessage(messages.neighborhoodHealthCenter)}
                content={neighborhoodCenter}
              />
            )}
          </InfoLineStack>
        </Box>
      )}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !error && healthCenterData?.history?.length ? (
        <HistoryTable history={healthCenterData.history} />
      ) : null}
    </IntroWrapper>
  )
}

export default HealthCenter
