import { defineMessage } from 'react-intl'
import { useState, useEffect } from 'react'

import { Divider, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatNationalId,
  IntroWrapper,
  m,
  THJODSKRA_SLUG,
  UserInfoLine,
} from '@island.is/portals/my-pages/core'
import { spmm } from '../../../lib/messages'
import { useNationalRegistrySpouseQuery } from './Spouse.generated'
import { Problem } from '@island.is/react-spa/shared'

const FamilyMember = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const [spouseValue, setSpouseValue] = useState<string>('')

  const { data, loading, error } = useNationalRegistrySpouseQuery()

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

  return (
    <IntroWrapper
      title={data?.nationalRegistryPerson?.spouse?.fullName || ''}
      intro={formatMessage(spmm.spouseIntro)}
      serviceProviderSlug={THJODSKRA_SLUG}
      serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !data?.nationalRegistryPerson?.spouse && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noDataFoundVariableSingularMasculine, {
            arg: formatMessage(spmm.spouse).toLowerCase(),
          })}
          message={formatMessage(
            m.noDataFoundVariableDetailVariationMasculine,
            { arg: formatMessage(spmm.spouseAccusative).toLowerCase() },
          )}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && (loading || data?.nationalRegistryPerson?.spouse) && (
        <Stack space={2}>
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
            content={
              data?.nationalRegistryPerson?.spouse?.nationalId
                ? formatNationalId(
                    data.nationalRegistryPerson.spouse.nationalId,
                  )
                : ''
            }
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage({
              id: 'sp.family:spouseCohab',
              defaultMessage: 'Tengsl',
            })}
            content={spouseValue}
            loading={loading}
          />
          <Divider />
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default FamilyMember
