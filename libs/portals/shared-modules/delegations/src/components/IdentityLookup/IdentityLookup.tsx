import { Control, useFormContext, UseFormReturn } from 'react-hook-form'
import { Box, Icon, toast } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { m as coreMessages } from '@island.is/portals/core'
import * as kennitala from 'kennitala'
import { useIdentityLazyQuery } from '../../screens/GrantAccess/GrantAccess.generated'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useEffect, useRef } from 'react'
import * as styles from './IdentityLookup.css'
import cn from 'classnames'

interface FormData {
  identities: Array<{ nationalId: string; name: string }>
}

export const IdentityLookup = ({
  setFormError,
  methods,
  index = 0,
}: {
  setFormError: (error: Error) => void
  methods: UseFormReturn<FormData>
  index?: number
}) => {
  const { formatMessage } = useLocale()
  // const { id, props } = field

  const userInfo = useUserInfo()
  const inputRef = useRef<HTMLInputElement>(null)

  const noUserFoundToast = () => {
    toast.warning(formatMessage(m.grantIdentityError))
  }

  const nationalIdField = `identities.${index}.nationalId` as const
  const nameField = `identities.${index}.name` as const

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = methods

  const watchNationalId = watch(nationalIdField)
  const watchName = watch(nameField)

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
    if (identity && identity.nationalId === watchNationalId.replace('-', '')) {
      setValue(nameField, identity.name)
    }
  }, [identity, watchNationalId, setValue, nameField])

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
      setValue(nameField, '')
    }
  }

  const clearPersonState = () => {
    setValue(nationalIdField, '')
    setValue(nameField, '')

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  return (
    <Box display="flex" columnGap={3} alignItems="flexStart">
      <div className={styles.inputWrapper}>
        <InputController
          control={control as unknown as Control}
          id={`identities.${index}.nationalId`}
          name={`identities.${index}.nationalId`}
          label={formatMessage(m.grantFormAccessHolder)}
          format="######-####"
          icon={watchName || queryLoading ? undefined : 'search'}
          backgroundColor="blue"
          onChange={(value) => {
            requestDelegation(value)
          }}
          ref={inputRef}
          placeholder={'000000-0000'}
          size="md"
          error={
            errors.identities?.[index]?.nationalId?.message as
              | string
              | undefined
          }
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
        />
        {queryLoading ? (
          <span
            className={cn(styles.icon, styles.loadingIcon)}
            aria-label="Loading"
          >
            <Icon icon="reload" size="large" color="blue400" />
          </span>
        ) : watchName ? (
          <button
            type="button"
            disabled={queryLoading}
            onClick={clearPersonState}
            className={styles.icon}
            aria-label={formatMessage(coreMessages.clearSelected)}
          >
            <Icon icon="close" size="large" color="blue400" />
          </button>
        ) : null}
      </div>
      <div className={styles.inputWrapper}>
        <InputController
          id={`identities.${index}.name`}
          name={`identities.${index}.name`}
          label={formatMessage(m.name)}
          readOnly
        />
      </div>
    </Box>
  )
}
