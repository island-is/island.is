import { useLocale } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { getNameAndIdOfSpouse } from '../fields/parentalLeaveUtils'
import { Option } from '@island.is/application/core'
import { NO } from '../constants'
import { m } from '../lib/messages'

const NationalRegistryFamilyQuery = gql`
  query NationalRegistryFamilyQuery {
    nationalRegistryFamily {
      nationalId
      fullName
      familyRelation
    }
  }
`
const useOtherParentOptions = () => {
  const { formatMessage } = useLocale()
  const { data, loading } = useQuery<Query>(NationalRegistryFamilyQuery)

  const [spouseName, spouseId] = getNameAndIdOfSpouse(
    data?.nationalRegistryFamily ?? [],
  )

  const options: Option[] = [
    {
      value: NO,
      label: formatMessage(m.noOtherParent),
    },
    { value: 'manual', label: formatMessage(m.otherParentOption) },
  ]
  if (spouseName !== undefined && spouseId !== undefined) {
    options.unshift({
      value: 'spouse',
      label: formatMessage(m.otherParentSpouse, { spouseName, spouseId }),
    })
  }
  return { options, loading }
}

export default useOtherParentOptions
