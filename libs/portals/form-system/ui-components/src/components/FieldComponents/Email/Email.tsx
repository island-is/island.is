import { Dispatch, useState, ChangeEvent, useCallback } from 'react'
import { Input, Stack } from '@island.is/island-ui/core'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
  lang?: 'is' | 'en'
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const Email = ({
  item,
  dispatch,
  lang = 'is',
  hasError: otherError,
}: Props) => {
  const initialEmail = getValue(item, 'email')
  const [email, setEmail] = useState(initialEmail)
  const [hasError, setHasError] = useState(false)
  const { formatMessage } = useIntl()

  const validateEmail = useCallback((email: string): boolean => {
    return !EMAIL_REGEX.test(email)
  }, [])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newEmail = e.target.value
      setEmail(newEmail)
      if (!dispatch) return
      dispatch({
        type: 'SET_EMAIL',
        payload: {
          id: item.id,
          value: newEmail,
        },
      })
    },
    [dispatch, item.id],
  )

  const handleBlur = useCallback(() => {
    setHasError(validateEmail(email))
  }, [email, validateEmail])

  const handleFocus = useCallback(() => {
    setHasError(false)
  }, [])

  return (
    <Stack space={2}>
      <Input
        type="email"
        name="email"
        label={item.name?.[lang] ?? ''}
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        errorMessage={formatMessage(m.invalidEmail)}
        hasError={hasError || otherError}
        required={item?.isRequired ?? false}
        backgroundColor="blue"
      />
    </Stack>
  )
}
