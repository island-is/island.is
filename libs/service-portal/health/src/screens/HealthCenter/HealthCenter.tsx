import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  ErrorScreen,
  EmptyState,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useGetHealthCenterQuery } from './HealthCenter.generated'
import {
  AlertMessage,
  Box,
  Divider,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { IntroHeader, useQueryParam } from '@island.is/portals/core'
import { messages } from '../../lib/messages'
import HistoryTable from './HistoryTable'
import subYears from 'date-fns/subYears'
import { HealthPaths } from '../../lib/paths'
import { messages as hm } from '../../lib/messages'
import { Organization } from '@island.is/shared/types'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'

const DEFAULT_DATE_TO = new Date()
const DEFAULT_DATE_FROM = subYears(DEFAULT_DATE_TO, 10)
const HEALTH_CENTER_LOGO_PATH = 'Sjúkratryggingar'

const HealthCenter = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetHealthCenterQuery({
    variables: {
      input: {
        dateFrom: DEFAULT_DATE_FROM,
        dateTo: DEFAULT_DATE_TO,
      },
    },
  })

  const healthCenterData = data?.rightsPortalUserHealthCenterRegistration

  const organizations = (data?.getOrganizations?.items ??
    []) as Array<Organization>

  const organizationImage = getOrganizationLogoUrl(
    HEALTH_CENTER_LOGO_PATH,
    organizations,
    96,
  )

  const wasTransfered = useQueryParam('s') === 't'

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.healthCenter).toLowerCase(),
        })}
      />
    )
  }
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.healthCenterTitle)}
        intro={formatMessage(messages.healthCenterDescription)}
        img={organizationImage}
      />

      {!loading && !healthCenterData?.current && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {wasTransfered && !loading && (
        <Box width="full" marginTop={4}>
          <AlertMessage
            type="success"
            title={formatMessage(
              messages.healthCenterRegisterationTransferSuccessTitle,
            )}
            message={`${formatMessage(
              messages.healthCenterRegisterationTransferSuccessInfo,
            )} ${healthCenterData?.current?.healthCenterName}`}
          />
        </Box>
      )}

      {healthCenterData?.current && (
        <Box width="full" marginTop={[1, 1, 4]}>
          <Stack space={2}>
            <UserInfoLine
              title={formatMessage(messages.myRegisteration)}
              label={formatMessage(messages.healthCenterTitle)}
              content={healthCenterData.current.healthCenterName ?? ''}
              editLink={{
                url: HealthPaths.HealthCenterRegisteration,
                title: hm.changeRegisteration,
                icon: 'open',
              }}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(messages.personalDoctor)}
              content={healthCenterData.current.doctor ?? ''}
            />
            <Divider />
          </Stack>
        </Box>
      )}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !error && healthCenterData?.history && (
        <HistoryTable history={healthCenterData.history} />
      )}
      <Box marginTop={6}>
        <Text fontWeight="regular" variant="small">
          {formatMessage(hm.healthCenterOverviewInfo)}
        </Text>
      </Box>
    </Box>
  )
}

export default HealthCenter
