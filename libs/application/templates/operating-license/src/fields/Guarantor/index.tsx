import { FieldBaseProps } from '@island.is/application/types'
import { Box, LoadingDots, Text } from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'
import React, { useEffect, useState } from 'react'
import { FC } from 'react'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useLazyQuery } from '@apollo/client'
import { IDENTITIES_QUERY } from '../../graphql'
import { IdentitiesInput, Query } from '@island.is/api/schema'

export const Guarantor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()

  const [options, setOptions] = useState<
    Array<{ label: string; value: string }>
  >([])

  const [loaded, setLoaded] = useState(false)

  const [getIdentities, { loading: _identityQueryLoading }] = useLazyQuery<
    Query,
    { input: IdentitiesInput }
  >(IDENTITIES_QUERY, {
    onCompleted: (data) => {
      const optionsResponse = data.identities
        ?.map((identity) => {
          return {
            label: `${identity?.name} (${identity?.nationalId})`,
            value: identity?.nationalId ?? '',
          }
        })
        .filter((option) => option.value.length)

      setOptions(optionsResponse)
      setLoaded(true)
    },
    onError: (error) => {
      console.error('Error fetching identity', error)
    },
  })

  useEffect(() => {
    getIdentities({
      variables: {
        input: {
          nationalIds: [application.applicant, ...application.applicantActors],
        },
      },
    })
  }, [])

  return (
    <Box>
      {loaded ? (
        <SelectController
          id={id}
          label={formatMessage(m.guarantor)}
          options={options}
          defaultValue={options[0].value}
        ></SelectController>
      ) : (
        <>
          <LoadingDots />
          <Text variant="eyebrow">
            {formatMessage(m.loadingGuarantorOptions)}
          </Text>
        </>
      )}
    </Box>
  )
}
