import { Box, Button, LoadingDots, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { isDefined } from '@island.is/shared/utils'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { Problem } from '@island.is/react-spa/shared'
import { mVerify } from '../../../../../../../lib/messages'
import { TwoFactorInputs } from '../TwoFactorInputs'
import { VerifyFooter } from '../VerifyFooter'
import { VerifyHeader } from '../VerifyHeader'
import { validateThreeDigitCode } from '../validate'
import * as styles from './VerifyTemplate.css'

type TextNode = string | ReactNode

type VerifyTemplateProps = {
  title: TextNode
  intro: TextNode
  link: {
    label: string
    onClick(): void
  }
  remainingAttempts?: number
  onNoCodeReceivedCallback(): Promise<void>
}

export const VerifyTemplate = ({
  title,
  intro,
  link,
  onNoCodeReceivedCallback,
  remainingAttempts,
}: VerifyTemplateProps) => {
  const [clearCode, setClearCode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { formatMessage } = useLocale()
  const [noCodeReceivedLoading, setNoCodeReceivedLoading] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const onNoCodeReceived = async () => {
    setNoCodeReceivedLoading(true)
    await onNoCodeReceivedCallback()

    // Delay the toast to give the user a chance to see the loading state and prevent spamming the button
    setTimeout(() => {
      toast.success(formatMessage(mVerify.codeSentSuccess))

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
    if (remainingAttempts && remainingAttempts > 0 && remainingAttempts <= 2) {
      setClearCode(true)
      setButtonDisabled(true)
    }
  }, [remainingAttempts])

  const onClearCodeReset = useCallback(() => {
    setClearCode(false)
  }, [])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const code = formData.get('code') as string

    if (validateThreeDigitCode(code)) {
      setError(formatMessage(mVerify.validateTwoFactorError))
    } else {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Box display="flex" flexDirection="column" rowGap={3}>
        <VerifyHeader
          label={formatMessage(mVerify.confirmEmail)}
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
                  {formatMessage(mVerify.noCodeReceived)}
                </Button>
              )}
            </Box>
          }
        />

        {error && (
          <Problem size="small" title={formatMessage(mVerify.errorOccured)} />
        )}

        <Box width="full" marginTop={1}>
          <TwoFactorInputs
            onChange={onTwoFactorCodeChange}
            clearCode={clearCode}
            onClearCodeReset={onClearCodeReset}
            error={
              error ||
              (isDefined(remainingAttempts) && remainingAttempts > 0
                ? formatMessage(mVerify.wrongCodeTitle)
                : undefined)
            }
          />
        </Box>

        <VerifyFooter
          ref={submitButtonRef}
          button={{
            type: 'submit',
            loading,
            ariaLabelLoading: formatMessage(mVerify.ariaLabelVerifyingCode),
            label: formatMessage(mVerify.confirm),
            disabled: buttonDisabled,
            ariaLabelButtonDisabled: formatMessage(
              mVerify.ariaSubmitButtonDisabled,
              {
                label: formatMessage(
                  mVerify.securityCodeSpecialIS,
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
