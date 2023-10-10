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
  formatNationalId,
  IntroHeader,
  m,
  NotFound,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { natRegMaritalStatusMessageDescriptorRecord } from '../../helpers/localizationHelpers'
import { FeatureFlagClient } from '@island.is/feature-flags'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { spmm } from '../../lib/messages'
import { useNationalRegistrySpouseLazyQuery } from './Spouse.generated'

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

  const [useNatRegV3, setUseNatRegV3] = useState<boolean>()
  const [spouseValue, setSpouseValue] = useState<string>('')

  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()

  const [getNationalRegistrySpouse, { data, loading, error }] =
    useNationalRegistrySpouseLazyQuery()

  /* Should use v3? */
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isserviceportalnationalregistryv3enabled`,
        false,
      )
      getNationalRegistrySpouse({
        variables: {
          api: ffEnabled ? 'v3' : undefined,
        },
      })
      setUseNatRegV3(ffEnabled)
    }
    isFlagEnabled()
  }, [])

  useEffect(() => {
    if (useNatRegV3 !== undefined && data?.nationalRegistryPerson) {
      if (useNatRegV3) {
        const v3Value =
          data?.nationalRegistryPerson?.spouse?.cohabitationWithSpouse === true
            ? formatMessage(spmm.cohabitationWithSpouse)
            : data?.nationalRegistryPerson?.spouse?.maritalStatus
            ? data.nationalRegistryPerson.spouse.maritalStatus
            : ''
        setSpouseValue(v3Value)
      } else {
        const v1Value = data?.nationalRegistryPerson?.maritalStatus
          ? formatMessage(
              natRegMaritalStatusMessageDescriptorRecord[
                data?.nationalRegistryPerson?.maritalStatus
              ],
            )
          : ''
        setSpouseValue(v1Value ?? '')
      }
    }
  }, [useNatRegV3, data?.nationalRegistryPerson, formatMessage])

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
          content={error ? formatMessage(dataNotFoundMessage) : spouseValue}
          loading={loading}
        />
        <Divider />
      </Stack>
    </>
  )
}

export default FamilyMember
