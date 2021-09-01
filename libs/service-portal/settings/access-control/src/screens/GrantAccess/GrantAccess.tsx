import React, { useEffect, useState } from 'react'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { useForm, Controller, ValidationRules } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import * as kennitala from 'kennitala'

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
import {
  IntroHeader,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
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
  const [name, setName] = useState('')
  const { handleSubmit, control, errors, watch } = useForm({ mode: 'onChange' })
  const [
    createAuthDelegation,
    { loading: mutationLoading },
  ] = useMutation<Mutation>(CreateAuthDelegationMutation, {
    refetchQueries: [{ query: AuthDelegationsQuery }],
  })
  const [getIdentity, { data, loading: queryLoading }] = useLazyQuery<Query>(
    IdentityQuery,
    {
      onError: (error) => {
        toast.error(
          formatMessage({
            id: 'service.portal.settings.accessControl:grant-identity-error',
            defaultMessage: 'Enginn notandi fannst með þessa kennitölu.',
          }),
        )
      },
    },
  )
  const { identity } = data || {}
  const { formatMessage } = useLocale()
  const history = useHistory()
  const watchToNationalId = watch('toNationalId')

  const loading = mutationLoading || queryLoading

  const requestDelegation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace('-', '').trim()
    if (value.length === 10 && kennitala.isValid(value)) {
      if (kennitala.isCompany(value)) {
        setName(value)
      } else {
        getIdentity({ variables: { input: { nationalId: value } } })
      }
    } else {
      setName('')
    }
  }

  useEffect(() => {
    if (identity && identity.nationalId === watchToNationalId) {
      setName(identity.name)
    }
  }, [identity, setName, watchToNationalId])

  const onSubmit = handleSubmit(async ({ toNationalId }) => {
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
        title={m.accessControlGrant}
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
          <GridColumn
            paddingBottom={2}
            span={['12/12', '12/12', '8/12', '12/12', '8/12']}
          >
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
                      if (
                        value.toString().length === 10 &&
                        !kennitala.isValid(value)
                      ) {
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
              label={formatMessage({
                id: 'global:nationalId',
                defaultMessage: 'Kennitala',
              })}
              placeholder={formatMessage({
                id: 'global:nationalId',
                defaultMessage: 'Kennitala',
              })}
              error={errors.toNationalId?.message}
              onChange={(value) => {
                requestDelegation(value)
              }}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '8/12', '12/12', '8/12']}>
            <Box display="flex" justifyContent="flexEnd">
              <Button
                type="submit"
                icon="arrowForward"
                disabled={!name || loading}
                loading={loading}
              >
                {name
                  ? `${formatMessage({
                      id:
                        'service.portal.settings.accessControl:grant-form-pre-submit-active',
                      defaultMessage: 'Veita',
                    })} ${name} ${formatMessage({
                      id:
                        'service.portal.settings.accessControl:grant-form-post-submit-active',
                      defaultMessage: 'aðgang',
                    })}`
                  : formatMessage({
                      id:
                        'service.portal.settings.accessControl:grant-form-submit-disabled',
                      defaultMessage: 'Sláðu inn kennitölu aðgangshafa',
                    })}
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </form>
    </Box>
  )
}

export default GrantAccess
