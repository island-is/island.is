import {
  AlertMessage,
  Box,
  Checkbox,
  DatePicker,
  GridColumn,
  GridRow,
  Icon,
  Input,
  Select,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { BackButton } from '@island.is/portals/admin/core'
import React, { useEffect, useRef, useState } from 'react'

import { IntroHeader, m as coreMessages } from '@island.is/portals/core'
import {
  DelegationsFormFooter,
  useDynamicShadow,
} from '@island.is/portals/shared-modules/delegations'
import { useUserInfo } from '@island.is/react-spa/bff'
import { replaceParams } from '@island.is/react-spa/shared'
import { AuthDelegationType } from '@island.is/shared/types'
import { maskString, unmaskString } from '@island.is/shared/utils'
import cn from 'classnames'
import startOfDay from 'date-fns/startOfDay'
import kennitala from 'kennitala'
import NumberFormat from 'react-number-format'
import {
  Form,
  useActionData,
  useNavigate,
  useSearchParams,
  useSubmit,
} from 'react-router-dom'
import { CreateDelegationConfirmModal } from '../../components/CreateDelegationConfirmModal'
import { FORM_ERRORS } from '../../constants/errors'
import { m } from '../../lib/messages'
import { DelegationAdminPaths } from '../../lib/paths'
import { CreateDelegationResult } from './CreateDelegation.action'
import * as styles from './CreateDelegation.css'
import { useIdentityLazyQuery } from './CreateDelegation.generated'

const validateNationalId = (nationalId: string) => {
  const value = nationalId.replace('-', '').trim()
  return value.length === 10 && kennitala.isValid(value)
}

/**
 * Looks up the identity of a national id once it is complete and valid. The
 * identity is only returned while it matches the current national id, so a
 * lookup that answers after the value changed is ignored.
 */
const useIdentityLookup = (onNotFound: () => void) => {
  const [nationalId, setNationalId] = useState('')
  const nationalIdRef = useRef('')
  const [getIdentity, { data, loading }] = useIdentityLazyQuery({
    onError: (error) => {
      console.error(error)
    },
    onCompleted: ({ identity }) => {
      if (!identity && validateNationalId(nationalIdRef.current)) {
        onNotFound()
      }
    },
  })

  const lookup = (value: string) => {
    nationalIdRef.current = value
    setNationalId(value)
    if (validateNationalId(value)) {
      getIdentity({ variables: { input: { nationalId: value } } })
    }
  }

  const identity =
    data?.identity && data.identity.nationalId === nationalId
      ? data.identity
      : null

  return {
    nationalId,
    identity,
    loading: loading && validateNationalId(nationalId),
    lookup,
    clear: () => lookup(''),
  }
}

const CreateDelegationScreen = () => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const submit = useSubmit()
  const actionData = useActionData() as CreateDelegationResult
  const [noEndDate, setNoEndDate] = React.useState(true)
  const [validTo, setValidTo] = React.useState<Date | null>(null)
  const [isConfirmed, setIsConfirmed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const fromInputRef = React.useRef<HTMLInputElement>(null)
  const toInputRef = React.useRef<HTMLInputElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { showShadow } = useDynamicShadow({ rootMargin: '-112px' })
  const defaultFromNationalId = searchParams.get('fromNationalId')

  const typeOptions = [
    {
      label: formatMessage(m.generalMandateLabel),
      value: AuthDelegationType.GeneralMandate,
    },
  ]

  async function success() {
    try {
      const maskedNationalId = await maskString(
        fromIdentity?.nationalId ?? '',
        userInfo?.profile.nationalId ?? '',
      )
      successToast()
      setLoading(false)
      setShowConfirmModal(false)
      navigate(
        replaceParams({
          href: DelegationAdminPaths.DelegationAdmin,
          params: {
            nationalId: maskedNationalId ?? '',
          },
        }),
        { replace: true },
      )
    } catch (e) {
      navigate(DelegationAdminPaths.Root)
    }
  }

  useEffect(() => {
    if (actionData?.success) {
      success()
    }

    if (actionData?.data && !actionData.errors) {
      setIsConfirmed(true)
      setShowConfirmModal(true)
    } else {
      setLoading(false)
      setIsConfirmed(false)
      setShowConfirmModal(false)
    }
  }, [actionData])

  const noUserFoundToast = () => {
    toast.warning(formatMessage(m.grantIdentityError))
  }

  const successToast = () => {
    toast.success(formatMessage(m.createDelegationSuccessToast))
  }

  const from = useIdentityLookup(noUserFoundToast)
  const to = useIdentityLookup(noUserFoundToast)
  const fromIdentity = from.identity
  const toIdentity = to.identity

  useEffect(() => {
    async function getFromNationalId() {
      const unmaskedNationalId = await unmaskString(
        defaultFromNationalId ?? '',
        userInfo?.profile.nationalId ?? '',
      )
      if (unmaskedNationalId && validateNationalId(unmaskedNationalId)) {
        from.lookup(unmaskedNationalId)
      }
    }

    !!defaultFromNationalId && getFromNationalId()
  }, [defaultFromNationalId])

  const Loading = () => (
    <span className={cn(styles.icon, styles.loadingIcon)} aria-label="Loading">
      <Icon icon="reload" size="large" color="blue400" />
    </span>
  )

  const ClearButton = ({
    onClick,
    loading,
  }: {
    onClick: () => void
    loading: boolean
  }) => (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={styles.icon}
      aria-label={formatMessage(coreMessages.clearSelected)}
    >
      <Icon icon="close" size="large" color="blue400" />
    </button>
  )

  return (
    <Stack space="containerGutter">
      <BackButton onClick={() => navigate(-1)} />
      <div>
        <IntroHeader
          title={m.createNewDelegation}
          intro={m.delegationAdminCreateNewDelegationDescription}
        />
        <Form method="post" ref={formRef}>
          <GridRow rowGap={3}>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <div className={styles.inputWrapper}>
                {fromIdentity?.name && (
                  <Input
                    name="fromName"
                    defaultValue={fromIdentity.name}
                    aria-live="assertive"
                    label={formatMessage(m.fromNationalId)}
                    backgroundColor="blue"
                    required
                  />
                )}

                <Box
                  display={fromIdentity?.name ? 'none' : 'block'}
                  aria-live="assertive"
                >
                  <NumberFormat
                    type="tel"
                    name="fromNationalId"
                    label={formatMessage(m.fromNationalId)}
                    backgroundColor="blue"
                    customInput={Input}
                    format="######-####"
                    onValueChange={({ value }) => from.lookup(value)}
                    value={from.nationalId}
                    required
                    getInputRef={fromInputRef}
                    errorMessage={formatMessage(
                      m[actionData?.errors?.fromNationalId as keyof typeof m],
                    )}
                  />
                </Box>
                {from.loading ? (
                  <Loading />
                ) : fromIdentity?.name ? (
                  <ClearButton
                    loading={from.loading}
                    onClick={() => {
                      from.clear()
                      if (defaultFromNationalId) {
                        setSearchParams(
                          (params) => {
                            params.delete('fromNationalId')
                            return params
                          },
                          { replace: true },
                        )
                      }

                      setTimeout(() => {
                        if (fromInputRef.current) {
                          fromInputRef.current.focus()
                        }
                      }, 0)
                    }}
                  />
                ) : null}
              </div>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <div className={styles.inputWrapper}>
                {toIdentity?.name && (
                  <Input
                    name="toName"
                    defaultValue={toIdentity.name}
                    aria-live="assertive"
                    label={formatMessage(m.toNationalId)}
                    backgroundColor="blue"
                    required
                  />
                )}
                <Box
                  display={toIdentity?.name ? 'none' : 'block'}
                  aria-live="assertive"
                >
                  <NumberFormat
                    type="tel"
                    name="toNationalId"
                    label={formatMessage(m.toNationalId)}
                    backgroundColor="blue"
                    customInput={Input}
                    format="######-####"
                    onValueChange={({ value }) => to.lookup(value)}
                    value={to.nationalId}
                    getInputRef={toInputRef}
                    required
                    errorMessage={formatMessage(
                      m[actionData?.errors?.toNationalId as keyof typeof m],
                    )}
                  />
                </Box>
                {to.loading ? (
                  <Loading />
                ) : toIdentity?.name ? (
                  <ClearButton
                    loading={to.loading}
                    onClick={() => {
                      to.clear()
                      setTimeout(() => {
                        if (toInputRef.current) {
                          toInputRef.current.focus()
                        }
                      }, 0)
                    }}
                  />
                ) : null}
              </div>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Select
                backgroundColor="white"
                label={formatMessage(m.type)}
                name="type"
                required
                noOptionsMessage="No options"
                defaultValue={typeOptions[0]}
                options={typeOptions}
                placeholder={formatMessage(m.type)}
                size="md"
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Checkbox
                label={formatMessage(m.noEndDate)}
                name="noEndDate"
                filled
                defaultChecked
                onChange={(e) => {
                  setNoEndDate(e.target.checked)
                }}
                value={noEndDate.toString()}
              />
            </GridColumn>
            {!noEndDate && (
              <GridColumn span={['12/12', '12/12', '7/12']}>
                <DatePicker
                  name="validToPicker"
                  label={formatMessage(m.type)}
                  locale="is"
                  placeholderText={formatMessage(m.validTo)}
                  required
                  handleChange={(d) => setValidTo(d)}
                  errorMessage={formatMessage(
                    m[actionData?.errors?.validTo as keyof typeof m],
                  )}
                  minDate={startOfDay(new Date())}
                  appearInline
                />
                <input
                  type="hidden"
                  name="validTo"
                  value={validTo?.toISOString()}
                />
              </GridColumn>
            )}
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Input
                name="referenceId"
                label={formatMessage(m.referenceId)}
                backgroundColor="blue"
                required
                errorMessage={formatMessage(
                  m[actionData?.errors?.referenceId as keyof typeof m],
                )}
              />
            </GridColumn>
            <input type="hidden" name="confirmed" value={String(isConfirmed)} />
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <DelegationsFormFooter
                onCancel={() => navigate(DelegationAdminPaths.Root)}
                divider={false}
                confirmLabel={formatMessage(m.create)}
                showShadow={showShadow}
                confirmIcon="arrowForward"
              />
            </GridColumn>
            {actionData?.globalError && (
              <GridColumn span={['12/12', '12/12', '7/12']}>
                <AlertMessage
                  title=""
                  message={(() => {
                    const { title, detail } = actionData?.problem ?? {}
                    if (detail?.toLowerCase().includes('deceased')) {
                      return formatMessage(m.deceasedIndividualError)
                    }
                    const mapped =
                      FORM_ERRORS[title as keyof typeof FORM_ERRORS]
                    return mapped
                      ? formatMessage(mapped)
                      : formatMessage(m.errorDefault)
                  })()}
                  type="error"
                />
              </GridColumn>
            )}
          </GridRow>
        </Form>
      </div>

      <CreateDelegationConfirmModal
        fromIdentity={fromIdentity}
        toIdentity={toIdentity}
        data={actionData?.data}
        isVisible={showConfirmModal}
        loading={loading}
        onClose={() => {
          setIsConfirmed(false)
          setShowConfirmModal(false)
        }}
        onConfirm={() => {
          submit(formRef.current)
          setLoading(true)
        }}
      />
    </Stack>
  )
}

export default CreateDelegationScreen
