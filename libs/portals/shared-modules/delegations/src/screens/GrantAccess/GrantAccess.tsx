import cn from 'classnames'
import * as kennitala from 'kennitala'
import React, { useEffect, useState } from 'react'
import { Control, FormProvider, useForm } from 'react-hook-form'
import { defineMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Icon,
  Input,
  SkeletonLoader,
  Text,
  toast,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  m as coreMessages,
  formatNationalId,
} from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'

import { IdentityCard } from '../../components/IdentityCard/IdentityCard'
import { DelegationsFormFooter } from '../../components/delegations/DelegationsFormFooter'
import { ALL_DOMAINS } from '../../constants/domain'
import { DomainOption, useDomains } from '../../hooks/useDomains/useDomains'
import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import {
  useCreateAuthDelegationMutation,
  useIdentityLazyQuery,
} from './GrantAccess.generated'

import * as styles from './GrantAccess.css'

const GrantAccess = () => {
  useNamespaces(['sp.access-control-delegations'])
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const [formError, setFormError] = useState<Error | undefined>()
  const [name, setName] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { md } = useBreakpoint()
  const {
    options,
    selectedOption,
    loading: domainLoading,
    updateDomain,
    queryString,
  } = useDomains(false)

  const [createAuthDelegation, { loading: mutationLoading }] =
    useCreateAuthDelegationMutation()

  const noUserFoundToast = () => {
    toast.warning(formatMessage(m.grantIdentityError))
  }

  const [getIdentity, { data, loading: queryLoading }] = useIdentityLazyQuery({
    onError: (error) => {
      setFormError(error)
    },
    onCompleted: (data) => {
      if (!data.identity) {
        noUserFoundToast()
      }
    },
  })

  const { identity } = data || {}

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      toNationalId: '',
      domainName: selectedOption?.value ?? null,
    },
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = methods

  useEffect(() => {
    setValue('domainName', selectedOption?.value ?? null)
  }, [selectedOption?.value, setValue])

  const watchToNationalId = watch('toNationalId')
  const domainNameWatcher = watch('domainName')
  const loading = queryLoading || mutationLoading

  const requestDelegation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace('-', '').trim()
    if (
      value.length === 10 &&
      kennitala.isValid(value) &&
      !kennitala.isCompany(value) &&
      value !== userInfo.profile.nationalId &&
      value !== userInfo.profile.actor?.nationalId
    ) {
      getIdentity({
        variables: { input: { nationalId: value } },
      })
    } else {
      setName('')
    }
  }

  useEffect(() => {
    if (identity && identity.nationalId === watchToNationalId) {
      setName(identity.name)
    }
  }, [identity, setName, watchToNationalId])

  const onSubmit = handleSubmit(async ({ toNationalId, domainName }) => {
    try {
      const { data } = await createAuthDelegation({
        variables: {
          input: {
            toNationalId,
            domainName: domainName === ALL_DOMAINS ? null : domainName,
          },
        },
      })
      if (data) {
        navigate(
          `${DelegationPaths.Delegations}/${data.createAuthDelegation.id}${queryString}`,
        )
      }
    } catch (error) {
      setFormError(error)
    }
  })

  const clearPersonState = () => {
    setName('')
    setValue('toNationalId', '')

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(m.grantTitle)}
        intro={defineMessage(m.grantIntro)}
        marginBottom={4}
      />
      <div className={styles.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" rowGap={[5, 6]}>
              <IdentityCard
                label={formatMessage(m.accessOwner)}
                title={userInfo.profile.name}
                description={formatNationalId(userInfo.profile.nationalId)}
                color="blue"
              />
              <div className={styles.inputWrapper}>
                {name && (
                  <Input
                    name="name"
                    defaultValue={name}
                    aria-live="assertive"
                    label={formatMessage(m.grantFormAccessHolder)}
                    backgroundColor="blue"
                    size="md"
                  />
                )}
                <Box display={name ? 'none' : 'block'} aria-live="assertive">
                  <InputController
                    control={control as unknown as Control}
                    id="toNationalId"
                    icon={name || queryLoading ? undefined : 'search'}
                    ref={inputRef}
                    rules={{
                      required: {
                        value: true,
                        message: formatMessage(m.grantRequiredSsn),
                      },
                      validate: {
                        value: (value: number) => {
                          const valueAsString = value.toString()
                          if (
                            valueAsString.length === 10 &&
                            !kennitala.isValid(valueAsString)
                          ) {
                            return formatMessage(m.grantInvalidSsn)
                          }

                          if (valueAsString === userInfo.profile.nationalId) {
                            return formatMessage(m.grantSameSsn)
                          }

                          if (
                            valueAsString === userInfo.profile.actor?.nationalId
                          ) {
                            return formatMessage(m.grantActorSsn)
                          }

                          if (kennitala.isCompany(valueAsString)) {
                            return formatMessage(m.grantCompanySsn)
                          }
                        },
                      },
                    }}
                    type="tel"
                    format="######-####"
                    label={formatMessage(m.grantFormAccessHolder)}
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
                    onClick={clearPersonState}
                    className={styles.icon}
                    aria-label={formatMessage(coreMessages.clearSelected)}
                  >
                    <Icon icon="close" size="large" color="blue400" />
                  </button>
                ) : null}
              </div>
              <div>
                {domainLoading ? (
                  <SkeletonLoader height={md ? 77 : 72} />
                ) : (
                  <SelectController
                    id="domainName"
                    name="domainName"
                    label={formatMessage(m.digitalDelegations)}
                    placeholder={formatMessage(m.chooseDomain)}
                    error={errors.domainName?.message}
                    options={options}
                    onSelect={(option) => {
                      const opt = option as DomainOption

                      if (opt) {
                        updateDomain(opt)
                      }
                    }}
                    rules={{
                      required: {
                        value: true,
                        message: formatMessage(m.grantRequiredDomain),
                      },
                    }}
                  />
                )}
              </div>
            </Box>
            <Box display="flex" flexDirection="column" rowGap={5} marginTop={5}>
              {formError && <Problem error={formError} size="small" />}
              <Text variant="small">
                {formatMessage(m.grantNextStepDescription)}
              </Text>
              <Box marginBottom={7}>
                <DelegationsFormFooter
                  disabled={!name || !domainNameWatcher}
                  loading={mutationLoading}
                  onCancel={() => navigate(DelegationPaths.Delegations)}
                  showShadow={false}
                  confirmLabel={formatMessage(m.grantChoosePermissions)}
                  confirmIcon="arrowForward"
                />
              </Box>
            </Box>
          </form>
        </FormProvider>
      </div>
    </>
  )
}

export default GrantAccess
