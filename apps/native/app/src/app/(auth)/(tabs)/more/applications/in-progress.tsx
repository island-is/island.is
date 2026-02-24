import { useState } from 'react'

import {
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { ApplicationsList } from '../../../../../components/applications-list'

export default function ApplicationsInProgressScreen() {
  const [refetching, setRefetching] = useState(false)

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: [ApplicationResponseDtoStatusEnum.Inprogress],
      },
      locale: useLocale(),
    },
  })

  return (
    <ApplicationsList
      applicationsRes={applicationsRes}
      displayProgress={false}
      displayDescription
      onRefetch={setRefetching}
    />
  )
}
