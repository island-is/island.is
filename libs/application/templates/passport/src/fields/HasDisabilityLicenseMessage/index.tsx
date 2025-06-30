import { FC, useEffect } from 'react'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { gql, useQuery } from '@apollo/client'
import { LoadingDots } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'

const hasDisabilityLicense = `
  query hasDisabilityLicense {
    hasDisabilityLicense
  }
`

export const HasDisabilityLicenseMessage: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  const { data, loading, error, refetch } = useQuery(
    gql(hasDisabilityLicense),
    {
      notifyOnNetworkStatusChange: true,
    },
  )

  const { setValue } = useFormContext()

  useEffect(() => {
    if (data && !!data.hasDisabilityLicense) {
      setValue('personalInfo.hasDisabilityLicense', data.hasDisabilityLicense)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { formatMessage } = useLocale()

  return (
    <Box style={{ fontSize: 14 }}>
      {!loading ? (
        <AlertMessage
          message={
            <Markdown>
              {error
                ? formatMessage(m.disabilityRecordError)
                : data?.hasDisabilityLicense
                ? formatMessage(m.disabilityRecordInfoMessage)
                : formatMessage(m.noDisabilityRecordInfoMessage)}
            </Markdown>
          }
          type={
            error ? 'error' : data?.hasDisabilityLicense ? 'success' : 'info'
          }
        />
      ) : (
        <Box display="flex" justifyContent="center" marginTop={2}>
          <LoadingDots />
        </Box>
      )}
    </Box>
  )
}
