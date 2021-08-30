import React, { useEffect } from 'react'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { useForm, Controller, ValidationRules } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import * as kennitala from 'kennitala'
import { sharedMessages } from '@island.is/shared/translations'

import {
  Box,
  Input,
  Button,
  Text,
  GridRow,
  GridColumn,
  toast,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { Mutation, Query } from '@island.is/api/schema'
import { IntroHeader, ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

import { AuthDelegationsQuery } from '../AccessControl'

const CreateAuthDelegationMutation = gql`
  mutation CreateAuthDelegationMutation($input: CreateAuthDelegationInput!) {
    createAuthDelegation(input: $input) {
      id
      to {
        nationalId
      }
    }
  }
`

const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      nationalId
      type
      name
    }
  }
`

function GrantAccess() {
  const { handleSubmit, control, errors, setValue, watch } = useForm()
  const [createAuthDelegation, { loading }] = useMutation<Mutation>(
    CreateAuthDelegationMutation,
    {
      refetchQueries: [{ query: AuthDelegationsQuery }],
    },
  )
  const [getIdentity, { data }] = useLazyQuery<Query>(IdentityQuery)
  const { identity } = data || {}
  const { formatMessage } = useLocale()
  const history = useHistory()
  const watchToNationalId = watch('toNationalId')

  const requestDelegation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace('-', '').trim()
    if (value.length === 10 && kennitala.isValid(value)) {
      if (kennitala.isCompany(value)) {
        setValue('name', value)
      } else {
        getIdentity({ variables: { input: { nationalId: value } } })
      }
    } else {
      setValue('name', '')
    }
  }

  useEffect(() => {
    if (identity && identity.nationalId === watchToNationalId) {
      setValue('name', identity.name)
    }
  }, [identity, setValue, watchToNationalId])

  const onSubmit = handleSubmit(async ({ toNationalId, name }) => {
    try {
      const { data } = await createAuthDelegation({
        variables: { input: { name, toNationalId } },
      })
      if (data) {
        history.push(
          `${ServicePortalPath.SettingsAccessControl}/${data.createAuthDelegation.to.nationalId}`,
        )
      }
    } catch (error) {
      toast.error(
        formatMessage({
          id: 'service.portal.settings.accessControl:grant-create-error',
          defaultMessage:
            'Eitthvað fór úrskeiðis!\nEkki tókst að búa til aðgang fyrir þennan notanda.',
        }),
      )
    }
  })

  return (
    <Box>
      <IntroHeader
        title={defineMessage({
          id: 'service.portal.settings.accessControl:grant-title',
          defaultMessage: 'Veita aðgang',
        })}
        intro={defineMessage({
          id: 'service.portal.settings.accessControl:grant-intro',
          defaultMessage:
            'Hér getur þú gefið öðrum aðgang til að sýsla með þín gögn hjá island.is',
        })}
      />

      <form onSubmit={onSubmit}>
        <GridRow marginBottom={3}>
          <GridColumn paddingBottom={2} span="12/12">
            <Text variant="h5">
              {formatMessage({
                id: 'service.portal.settings.accessControl:grant-form-label',
                defaultMessage: 'Sláðu inn upplýsingar aðgangshafa',
              })}
            </Text>
          </GridColumn>
          <GridColumn paddingBottom={2} span={['12/12', '12/12', '6/12']}>
            <InputController
              control={control}
              id="toNationalId"
              defaultValue=""
              rules={
                {
                  required: {
                    value: true,
                    message: formatMessage({
                      id:
                        'service.portal.settings.accessControl:grant-required-ssn',
                      defaultMessage: 'Skylda er að fylla út kennitölu',
                    }),
                  },
                  validate: {
                    value: (value: number) => {
                      if (!kennitala.isValid(value)) {
                        return formatMessage({
                          id:
                            'service.portal.settings.accessControl:grant-invalid-ssn',
                          defaultMessage: 'Kennitalan er ekki gild kennitala',
                        })
                      }
                    },
                  },
                } as ValidationRules
              }
              type="tel"
              format="######-####"
              label={formatMessage(sharedMessages.nationalId)}
              placeholder={formatMessage(sharedMessages.nationalId)}
              onChange={(value) => {
                requestDelegation(value)
              }}
            />
          </GridColumn>
          <GridColumn paddingBottom={2} span={['12/12', '12/12', '6/12']}>
            <Controller
              control={control}
              name="name"
              defaultValue=""
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  readOnly={true}
                  label={formatMessage({
                    id:
                      'service.portal.settings.accessControl:grant-label-user',
                    defaultMessage: 'Aðfangshafi',
                  })}
                  placeholder={formatMessage({
                    id:
                      'service.portal.settings.accessControl:grant-placeholder-user',
                    defaultMessage: 'Nafn',
                  })}
                  value={value}
                  hasError={errors.name}
                  errorMessage={errors.name?.message}
                  onChange={onChange}
                />
              )}
            />
          </GridColumn>
        </GridRow>
        <Box display="flex" justifyContent="flexEnd">
          <Button
            type="submit"
            icon="arrowForward"
            disabled={loading}
            loading={loading}
          >
            {formatMessage({
              id: 'service.portal.settings.accessControl:grant-form-submit',
              defaultMessage: 'Áfram',
            })}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default GrantAccess
