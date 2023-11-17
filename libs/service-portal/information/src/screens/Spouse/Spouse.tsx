import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

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
  FootNote,
  formatNationalId,
  IntroHeader,
  m,
  NotFound,
  THJODSKRA_SLUG,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { spmm } from '../../lib/messages'
import { useNationalRegistrySpouseQuery } from './Spouse.generated'

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

  const [spouseValue, setSpouseValue] = useState<string>('')

  const { data, loading, error } = useNationalRegistrySpouseQuery({
    variables: {
      api: 'v3',
    },
  })

  useEffect(() => {
    if (data?.nationalRegistryPerson) {
      const maritalStatus =
        data?.nationalRegistryPerson?.spouse?.cohabitationWithSpouse === true
          ? formatMessage(spmm.cohabitationWithSpouse)
          : data?.nationalRegistryPerson?.spouse?.maritalStatus
          ? data.nationalRegistryPerson.spouse.maritalStatus
          : ''
      setSpouseValue(maritalStatus)
    }
  }, [data?.nationalRegistryPerson, formatMessage])

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
          serviceProviderSlug={THJODSKRA_SLUG}
          serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
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
          content={error ? formatMessage(dataNotFoundMessage) : spouseValue}
          loading={loading}
        />
        <Divider />
      </Stack>
      <FootNote serviceProviderSlug={THJODSKRA_SLUG} />
    </>
  )
}

export default FamilyMember
