import { Box, Icon, Input, toast } from '@island.is/island-ui/core'
import { useIdentityLazyQuery } from './GrantAccess.generated'
import { useLocale } from '@island.is/localization'
import { useEffect, useRef, useState } from 'react'
import { Control, UseFormReturn } from 'react-hook-form'
import { m } from '../../lib/messages'
import * as kennitala from 'kennitala'
import * as styles from './GrantAccess.css'
import { useUserInfo } from '@island.is/react-spa/bff'
import { InputController } from '@island.is/shared/form-fields'
import { m as coreMessages } from '@island.is/portals/core'
import cn from 'classnames'

interface FormData {
  people: Array<{ toNationalId: string }>
}

export const NationalIdentityInput = ({
  setFormError,
  methods,
  index = 0,
}: {
  setFormError: (error: Error) => void
  methods: UseFormReturn<FormData>
  index?: number
}) => {
  const userInfo = useUserInfo()
  const inputRef = useRef<HTMLInputElement>(null)

  const { formatMessage } = useLocale()
  const [name, setName] = useState('')

  const noUserFoundToast = () => {
    toast.warning(formatMessage(m.grantIdentityError))
  }

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

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = methods

  const fieldName = `people.${index}.toNationalId` as const
  const watchToNationalId = watch(fieldName)

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

  useEffect(() => {
    if (identity && identity.nationalId === watchToNationalId) {
      setName(identity.name)
    }
  }, [identity, setName, watchToNationalId])

  const clearPersonState = () => {
    setName('')
    setValue(fieldName, '')

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  return (
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
          id={fieldName}
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

                if (valueAsString === userInfo.profile.actor?.nationalId) {
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
          error={
            errors.people?.[index]?.toNationalId?.message as string | undefined
          }
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
          disabled={queryLoading}
          onClick={clearPersonState}
          className={styles.icon}
          aria-label={formatMessage(coreMessages.clearSelected)}
        >
          <Icon icon="close" size="large" color="blue400" />
        </button>
      ) : null}
    </div>
  )
}
