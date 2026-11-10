import { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { ExternalData, FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { NationalRegistryApi } from '../../dataProviders'
import * as m from '../../lib/messages'
import { doesAddressMatchRentalContract } from '../../utils/rentalAgreementUtils'

type UpdateExternalDataResponse = {
  updateApplicationExternalData: {
    id: string
    externalData: ExternalData
  }
}

type RefetchStatus = 'idle' | 'notUpdated' | 'error'

const NATIONAL_REGISTRY_EXTERNAL_DATA_ID = 'nationalRegistry'

export const RefetchLegalDomicile: FC<FieldBaseProps> = ({
  application,
  addExternalData,
  setSubmitButtonDisabled,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const [status, setStatus] = useState<RefetchStatus>('idle')
  const [updateApplicationExternalData, { loading }] =
    useMutation<UpdateExternalDataResponse>(UPDATE_APPLICATION_EXTERNAL_DATA)

  const addressMatches = doesAddressMatchRentalContract(
    application.answers,
    application.externalData,
  )

  useEffect(() => {
    setSubmitButtonDisabled?.(!addressMatches)
    return () => setSubmitButtonDisabled?.(false)
  }, [addressMatches, setSubmitButtonDisabled])

  const refetchNationalRegistry = async () => {
    setStatus('idle')

    try {
      const response = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              { actionId: NationalRegistryApi.actionId, order: 0 },
            ],
          },
          locale,
        },
      })

      const nationalRegistry =
        response.data?.updateApplicationExternalData?.externalData?.[
          NATIONAL_REGISTRY_EXTERNAL_DATA_ID
        ]

      if (!nationalRegistry) {
        setStatus('error')
        return
      }

      const refetchedData: ExternalData = {
        [NATIONAL_REGISTRY_EXTERNAL_DATA_ID]: nationalRegistry,
      }
      addExternalData?.(refetchedData)

      if (nationalRegistry.status !== 'success') {
        setStatus('error')
        return
      }

      const matchesAfterRefetch = doesAddressMatchRentalContract(
        application.answers,
        { ...application.externalData, ...refetchedData },
      )
      setStatus(matchesAfterRefetch ? 'idle' : 'notUpdated')
    } catch (error) {
      console.error('Failed to refetch national registry', error)
      setStatus('error')
    }
  }

  return (
    <Box>
      <Button
        variant="ghost"
        icon="reload"
        iconType="outline"
        loading={loading}
        disabled={addressMatches}
        onClick={() => void refetchNationalRegistry()}
      >
        {formatMessage(m.draftMessages.legalDomicileSection.refetchButton)}
      </Button>
      {status === 'notUpdated' && !addressMatches && (
        <Box marginTop={4}>
          <AlertMessage
            type="warning"
            title={formatMessage(
              m.draftMessages.legalDomicileSection.notUpdatedAlertTitle,
            )}
            message={formatMessage(
              m.draftMessages.legalDomicileSection.notUpdatedAlertMessage,
            )}
          />
        </Box>
      )}
      {status === 'error' && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(
              m.draftMessages.legalDomicileSection.refetchErrorTitle,
            )}
            message={formatMessage(
              m.draftMessages.legalDomicileSection.refetchErrorMessage,
            )}
          />
        </Box>
      )}
    </Box>
  )
}
