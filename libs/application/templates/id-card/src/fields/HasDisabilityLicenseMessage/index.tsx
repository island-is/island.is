import { FC, useEffect } from 'react'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { gql, useQuery } from '@apollo/client'
import { LoadingDots } from '@island.is/island-ui/core'
import { hasDisabilityLicense } from '../../lib/queries'
import { Markdown } from '@island.is/shared/components'
import { applicantInformation } from '../../lib/messages'

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
      setValue(
        'applicantInformation.hasDisabilityLicense',
        data.hasDisabilityLicense,
      )
    }
  }, [data])

  useEffect(() => {
    refetch()
  }, [])

  const { formatMessage } = useLocale()

  return (
    <Box style={{ fontSize: 14 }}>
      {!loading ? (
        <AlertMessage
          message={
            <Markdown>
              {error
                ? formatMessage(
                    applicantInformation.labels.disabiltiyRecordError,
                  )
                : data?.hasDisabilityLicense
                ? formatMessage(
                    applicantInformation.labels.disabiltiyRecordInfoMessage,
                  )
                : formatMessage(
                    applicantInformation.labels.noDisabiltiyRecordInfoMessage,
                  )}
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
