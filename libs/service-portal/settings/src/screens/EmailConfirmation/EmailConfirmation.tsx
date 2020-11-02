import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useVerifyEmail } from '@island.is/service-portal/graphql'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const EmailConfirmation: ServicePortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { hash }: { hash: string } = useParams()
  const [confirmationState, setConfirmationState] = useState<
    'passive' | 'success' | 'error'
  >('passive')
  const { confirmEmailVerification, loading, error } = useVerifyEmail()

  const confirmEmail = async (hash: string) => {
    try {
      const { data } = await confirmEmailVerification({
        hash,
      })
      if (data?.confirmEmailVerification?.confirmed)
        setConfirmationState('success')
      else setConfirmationState('error')
    } catch (err) {
      setConfirmationState('error')
    }
  }

  useEffect(() => {
    confirmEmail(hash)
  }, [hash])

  return (
    <>
      <Box marginBottom={4}>
        <Text variant="h1">
          {formatMessage({
            id: 'sp.settings:verify-email',
            defaultMessage: 'Staðfesta netfang',
          })}
        </Text>
      </Box>
      {loading && (
        <AlertMessage
          type="info"
          title={formatMessage({
            id: 'sp.settings:verifying-email-title',
            defaultMessage: 'Staðfesti netfang',
          })}
          message={formatMessage({
            id: 'sp.settings:verifying-email-message',
            defaultMessage: 'Augnablik, verið er að staðfesta netfangið þitt',
          })}
        />
      )}
      {confirmationState === 'success' && (
        <AlertMessage
          type="success"
          title="Netfang staðfest"
          message="Þú hefur staðfest netfangið þitt hjá hjá Stafrænt Ísland"
        />
      )}
      {(error || confirmationState === 'error') && (
        <AlertMessage
          type="error"
          title="Tókst ekki að staðfesta netfang"
          message="Eitthvað hefur farið úrskeiðis, vinsamlegast reynið aftur síðar"
        />
      )}
    </>
  )
}

export default EmailConfirmation
