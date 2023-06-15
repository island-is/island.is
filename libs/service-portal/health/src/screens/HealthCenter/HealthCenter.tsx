import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  ErrorScreen,
  EmptyState,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useGetHealthCenterQuery } from './HealthCenter.generated'
import { Box, Divider, SkeletonLoader, Stack } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../lib/messages'
import { useState } from 'react'
import HistoryTable from './HistoryTable'

interface CurrentInfo {
  healthCenter: string
  doctor: string
}

const HealthCenter = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const [selectedDateFrom, setSelectedDateFrom] = useState(
    new Date('2010-11-03'),
  )
  const [selectedDateTo, setSelectedDateTo] = useState(new Date('2017-09-22'))
  const [currentInfo, setCurrentInfo] = useState<CurrentInfo>()

  const { loading, error, data } = useGetHealthCenterQuery({
    variables: {
      input: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
      },
    },
  })

  const healthCenterData = data?.rightsPortalHealthCenterHistory

  if (!currentInfo && healthCenterData?.current) {
    setCurrentInfo({
      healthCenter: healthCenterData.current.name ?? '',
      doctor: healthCenterData.current.doctor ?? '',
    })
  }

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
      />

      {!loading && !data && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {currentInfo && (
        <Box width="full" marginTop={[1, 1, 4]}>
          <Stack space={2}>
            <UserInfoLine
              title={formatMessage(messages.yourInformation)}
              label={formatMessage(messages.healthCenterTitle)}
              content={currentInfo.healthCenter ?? ''}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(messages.personalDoctor)}
              content={currentInfo.doctor ?? ''}
            />
          </Stack>
        </Box>
      )}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !error && healthCenterData?.history && (
        <HistoryTable history={healthCenterData.history} />
      )}
    </Box>
  )
}

export default HealthCenter
