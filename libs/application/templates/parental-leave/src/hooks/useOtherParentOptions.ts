import { useLocale } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { getNameAndIdOfSpouse } from '../parentalLeaveUtils'
import { Option } from '@island.is/application/core'
import { NO } from '../constants'
import { parentalLeaveFormMessages } from '../lib/messages'

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
      label: formatMessage(parentalLeaveFormMessages.shared.noOtherParent),
    },
    {
      value: 'manual',
      label: formatMessage(parentalLeaveFormMessages.shared.otherParentOption),
    },
  ]

  if (spouseName !== undefined && spouseId !== undefined) {
    options.unshift({
      value: 'spouse',
      label: formatMessage(parentalLeaveFormMessages.shared.otherParentSpouse, {
        spouseName,
        spouseId,
      }),
    })
  }

  return { options, loading }
}

export default useOtherParentOptions
