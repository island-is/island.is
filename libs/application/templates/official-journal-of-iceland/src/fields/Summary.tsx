import { useUserInfo } from '@island.is/auth/react'
import { Box, Stack } from '@island.is/island-ui/core'
import { MinistryOfJusticeAdvertEntity } from '@island.is/api/schema'
import { useQuery } from '@apollo/client'
import { Property } from '../components/property/Property'
import { TYPES_QUERY, DEPARTMENTS_QUERY } from '../graphql/queries'
import { summary, general } from '../lib/messages'
import {
  OJOIFieldBaseProps,
  MinistryOfJusticeGraphqlResponse,
} from '../lib/types'
import { useLocale } from '@island.is/localization'
import { AnswerOption } from '../lib/constants'

export const Summary = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  const user = useUserInfo()

  const { answers } = application

  const { data: types } = useQuery<MinistryOfJusticeGraphqlResponse<'types'>>(
    TYPES_QUERY,
    {
      variables: {
        params: {
          department: answers?.advert?.department,
          search: answers?.advert?.type,
        },
      },
    },
  )

  const { data: departments } = useQuery<
    MinistryOfJusticeGraphqlResponse<'departments'>
  >(DEPARTMENTS_QUERY, {
    variables: {
      params: {
        search: answers?.advert?.department,
      },
    },
  })

  const extract = (arr?: MinistryOfJusticeAdvertEntity[]) => {
    if (!arr) {
      return ''
    }

    if (arr.length === 0) {
      return ''
    }

    return arr[0].title
  }

  return (
    <Stack space={0} dividers>
      <Property name={f(summary.properties.sender)} value={user.profile.name} />
      <Property
        name={f(summary.properties.type)}
        value={extract(types?.ministryOfJusticeTypes.types)}
      />
      <Property
        name={f(summary.properties.title)}
        value={answers?.advert?.title}
      />
      <Property
        name={f(summary.properties.department)}
        value={extract(departments?.ministryOfJusticeDepartments.departments)}
      />
      <Property
        name={f(summary.properties.submissionDate)}
        value={new Date().toLocaleDateString()}
      />
      <Property
        name={f(summary.properties.fastTrack)}
        value={f(
          answers?.publishing?.fastTrack === AnswerOption.YES
            ? general.yes
            : general.no,
        )}
      />
      <Property
        name={f(summary.properties.estimatedDate)}
        value={'01.02.2024'}
      />
      <Property name={f(summary.properties.estimatedPrice)} value={'23.000'} />
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
