import { useState } from 'react'

import {
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { ApplicationsList } from '@/screens/applications/components/applications-list'

export default function ApplicationsIncompleteScreen() {
  const [refetching, setRefetching] = useState(false)

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: [ApplicationResponseDtoStatusEnum.Draft],
      },
      locale: useLocale(),
    },
  })

  return (
    <ApplicationsList
      applicationsRes={applicationsRes}
      displayProgress
      displayDescription={false}
      onRefetch={setRefetching}
    />
  )
}
