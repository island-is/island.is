import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useApolloClient } from '@apollo/client/react'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { getPropertiesByPropertyCodeQuery } from '../graphql/queries'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { Fasteign } from '@island.is/clients/assets'

export const FetchPropertiesByCodes = ({ application }: FieldBaseProps) => {
  const { setValue, watch } = useFormContext()
  const apolloClient = useApolloClient()

  const selectedCode = watch('selectedPropertyByCode') as string | undefined

  useEffect(() => {
    if (!selectedCode) return
    ;(async () => {
      if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
        const mockData = getValueViaPath<Array<Fasteign>>(
          application.externalData,
          'getProperties.data',
        )
        setValue('anyProperties', mockData ?? [])
        return
      }

      try {
        const { data } = await apolloClient.query({
          query: getPropertiesByPropertyCodeQuery,
          variables: { input: { fasteignNrs: [selectedCode] } },
        })

        setValue('anyProperties', data?.hmsPropertyByPropertyCode ?? [])
      } catch (error) {
        setValue('anyProperties', [])
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCode, apolloClient, setValue])

  return null
}
