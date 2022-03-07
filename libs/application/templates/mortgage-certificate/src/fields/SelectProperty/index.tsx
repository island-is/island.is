import React, { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps, DefaultEvents } from '@island.is/application/core'
import { Box, AlertMessage, Divider, Button } from '@island.is/island-ui/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { MCEvents } from '../../lib/constants'
import { PropertiesManager } from './PropertiesManager'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { gql, useLazyQuery } from '@apollo/client'
import { VALIDATE_MORTGAGE_CERTIFICATE_QUERY } from '../../graphql/queries'

export const validateCertificateMutation = gql`
  ${VALIDATE_MORTGAGE_CERTIFICATE_QUERY}
`

export const SelectProperty: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const [runEvent, setRunEvent] = useState<string | undefined>(undefined)

  const { formatMessage } = useLocale()
  const { getValues } = useFormContext()

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const handleStateChangeAndRefetch = (newRunEvent: string) => {
    if (runEvent !== newRunEvent) {
      setRunEvent(newRunEvent)

      // save newly added values to answers
      const updatedAnswers = { ...application.answers, ...getValues() }

      submitApplication({
        variables: {
          input: {
            id: application.id,
            event: newRunEvent,
            answers: updatedAnswers,
          },
        },
      })
        .then(({ data, errors } = {}) => {
          if (data && !errors?.length) {
            // Takes them to the next state (which loads the relevant form)
            refetch?.()
          } else {
            return Promise.reject()
          }
        })
        .catch(() => {})
    }
  }

  const [runQuery, { loading }] = useLazyQuery(validateCertificateMutation, {
    onCompleted(result) {
      setShowErrorMsg(false)

      const { exists, hasKMarking } = result.validateMortgageCertificate as {
        exists: boolean
        hasKMarking: boolean
      }

      // no certificate found, we stay in draft
      if (!exists) {
        setShowErrorMsg(true)
      }
      // certificate found, but no k marking found, we send to error state
      else if (exists && !hasKMarking) {
        handleStateChangeAndRefetch(MCEvents.PENDING_REJECTED)
      }
      // otherwise if all is good, we send him to payment state
      else if (exists && hasKMarking) {
        handleStateChangeAndRefetch(DefaultEvents.PAYMENT)
      }
    },
    onError() {
      setShowErrorMsg(true)
    },
    fetchPolicy: 'no-cache',
  })

  const handleNext: any = () => {
    const updatedAnswers = { ...application.answers, ...getValues() }
    const selectedPropertyNumber = (updatedAnswers.selectProperty as {
      propertyNumber: string
    })?.propertyNumber

    runQuery({
      variables: { input: { propertyNumber: selectedPropertyNumber } },
    })
  }

  return (
    <>
      <PropertiesManager application={application} field={field} />
      <Box paddingBottom={5}>
        {!loading && showErrorMsg && (
          <AlertMessage
            type="error"
            title={formatMessage(m.errorSheriffApiTitle)}
            message={formatMessage(m.errorSheriffApiMessage)}
          />
        )}
      </Box>
      <Divider />
      <Box
        paddingTop={5}
        paddingBottom={5}
        justifyContent="flexEnd"
        display="flex"
      >
        <Button
          onClick={(e: any) => handleNext(e)}
          icon="arrowForward"
          disabled={loading}
        >
          {formatMessage(m.continue)}
        </Button>
      </Box>
    </>
  )
}
