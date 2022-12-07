import { FC, useEffect } from 'react'
import { Markdown } from '@island.is/application/ui-components'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { LoadingDots } from '@island.is/island-ui/core'

export const query = gql`
  query hasDisabilityLicense {
    hasDisabilityLicense
  }
`

export const NoDisabilityRecordInfo: FC<FieldBaseProps> = () => {
  const { data, loading, error, refetch } = useQuery(query, {
    notifyOnNetworkStatusChange: true,
  })

  const { setValue } = useFormContext()

  useEffect(() => {
    if (data && !!data.hasDisabilityDiscount) {
      setValue(
        'personalInfo.hasDisabilityDiscountChecked',
        data.hasDisabilityDiscount,
      )
    }
  }, [data])

  useEffect(() => {
    refetch()
  }, [])

  const { formatMessage } = useLocale()

  return (
    <Box style={{ fontSize: 14 }}>
      {!loading && !data?.hasDisabilityDiscount && (
        <AlertMessage
          message={
            <Markdown>
              {error
                ? formatMessage(m.disabiltiyRecordError)
                : data?.hasDisabilityLicense
                ? formatMessage(m.disabiltiyRecordInfoMessage)
                : formatMessage(m.noDisabiltiyRecordInfoMessage)}
            </Markdown>
          }
          type={
            error ? 'error' : data?.hasDisabilityLicense ? 'success' : 'info'
          }
        />
      )}
      {loading && (
        <Box display="flex" justifyContent="center" marginTop={2}>
          <LoadingDots />
        </Box>
      )}
    </Box>
  )
}
