import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'

import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatNationalId,
  IntroHeader,
  m,
  NotFound,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useNationalRegistrySpouseQuery } from './Spouse.generated'
import { natRegMaritalStatusMessageDescriptorRecord } from '../../helpers/localizationHelpers'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const dataInfoSpouse = defineMessage({
  id: 'sp.family:data-info-spouse',
  defaultMessage: 'Hér fyrir neðan eru gögn um fjölskyldumeðlim.',
})

type UseParams = {
  nationalId: string
}

const FamilyMember = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useNationalRegistrySpouseQuery({
    variables: {
      api: 'v3',
    },
  })

  const { nationalId } = useParams() as UseParams

  if (!nationalId || error || (!loading && !data?.nationalRegistryPerson))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )

  return (
    <>
      {loading ? (
        <Box marginBottom={6}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
              <LoadingDots />
            </GridColumn>
          </GridRow>
        </Box>
      ) : (
        <IntroHeader
          title={data?.nationalRegistryPerson?.spouse?.fullName || ''}
          intro={dataInfoSpouse}
          marginBottom={2}
        />
      )}

      <Stack space={1}>
        <UserInfoLine
          title={formatMessage(m.myRegistration)}
          label={defineMessage(m.fullName)}
          content={data?.nationalRegistryPerson?.spouse?.fullName || '...'}
          loading={loading}
          translate="no"
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.natreg)}
          content={formatNationalId(nationalId)}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.family:spouseCohab',
            defaultMessage: 'Tengsl',
          })}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : data?.nationalRegistryPerson?.spouse?.maritalStatus
              ? formatMessage(
                  natRegMaritalStatusMessageDescriptorRecord[
                    data?.nationalRegistryPerson?.spouse?.maritalStatus
                  ],
                )
              : ''
          }
          loading={loading}
        />
        <Divider />
      </Stack>
    </>
  )
}

export default FamilyMember
