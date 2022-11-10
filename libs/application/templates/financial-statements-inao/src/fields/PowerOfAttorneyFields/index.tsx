import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@apollo/client'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'

import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

import { ABOUTIDS } from '../../lib/constants'

import { FieldBaseProps } from '@island.is/application/types'
import { getErrorViaPath } from '@island.is/application/core'
import { IdentityQuery } from '../../graphql'

export const PowerOfAttorneyFields = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { errors, setValue } = useFormContext()

  if (application.applicantActors.length === 0) {
    return null
  }

  const currentActor =
    application.applicantActors[application.applicantActors.length - 1]

  const { error: queryError, loading } = useQuery(IdentityQuery, {
    variables: { input: { nationalId: currentActor } },
    onCompleted: (data) => {
      setValue(ABOUTIDS.powerOfAttorneyName, data.identity?.name ?? '')
    },
  })

  console.log({ application, currentActor, queryError })
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
