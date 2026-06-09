import { useQuery } from '@apollo/client'
import { GET_REAL_ESTATE } from '@island.is/form-system/graphql'
import { useEffect, useMemo } from 'react'

interface Props {
  isDropdown?: boolean
}

export const RealEstate = ({ isDropdown }: Props) => {
  const { loading, error, data, fetchMore } = useQuery(GET_REAL_ESTATE, {
    variables: { input: { cursor: '1' } },
    skip: !isDropdown,
  })
  const assetData = useMemo(() => data?.assetsOverview || {}, [data])

  useEffect(() => {
    console.log('RealEstate data:', assetData)
  }, [assetData])

  return <div>RealEstate</div>
}
