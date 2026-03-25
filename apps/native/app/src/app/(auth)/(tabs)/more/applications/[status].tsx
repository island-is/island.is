import { useMemo, useState } from 'react'

import {
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { ApplicationsList } from '../../../../../components/applications-list'
import { Stack, useLocalSearchParams } from 'expo-router'
import { StackScreen } from '../../../../../components/stack-screen'
import { useIntl } from 'react-intl'

export default function ApplicationsByStatusScreen() {
  const intl = useIntl()
  const [refetching, setRefetching] = useState(false)
  const params = useLocalSearchParams<{
    status: string
  }>()

  const status = useMemo(() => {
    switch (params.status) {
      case 'incomplete':
        return [ApplicationResponseDtoStatusEnum.Draft];
      case 'completed':
        return [ApplicationResponseDtoStatusEnum.Completed];
      case 'in-progress':
        return [ApplicationResponseDtoStatusEnum.Inprogress];
    }
    return [];
  }, [params.status, intl])

  const title = useMemo(() => {
    switch (params.status) {
      case 'incomplete':
        return intl.formatMessage({ id: 'applications.incomplete' })
      case 'completed':
        return intl.formatMessage({ id: 'applications.completed' })
      case 'in-progress':
        return intl.formatMessage({ id: 'applications.inProgress' })
      default:
        return ''
    }
  }, [params.status, intl])

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: status,
      },
      locale: useLocale(),
    },
  })
  return (
    <>
      <StackScreen
        networkStatus={applicationsRes.networkStatus}
        options={{
          title,
        }}
      />
      <ApplicationsList
        applicationsRes={applicationsRes}
        displayProgress
        displayDescription={false}
        onRefetch={setRefetching}
      />
    </>
  )
}
