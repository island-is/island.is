import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  InputError,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { IdentityInput, Query } from '@island.is/api/schema'

import { m } from '../../lib/messages'
import { ABOUTIDS } from '../../lib/constants'
import { FieldBaseProps } from '@island.is/application/types'
import { getErrorViaPath } from '@island.is/application/core'
import { IdentityQuery } from '../../graphql'

export const PowerOfAttorneyFields = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { errors, setValue } = useFormContext()

  const currentActor =
    application.applicantActors[application.applicantActors.length - 1]

  const [getIdentity, { loading, error: queryError }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(IdentityQuery, {
    onCompleted: (data) => {
      setValue(ABOUTIDS.powerOfAttorneyName, data.identity?.name ?? '')
    },
  })

  useEffect(() => {
    if (currentActor) {
      getIdentity({
        variables: {
          input: {
            nationalId: currentActor,
          },
        },
      })
    }
  }, [])

  if (application.applicantActors.length === 0) {
    return null
  }

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box paddingTop={2}>
            <InputController
              id={ABOUTIDS.powerOfAttorneyName}
              name={ABOUTIDS.powerOfAttorneyName}
              label={formatMessage(m.powerOfAttorneyName)}
              loading={loading}
              readOnly
              backgroundColor="blue"
              error={
                errors && getErrorViaPath(errors, ABOUTIDS.powerOfAttorneyName)
              }
            />
            {queryError ? (
              <InputError errorMessage={formatMessage(m.errorFetchingName)} />
            ) : null}
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box paddingTop={2}>
            <InputController
              id={ABOUTIDS.powerOfAttorneyNationalId}
              name={ABOUTIDS.powerOfAttorneyNationalId}
              label={formatMessage(m.powerOfAttorneyNationalId)}
              readOnly
              defaultValue={currentActor}
              format="######-####"
              backgroundColor="blue"
              error={
                errors &&
                getErrorViaPath(errors, ABOUTIDS.powerOfAttorneyNationalId)
              }
            />
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
