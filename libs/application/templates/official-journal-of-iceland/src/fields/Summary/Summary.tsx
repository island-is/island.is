import { useUserInfo } from '@island.is/auth/react'
import { Box, Stack } from '@island.is/island-ui/core'
import { FormIntro } from '../../components/form/FormIntro'
import { Property } from '../../components/property/Property'
import { useFormatMessage } from '../../hooks'
import { general, summary } from '../../lib/messages'
import {
  MinistryOfJusticeGraphqlResponse,
  OJOIFieldBaseProps,
} from '../../lib/types'
import { useQuery } from '@apollo/client'
import { DEPARTMENTS_QUERY, TYPES_QUERY } from '../../graphql/queries'
import { MinistryOfJusticeAdvertEntity } from '@island.is/api/schema'

const MOCK_DATA = {
  sender: 'Stofnun X',

  estimatedDateOfPublication: '25.10.2023',
  estimatedPrice: '23.000',
}

export const Summary = ({ application }: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)

  const user = useUserInfo()

  const { answers } = application

  const { data: types } = useQuery<MinistryOfJusticeGraphqlResponse<'types'>>(
    TYPES_QUERY,
    {
      variables: {
        params: {
          department: answers.advert.department,
          search: answers.advert.type,
        },
      },
    },
  )

  const { data: departments } = useQuery<
    MinistryOfJusticeGraphqlResponse<'departments'>
  >(DEPARTMENTS_QUERY, {
    variables: {
      params: {
        search: answers.advert.department,
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
    <Box>
      <FormIntro
        title={f(summary.general.formTitle)}
        intro={f(summary.general.formIntro)}
      />
      <Stack space={0} dividers>
        <Property
          name={f(summary.properties.sender)}
          value={user.profile.name}
        />
        <Property
          name={f(summary.properties.type)}
          value={extract(types?.ministryOfJusticeTypes.types)}
        />
        <Property
          name={f(summary.properties.title)}
          value={answers.advert.title}
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
            answers.publishingPreferences.fastTrack ? general.yes : general.no,
          )}
        />
        <Property
          name={f(summary.properties.estimatedDate)}
          value={MOCK_DATA.estimatedDateOfPublication}
        />
        <Property
          name={f(summary.properties.estimatedPrice)}
          value={MOCK_DATA.estimatedPrice}
        />
        <Property
          name={f(summary.properties.classification)}
          value={answers.publishingPreferences.contentCategories
            .map((c) => c.label)
            .join(', ')}
        />
      </Stack>
    </Box>
  )
}

export default Summary
