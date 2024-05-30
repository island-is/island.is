import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'
import React, { useEffect } from 'react'
import { FC } from 'react'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useLazyQuery } from '@apollo/client'
import { IDENTITY_QUERY } from '../../graphql'
import { IdentityInput, Query } from '@island.is/api/schema'

export const Guarantor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()

  let options: Array<{ label: string; value: string }> = []

  const [getIdentity, { loading: identityQueryLoading }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(IDENTITY_QUERY, {
    onCompleted: (data) => {
      const name = data.identity?.name ?? ''
      const nationalId = data.identity?.nationalId ?? ''

      if (!name || !nationalId) return
      options.push({
        label: name,
        value: nationalId,
      })
    },
  })

  useEffect(() => {
    for (const nationalId of [
      application.applicant,
      ...application.applicantActors,
    ]) {
      getIdentity({ variables: { input: { nationalId } } })
    }
  }, [])

  return (
    <Box>
      <SelectController
        id={id}
        label={formatMessage(m.guarantor)}
        options={options}
      ></SelectController>
    </Box>
  )
}
