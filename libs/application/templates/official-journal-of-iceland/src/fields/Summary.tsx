import { useUserInfo } from '@island.is/auth/react'
import { Stack } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { Property } from '../components/property/Property'
import {
  DEPARTMENT_QUERY,
  GET_PRICE_QUERY,
  TYPE_QUERY,
} from '../graphql/queries'
import { summary } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { useLocale } from '@island.is/localization'
import { MINIMUM_WEEKDAYS } from '../lib/constants'
import { addWeekdays } from '../lib/utils'

export const Summary = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f, formatDate } = useLocale()

  const user = useUserInfo()

  const { answers } = application

  const { data, loading } = useQuery(TYPE_QUERY, {
    variables: {
      params: {
        id: application?.answers?.advert?.type,
      },
    },
  })

  const { data: priceData } = useQuery(GET_PRICE_QUERY, {
    variables: { id: application.id },
  })

  const price =
    priceData?.officialJournalOfIcelandApplicationGetPrice?.price ?? 0

  const type = data?.officialJournalOfIcelandType?.type?.title

  const { data: department } = useQuery(DEPARTMENT_QUERY, {
    variables: {
      params: {
        id: answers?.advert?.department,
      },
    },
  })

  const today = new Date()
  const estimatedDate = addWeekdays(today, MINIMUM_WEEKDAYS)

  return (
    <Stack space={0} dividers>
      <Property name={f(summary.properties.sender)} value={user.profile.name} />
      <Property name={f(summary.properties.type)} value={type} />
      <Property
        name={f(summary.properties.title)}
        value={answers?.advert?.title}
      />
      <Property
        name={f(summary.properties.department)}
        value={department?.officialJournalOfIcelandDepartment.department.title}
      />
      <Property
        name={f(summary.properties.submissionDate)}
        value={new Date().toLocaleDateString()}
      />
      <Property
        name={f(summary.properties.estimatedDate)}
        value={formatDate(estimatedDate)}
      />
      <Property name={f(summary.properties.estimatedPrice)} value={price} />
      <Property
        name={f(summary.properties.classification)}
        value={answers?.publishing?.contentCategories
          .map((c) => c.label)
          .join(', ')}
      />
    </Stack>
  )
}

export default Summary
