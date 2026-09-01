import { FC, useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { ExternalData, FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { GetDebtsApi, MockPaymentCatalog } from '../../dataProviders'
import { debts as messages } from '../../lib/messages'
import {
  DEBTS_EXTERNAL_DATA_ID,
  debtsAreStale,
  debtsSignature,
  getDebts,
  getDebtsFromExternalData,
  hasFetchedDebts,
} from '../../utils/getDebts'

type UpdateExternalDataResponse = {
  updateApplicationExternalData: {
    id: string
    externalData: ExternalData
  }
}

const SELECTION_ANSWER_IDS = ['selectedDebts', 'debtsToPay'] as const

const inFlightByApplication = new Map<string, Promise<ExternalData>>()

const fetchedThisSession = new Set<string>()

export const DebtsLoader: FC<FieldBaseProps> = ({
  application,
  addExternalData,
  setBeforeSubmitCallback,
  setFieldLoadingState,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const [updateApplicationExternalData] =
    useMutation<UpdateExternalDataResponse>(UPDATE_APPLICATION_EXTERNAL_DATA)
  const { getValues, setValue } = useFormContext()

  const hasDebts = hasFetchedDebts(application.externalData)
  const [hasError, setHasError] = useState(false)
  const [wasReplaced, setWasReplaced] = useState(false)

  const hasSelection = useCallback(
    () =>
      ((getValues('selectedDebts') as boolean[] | undefined) ?? []).some(
        Boolean,
      ),
    [getValues],
  )

  const fetchDebts = useCallback(async () => {
    setHasError(false)

    try {
      let request = inFlightByApplication.get(application.id)

      if (!request) {
        request = updateApplicationExternalData({
          variables: {
            input: {
              id: application.id,
              dataProviders: [
                { actionId: GetDebtsApi.actionId, order: 0 },
                { actionId: MockPaymentCatalog.actionId, order: 0 },
              ],
            },
            locale,
          },
        })
          .then(
            (res): ExternalData =>
              res.data?.updateApplicationExternalData?.externalData ?? {},
          )
          .finally(() => {
            inFlightByApplication.delete(application.id)
          })

        inFlightByApplication.set(application.id, request)
      }

      const externalData = await request

      if (!hasFetchedDebts(externalData)) {
        const result = externalData[DEBTS_EXTERNAL_DATA_ID]
        console.error('Failed to fetch debts', {
          status: result?.status,
          reason: result?.reason,
          keys: Object.keys(externalData),
        })
        setHasError(true)
        return
      }

      if (!addExternalData) {
        console.error('DebtsLoader is missing addExternalData')
        setHasError(true)
        return
      }

      fetchedThisSession.add(application.id)

      const previous = debtsSignature(getDebts(application))
      const next = debtsSignature(getDebtsFromExternalData(externalData))

      if (previous && previous !== next) {
        if (hasSelection()) {
          setWasReplaced(true)
        }
        SELECTION_ANSWER_IDS.forEach((id) => setValue(id, []))
      }

      addExternalData(externalData)
    } catch (error) {
      console.error('Failed to fetch debts', error)
      setHasError(true)
    }
  }, [
    application,
    addExternalData,
    hasSelection,
    locale,
    setValue,
    updateApplicationExternalData,
  ])

  useEffect(() => {
    if (
      fetchedThisSession.has(application.id) &&
      !debtsAreStale(application.externalData)
    ) {
      return
    }

    void fetchDebts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFieldLoadingState?.(!hasDebts || hasError)
  }, [hasDebts, hasError, setFieldLoadingState])

  useEffect(() => {
    if (!setBeforeSubmitCallback) {
      return
    }

    setBeforeSubmitCallback(
      async () => {
        const request = inFlightByApplication.get(application.id)

        if (!request) {
          return [true, null]
        }

        await request.catch(() => undefined)

        return hasSelection() ? [true, null] : [false, '']
      },
      { allowMultiple: true, customCallbackId: 'debtsRefreshGuard' },
    )
  }, [application.id, hasSelection, setBeforeSubmitCallback])

  if (hasError) {
    return (
      <Box marginTop={2}>
        <AlertMessage
          type="error"
          title={formatMessage(messages.fetch.errorTitle)}
          message={formatMessage(messages.fetch.errorMessage)}
        />
        <Box marginTop={2}>
          <Button
            variant="ghost"
            size="small"
            onClick={() => void fetchDebts()}
          >
            {formatMessage(messages.fetch.retryButton)}
          </Button>
        </Box>
      </Box>
    )
  }

  if (!hasDebts) {
    return (
      <Box marginTop={2}>
        <SkeletonLoader
          repeat={6}
          height={40}
          space={2}
          borderRadius="large"
          display="block"
        />
      </Box>
    )
  }

  if (wasReplaced) {
    return (
      <Box marginTop={2}>
        <AlertMessage
          type="warning"
          title={formatMessage(messages.fetch.refreshedTitle)}
          message={formatMessage(messages.fetch.refreshedMessage)}
        />
      </Box>
    )
  }

  return null
}
