import { Box, Button, LoadingDots, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { isDefined } from '@island.is/shared/utils'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { ApolloError } from '@apollo/client'
import { Problem } from '@island.is/react-spa/shared'
import { TwoFactorInputs } from '../TwoFactorInputs'
import { VerifyFooter } from '../VerifyFooter'
import { VerifyHeader } from '../VerifyHeader'
import { validateThreeDigitCode } from '../validate'
import * as styles from './VerifyTemplate.css'
import { emailsMsg } from '../../../lib/messages'

type TextNode = string | ReactNode
export type VerifyTemplateInput = {
  code: string
  email: string
}

type VerifyTemplateProps = {
  title: TextNode
  intro: TextNode
  link: {
    label: string
    onClick(): void
  }
  onNoCodeReceivedCallback(email: string): Promise<void>
  onSubmitCallback(input: VerifyTemplateInput): Promise<void>
  email: string
  loading: boolean
  serverError?: ApolloError
}

export const VerifyTemplate = ({
  title,
  intro,
  link,
  onNoCodeReceivedCallback,
  onSubmitCallback,
  email,
  loading,
  serverError,
}: VerifyTemplateProps) => {
  const { formatMessage } = useLocale()
  const [clearCode, setClearCode] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [serverErrorProblem, setServerErrorProblem] = useState<
    { title: string; message: string } | undefined
  >()
  const [noCodeReceivedLoading, setNoCodeReceivedLoading] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const problem = serverError?.graphQLErrors[0].extensions.problem as {
    remainingAttempts?: number
    detail?: string
    status: number
  }

  const remainingAttempts = problem?.remainingAttempts

  const formatServerError = (err: ApolloError) => {
    if (err) {
      if (isDefined(remainingAttempts)) {
        if (remainingAttempts > 0) {
          return undefined
        } else if (remainingAttempts === 0) {
          return formatMessage(emailsMsg.noAttemptsLeftError)
        } else if (remainingAttempts < 0) {
          // remainingAttempts === -1 means max attempts already exceeded
          return formatMessage(emailsMsg.tooManyAttempts)
        }
      }

      const detail = problem?.detail?.toLowerCase() ?? ''

      if (problem?.status === 400) {
        if (detail.includes('email already exists')) {
          return formatMessage(emailsMsg.emailAlreadyExists)
        }
        if (detail.includes('expired')) {
          return formatMessage(emailsMsg.verificationExpired)
        }
        if (
          detail.includes('does not match') ||
          detail.includes('does not exist')
        ) {
          return formatMessage(emailsMsg.verificationNotFound)
        }
        if (detail.includes('too many failed')) {
          return formatMessage(emailsMsg.tooManyAttempts)
        }
      }
    }

    return formatMessage(emailsMsg.errorOccured)
  }

  const onNoCodeReceived = async () => {
    setNoCodeReceivedLoading(true)
    await onNoCodeReceivedCallback(email)

    // Delay the toast to give the user a chance to see the loading state and prevent spamming the button
    setTimeout(() => {
      toast.success(formatMessage(emailsMsg.codeSentSuccess))
      setNoCodeReceivedLoading(false)
    }, 3000)
  }

  const onTwoFactorCodeChange = useCallback((code: string) => {
    const isValid = validateThreeDigitCode(code)

    setButtonDisabled(!isValid)

    // If code is valid, focus the submit button
    if (isValid) {
      submitButtonRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    if (remainingAttempts && remainingAttempts > 0 && remainingAttempts <= 5) {
      setClearCode(true)
      setButtonDisabled(true)
    }
  }, [remainingAttempts])

  useEffect(() => {
    if (serverError) {
      const formattedError = formatServerError(serverError)

      if (formattedError) {
        setServerErrorProblem({
          title: formattedError,
          message: '',
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverError])

  const onClearCodeReset = useCallback(() => {
    setClearCode(false)
  }, [])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const code = formData.get('code') as string

    if (validateThreeDigitCode(code)) {
      onSubmitCallback({ code, email })
    } else {
      setError(formatMessage(emailsMsg.validateTwoFactorError))
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Box display="flex" flexDirection="column" rowGap={3}>
        <VerifyHeader
          label={formatMessage(emailsMsg.confirmEmail)}
          title={title}
          intro={intro}
          subtitle={
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              rowGap={1}
              className={styles.subtitleContainer}
            >
              {noCodeReceivedLoading ? (
                <div className={styles.noCodeReceivedLoadingWrapper}>
                  <LoadingDots />
                </div>
              ) : (
                <Button size="small" variant="text" onClick={onNoCodeReceived}>
                  {formatMessage(emailsMsg.noCodeReceived)}
                </Button>
              )}
            </Box>
          }
        />

        {serverErrorProblem && <Problem size="small" {...serverErrorProblem} />}

        <Box width="full" marginTop={1}>
          <TwoFactorInputs
            onChange={onTwoFactorCodeChange}
            clearCode={clearCode}
            onClearCodeReset={onClearCodeReset}
            error={
              error ||
              (isDefined(remainingAttempts) && remainingAttempts > 0
                ? formatMessage(emailsMsg.wrongCodeTitle)
                : undefined)
            }
          />
        </Box>

        <VerifyFooter
          ref={submitButtonRef}
          button={{
            type: 'submit',
            loading,
            ariaLabelLoading: formatMessage(emailsMsg.ariaLabelVerifyingCode),
            label: formatMessage(emailsMsg.confirm),
            disabled: buttonDisabled,
            ariaLabelButtonDisabled: formatMessage(
              emailsMsg.ariaSubmitButtonDisabled,
              {
                label: formatMessage(
                  emailsMsg.securityCodeSpecialIS,
                ).toLowerCase(),
              },
            ),
          }}
          link={link}
        />
      </Box>
    </form>
  )
}
