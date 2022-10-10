import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { FormProvider, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import * as kennitala from 'kennitala'
import { sharedMessages } from '@island.is/shared/translations'

import { Box, Input, Icon, toast, Text } from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import {
  IntroHeader,
  ServicePortalPath,
  ServicePortalModuleComponent,
  formatNationalId,
  m,
  useQueryParam,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { DelegationsFormFooter, IdentityCard } from '../../components'
import * as styles from './GrantAccess.css'
import {
  AuthDelegationsDocument,
  useCreateAuthDelegationMutation,
  useIdentityLazyQuery,
} from '@island.is/service-portal/graphql'

const GrantAccess: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const [name, setName] = useState('')
  const history = useHistory()
  const domainQueryParam = useQueryParam('domain')

  const [
    createAuthDelegation,
    { loading: mutationLoading },
  ] = useCreateAuthDelegationMutation({
    refetchQueries: [{ query: AuthDelegationsDocument }],
  })

  const noUserFoundToast = () => {
    toast.error(
      formatMessage({
        id: 'sp.settings-access-control:grant-identity-error',
        defaultMessage: 'Enginn notandi fannst með þessa kennitölu.',
      }),
    )
  }

  const [getIdentity, { data, loading: queryLoading }] = useIdentityLazyQuery({
    onError: noUserFoundToast,
    onCompleted: (data) => {
      if (!data.identity) {
        noUserFoundToast()
      }
    },
  })

  const { identity } = data || {}
  const domainOptions = [
    {
      label: 'Island.is',
      value: '0',
    },
    {
      label: 'Landspítalaappið',
      value: '1',
    },
  ]

  const getDefaultDomain = (label: string) =>
    domainOptions.find(
      (opt) => opt.label.toLowerCase() === label?.toLowerCase(),
    )?.value

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      toNationalId: '',
      domain: domainQueryParam ? getDefaultDomain(domainQueryParam) : null,
    },
  })

  const { handleSubmit, control, errors, watch, reset } = methods
  const watchToNationalId = watch('toNationalId')
  const domainmWatcher = watch('domain')
  const loading = queryLoading || mutationLoading

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
        variables: { input: { toNationalId } },
      })
      if (data) {
        history.push(
          `${ServicePortalPath.AccessControlDelegations}/${data.createAuthDelegation.id}`,
        )
      }
    } catch (error) {
      toast.error(
        formatMessage({
          id: 'sp.settings-access-control:grant-create-error',
          defaultMessage:
            'Eitthvað fór úrskeiðis!\nEkki tókst að búa til aðgang fyrir þennan notanda.',
        }),
      )
    }
  })

  const clearForm = () => {
    setName('')
    reset()
  }

  return (
    <>
      <IntroHeader
        title={formatMessage({
          id: 'sp.access-control-delegations:grant-title',
          defaultMessage: 'Veita aðgang',
        })}
        intro={defineMessage({
          id: 'sp.access-control-delegations:grant-intro',
          defaultMessage:
            'Hér getur þú gefið öðrum aðgang til að sýsla með þín gögn hjá island.is',
        })}
      />
      <Box className={styles.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" rowGap={[5, 6]}>
              <IdentityCard
                label={formatMessage({
                  id: 'sp.access-control-delegations:signed-in-user',
                  defaultMessage: 'Innskráður notandi',
                })}
                title={userInfo.profile.name}
                description={formatNationalId(userInfo.profile.nationalId)}
              />
              <div className={styles.inputWrapper}>
                {name && (
                  <Input
                    name="name"
                    defaultValue={name}
                    aria-live="assertive"
                    label={formatMessage({
                      id:
                        'sp.access-control-delegations:grant-form-access-holder',
                      defaultMessage: 'Kennitala aðgangshafa',
                    })}
                    backgroundColor="blue"
                    size="md"
                  />
                )}
                <Box
                  display={name ? 'none' : 'block'}
                  aria-live="assertive"
                  marginBottom={[1, 1, 0]}
                >
                  <InputController
                    control={control}
                    id="toNationalId"
                    icon={name || queryLoading ? undefined : 'search'}
                    rules={{
                      required: {
                        value: true,
                        message: formatMessage({
                          id: 'sp.settings-access-control:grant-required-ssn',
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
                                'sp.settings-access-control:grant-invalid-ssn',
                              defaultMessage:
                                'Kennitalan er ekki gild kennitala',
                            })
                          }
                        },
                      },
                    }}
                    type="tel"
                    format="######-####"
                    label={formatMessage(sharedMessages.nationalId)}
                    placeholder={'000000-0000'}
                    error={errors.toNationalId?.message}
                    onChange={(value) => {
                      requestDelegation(value)
                    }}
                    size="md"
                  />
                </Box>
                {queryLoading ? (
                  <span
                    className={cn(styles.icon, styles.loadingIcon)}
                    aria-label="Loading"
                  >
                    <Icon icon="reload" size="large" color="blue400" />
                  </span>
                ) : name ? (
                  <button
                    disabled={loading}
                    onClick={clearForm}
                    className={styles.icon}
                  >
                    <Icon icon="close" size="large" color="blue400" />
                  </button>
                ) : null}
              </div>
              <div>
                <SelectController
                  id="domain"
                  name="domain"
                  label={formatMessage(m.accessControl)}
                  placeholder={formatMessage({
                    id: 'sp.access-control-delegations:choose-domain',
                    defaultMessage: 'Veldu kerfi',
                  })}
                  error={errors.domain?.message}
                  options={domainOptions}
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage({
                        id:
                          'sp.access-control-delegations:grant-required-domain',
                        defaultMessage: 'Skylda er að velja aðgangsstýringu',
                      }),
                    },
                  }}
                />
              </div>
            </Box>
            <Box display="flex" flexDirection="column" rowGap={5} marginTop={5}>
              <Text>
                {formatMessage({
                  id: 'sp.access-control-delegations:next-step-description',
                  defaultMessage:
                    'Í næsta skrefi velurðu hvaða gögn viðkomandi getur skoðað eða sýslað með.',
                })}
              </Text>
              <Box marginBottom={7}>
                <DelegationsFormFooter
                  disabled={!name || domainmWatcher === null || loading}
                  loading={loading}
                  onCancel={() =>
                    history.push(ServicePortalPath.AccessControlDelegations)
                  }
                  confirmLabel={formatMessage({
                    id: 'sp.access-control-delegations:choose-access-rights',
                    defaultMessage: 'Velja réttindi',
                  })}
                  confirmIcon="arrowForward"
                />
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </>
  )
}

export default GrantAccess
