import { useState } from 'react'

import {
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { ApplicationsList } from '../../../../../components/applications-list'
import { Stack, useLocalSearchParams } from 'expo-router'
import { StackScreen } from '../../../../../components/stack-screen'

export default function ApplicationsByStatusScreen() {
  const [refetching, setRefetching] = useState(false)
  const params = useLocalSearchParams<{
    status: ApplicationResponseDtoStatusEnum
  }>()

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: [params.status],
      },
      locale: useLocale(),
    },
  })

  return (
    <>
      <StackScreen networkStatus={applicationsRes.networkStatus} options={{
        title: params.status,
      }} />
      <ApplicationsList
        applicationsRes={applicationsRes}
        displayProgress
        displayDescription={false}
        onRefetch={setRefetching}
      />
    </>
  )
}
