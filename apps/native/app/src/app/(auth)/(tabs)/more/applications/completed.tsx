import { useState } from 'react'

import {
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { ApplicationsList } from './_components/applications-list'

export default function ApplicationsCompletedScreen() {
  const [refetching, setRefetching] = useState(false)

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: [
          ApplicationResponseDtoStatusEnum.Completed,
          ApplicationResponseDtoStatusEnum.Rejected,
          ApplicationResponseDtoStatusEnum.Approved,
        ],
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
