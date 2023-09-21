import { FC, useEffect, useState } from 'react'
import { FieldErrors, FieldValues, useFormContext } from 'react-hook-form'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import {
  Box,
  GridRow,
  GridColumn,
  AlertMessage,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { childPensionFormMessage } from '../../../lib/messages'
import { Application, RecordObject } from '@island.is/application/types'
import { IdentityInput, Query } from '@island.is/api/schema'
import { useLazyQuery } from '@apollo/client'
import { IDENTITY_QUERY } from '../../../graphql/queries'
import * as kennitala from 'kennitala'

interface ParentsPenitentiaryProps {
  id: string
  application: Application
  errors?: RecordObject
}

const ParentsPenitentiary: FC<
  React.PropsWithChildren<ParentsPenitentiaryProps>
> = ({ id, application, errors }) => {
  const { setValue, watch } = useFormContext()
  const { formatMessage } = useLocale()
  const [hasError, setHasError] = useState<string | undefined>(undefined)
  const [identityFound, setIdentityFound] = useState(true)

  const parentsPenitentiaryFieldId = id.replace('reason', 'parentsPenitentiary')
  const nameFieldId = `${parentsPenitentiaryFieldId}.name`
  const nationalIdFieldId = `${parentsPenitentiaryFieldId}.nationalId`

  const personNationalId: string = watch(nationalIdFieldId)

  const nationalIdError = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    nationalIdFieldId,
  )

  useEffect(() => {
    setHasError(nationalIdError)
  }, [nationalIdError])

  const [getIdentity, { loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(IDENTITY_QUERY, {
      onCompleted: (data) => {
        setValue(nameFieldId, data.identity?.name ?? '')
        setHasError(undefined)
        setIdentityFound(Boolean(data.identity?.name))
      },
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    const personNationalIdNumbers = personNationalId?.replace(/[^0-9]/g, '')

    if (personNationalIdNumbers?.length === 10) {
      const isValidSSN = kennitala.isPerson(personNationalIdNumbers)
      if (isValidSSN) {
        getIdentity({
          variables: {
            input: {
              nationalId: personNationalIdNumbers,
            },
          },
        })
      }
    } else if (personNationalIdNumbers?.length === 0) {
      setValue(nameFieldId, '')
    }
  }, [personNationalId, getIdentity, setValue, nameFieldId])

  return (
    <Box marginTop={2}>
      <GridRow>
        <GridColumn span="1/2">
          <InputController
            id={nationalIdFieldId}
            placeholder="000000-0000"
            label={formatText(
              childPensionFormMessage.info
                .childPensionParentsPenitentiaryNationalId,
              application,
              formatMessage,
            )}
            error={hasError}
            onChange={(e) => {
              setValue(nationalIdFieldId as string, e.target.value)
            }}
            format="######-####"
            backgroundColor="blue"
            loading={queryLoading}
          />
        </GridColumn>
        <GridColumn span="1/2">
          <InputController
            id={nameFieldId}
            label={formatText(
              childPensionFormMessage.info.registerChildFullName,
              application,
              formatMessage,
            )}
            onChange={(e) => {
              setValue(nameFieldId as string, e.target.value)
            }}
            backgroundColor="blue"
            disabled={true}
          />
        </GridColumn>
      </GridRow>
      {((!identityFound && !queryLoading) || queryError) && (
        <Box paddingTop={2}>
          <AlertMessage
            type="warning"
            title={formatMessage(
              childPensionFormMessage.info.childPensionNameAlertTitle,
            )}
            message={formatMessage(
              childPensionFormMessage.info.childPensionNameAlertMessage,
            )}
          />
        </Box>
      )}
    </Box>
  )
}

export default ParentsPenitentiary
