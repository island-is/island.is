import React, { FC, useEffect, useState } from 'react'
import cn from 'classnames'
import { useFormContext } from 'react-hook-form'
import { FieldErrors, FieldValues } from 'react-hook-form/dist/types/form'
import * as kennitala from 'kennitala'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { InputController, RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { RoleConfirmationEnum, ElectPersonType } from '../../types'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'

import * as styles from './ElectPerson.css'

const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
    }
  }
`
interface ElectPersonFieldBaseProps extends FieldBaseProps {
  errors: FieldErrors<FieldValues>
}

const ElectPerson: FC<ElectPersonFieldBaseProps> = ({
  application,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const [electedPersonName, setElectedPersonName] = useState<string>('')
  const {
    setValue,
    getValues,
    clearErrors,
    setError,
    register,
  } = useFormContext()

  const prefix = 'electPerson'

  const fieldNames = {
    lookupError: `${prefix}.lookupError`,
    roleConfirmation: `${prefix}.roleConfirmation`,
    electedPersonNationalId: `${prefix}.electedPersonNationalId`,
    electedPersonName: `${prefix}.electedPersonName`,
  }

  const defaultValues = getValueViaPath(
    application.answers,
    prefix,
  ) as ElectPersonType

  const setLookupError = (state: boolean) => {
    setValue(fieldNames.lookupError, state)
  }

  useEffect(() => {
    register(fieldNames.lookupError)
    setLookupError(false)
  }, [])

  const [selectedOption, setSelectedOption] = useState(
    getValueViaPath(
      application.answers,
      fieldNames.roleConfirmation,
    ) as RoleConfirmationEnum,
  )

  const [
    getIdentity,
    { data: queryData, loading: queryLoading, error: queryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(IdentityQuery, {
    onError: (error: unknown) => {
      setLookupError(true)
      console.log('getIdentity error:', error)
    },
  })

  useEffect(() => {
    if (selectedOption === RoleConfirmationEnum.CONTINUE) {
      setValue(fieldNames.electedPersonNationalId, undefined)
      setValue(fieldNames.electedPersonName, undefined)
      setLookupError(false)
    }

    if (selectedOption === RoleConfirmationEnum.DELEGATE) {
      setValue(
        fieldNames.electedPersonNationalId,
        defaultValues?.electedPersonNationalId ?? '',
      )
      setValue(
        fieldNames.electedPersonName,
        defaultValues?.electedPersonName ?? '',
      )
    }
  }, [
    defaultValues?.electedPersonName,
    defaultValues?.electedPersonNationalId,
    selectedOption,
    setValue,
  ])

  const handleChange = (value = '') => {
    const nationalId = value.replace('-', '').trim()
    const isValidPerson = kennitala.isPerson(nationalId)

    clearErrors(fieldNames.electedPersonNationalId)

    if (nationalId.length === 10 && !isValidPerson) {
      setError(fieldNames.electedPersonNationalId, {
        type: 'validate',
        message: formatText(
          m.errorNationalIdIncorrect,
          application,
          formatMessage,
        ),
      })
    } else if (isValidPerson) {
      setElectedPersonName('')

      getIdentity({
        variables: {
          input: {
            nationalId,
          },
        },
      })
    }
  }

  useEffect(() => {
    const name = queryData?.identity?.name
    console.log(queryData)

    if (name) {
      setValue(fieldNames.electedPersonName, name)
      setElectedPersonName(name)
      setLookupError(false)
    }
  }, [queryData, setValue])

  const nationalIdError =
    errors?.[prefix]?.electedPersonNationalId?.message ??
    getErrorViaPath(errors, fieldNames.electedPersonNationalId)

  return (
    <GridContainer>
      <GridRow marginTop={5} marginBottom={5}>
        <GridColumn>
          <RadioController
            id={fieldNames.roleConfirmation}
            name={fieldNames.roleConfirmation}
            backgroundColor="blue"
            onSelect={(option) =>
              setSelectedOption(option as RoleConfirmationEnum)
            }
            error={
              errors && getErrorViaPath(errors, fieldNames.roleConfirmation)
            }
            options={[
              {
                value: RoleConfirmationEnum.CONTINUE,
                label: formatText(
                  m.roleConfirmationContinue,
                  application,
                  formatMessage,
                ),
              },
              {
                value: RoleConfirmationEnum.DELEGATE,
                label: formatText(
                  m.roleConfirmationDelegate,
                  application,
                  formatMessage,
                ),
              },
            ]}
          />
        </GridColumn>
      </GridRow>
      <Box
        className={cn({
          [styles.hidden]: selectedOption !== RoleConfirmationEnum.DELEGATE,
        })}
      >
        <Text variant="h4" as="h4">
          Aðili sem á að taka við umsókn
        </Text>
        <GridRow marginBottom={2} marginTop={2}>
          <GridColumn span="6/12">
            <InputController
              id={fieldNames.electedPersonNationalId}
              name={fieldNames.electedPersonNationalId}
              label="Kennitala viðtakanda"
              format="######-####"
              defaultValue=""
              backgroundColor="blue"
              icon={
                nationalIdError
                  ? 'warning'
                  : kennitala.isPerson(
                      getValues(fieldNames.electedPersonNationalId),
                    )
                  ? 'checkmarkCircle'
                  : undefined
              }
              onChange={(e) => handleChange(e.target.value)}
              error={nationalIdError}
            />
          </GridColumn>
          <GridColumn span="6/12">
            {queryLoading && <LoadingDots />}
            {queryError && (
              <Text color="red600" variant="eyebrow">
                Villa kom upp við að sækja nafn útfrá kennitölu. Vinsamlegast
                prófaðu aftur síðar.
              </Text>
            )}
            <Box
              width="full"
              className={cn({
                [styles.hidden]: !electedPersonName,
              })}
            >
              <InputController
                id={fieldNames.electedPersonName}
                name={fieldNames.electedPersonName}
                label="Nafn"
                defaultValue={electedPersonName}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </GridContainer>
  )
}

export { ElectPerson }
