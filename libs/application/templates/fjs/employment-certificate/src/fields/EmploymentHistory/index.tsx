import { FC, useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { getErrorViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { ExternalData, FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  VisuallyHidden,
  getTextStyles,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import { EmploymentHistoryPreviewApi } from '../../dataProviders'
import {
  errors as errorMessages,
  employmentHistory as m,
} from '../../lib/messages'
import { EmploymentHistoryPreview } from '../../lib/types'
import {
  INSTITUTION_IDS_ANSWER,
  PREVIEW_VERSION_ANSWER,
} from '../../utils/constants'
import { submitFailedWithPreviewChanged } from '../../utils/submitResult'
import { InstitutionTable } from './InstitutionTable'
import {
  getInitialSelection,
  getPreviewFromExternalData,
  toggleSelection,
} from './utils'

type UpdateExternalDataResponse = {
  updateApplicationExternalData: {
    id: string
    externalData: ExternalData
  }
}

// One request per application at a time, also across quick remounts.
const inFlightByApplication = new Map<string, Promise<ExternalData>>()

const SmallMarkdown: FC<{ children: string }> = ({ children }) => (
  <Box component="div" className={getTextStyles({ variant: 'small' })}>
    <Markdown>{children}</Markdown>
  </Box>
)

/**
 * Fetches the history every time the screen opens and keeps it in React state
 * only. Only the `previewVersion` and the ticked institution IDs are saved.
 */
export const EmploymentHistory: FC<FieldBaseProps> = ({
  application,
  errors,
  setFieldLoadingState,
  setSubmitButtonDisabled,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const { getValues, setValue } = useFormContext()
  const [updateApplicationExternalData] =
    useMutation<UpdateExternalDataResponse>(UPDATE_APPLICATION_EXTERNAL_DATA)

  const [preview, setPreview] = useState<EmploymentHistoryPreview>()
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const fetchPreview = useCallback(async () => {
    setLoading(true)
    setHasError(false)

    try {
      let request = inFlightByApplication.get(application.id)

      if (!request) {
        request = updateApplicationExternalData({
          variables: {
            input: {
              id: application.id,
              dataProviders: [
                { actionId: EmploymentHistoryPreviewApi.actionId, order: 0 },
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

      // The endpoint ignores `throwOnError`, so a failure comes back as a
      // result with `status: 'failure'` rather than as an error.
      const result = getPreviewFromExternalData(await request)

      if (!result) {
        setHasError(true)
        return
      }

      const selection = getInitialSelection(
        result.institutions,
        getValues(INSTITUTION_IDS_ANSWER),
      )
      setPreview(result)
      setSelected(selection)
      setValue(PREVIEW_VERSION_ANSWER, result.previewVersion)
      setValue(INSTITUTION_IDS_ANSWER, selection)
    } catch {
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }, [
    application.id,
    getValues,
    locale,
    setValue,
    updateApplicationExternalData,
  ])

  // Once, when the screen opens.
  useEffect(() => {
    void fetchPreview()
  }, [])

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [loading, setFieldLoadingState])

  const hasHistory = !!preview && preview.institutions.length > 0
  const noneSelected = hasHistory && selected.length === 0
  const blockSubmit = loading || hasError || !hasHistory || noneSelected
  useEffect(() => {
    setSubmitButtonDisabled?.(blockSubmit)
    return () => setSubmitButtonDisabled?.(false)
  }, [blockSubmit, setSubmitButtonDisabled])

  const onToggle = (id: string) => {
    if (!preview) {
      return
    }
    const next = toggleSelection(preview.institutions, selected, id)
    setSelected(next)
    setValue(INSTITUTION_IDS_ANSWER, next, { shouldValidate: true })
  }

  if (hasError) {
    return (
      <Box marginTop={2}>
        <AlertMessage
          type="error"
          title={formatMessage(m.fetchErrorTitle)}
          message={
            <SmallMarkdown>{formatMessage(m.fetchErrorMessage)}</SmallMarkdown>
          }
        />
        <Box marginTop={2}>
          <Button
            variant="ghost"
            size="small"
            icon="reload"
            onClick={() => void fetchPreview()}
          >
            {formatMessage(m.retryButton)}
          </Button>
        </Box>
      </Box>
    )
  }

  if (loading || !preview) {
    return (
      <Box marginTop={2} aria-busy="true">
        <VisuallyHidden>{formatMessage(m.loading)}</VisuallyHidden>
        <SkeletonLoader
          repeat={4}
          height={40}
          space={2}
          borderRadius="large"
          display="block"
        />
      </Box>
    )
  }

  // Can't happen after the eligibility check, unless the history changed since.
  if (!hasHistory) {
    return (
      <Box marginTop={2}>
        <AlertMessage
          type="error"
          title={formatMessage(errorMessages.noHistoryTitle)}
          message={
            <SmallMarkdown>
              {formatMessage(errorMessages.noHistorySummary)}
            </SmallMarkdown>
          }
        />
      </Box>
    )
  }

  const selectionError =
    getErrorViaPath(errors ?? {}, INSTITUTION_IDS_ANSWER) ||
    (noneSelected ? formatMessage(m.noneSelectedError) : undefined)

  return (
    <Box marginTop={2}>
      {submitFailedWithPreviewChanged(application.externalData) && (
        <Box marginBottom={3}>
          <AlertMessage
            type="warning"
            title={formatMessage(m.previewChangedTitle)}
            message={formatMessage(m.previewChangedMessage)}
          />
        </Box>
      )}

      <InstitutionTable
        institutions={preview.institutions}
        selected={selected}
        onToggle={onToggle}
        error={selectionError}
      />
    </Box>
  )
}
