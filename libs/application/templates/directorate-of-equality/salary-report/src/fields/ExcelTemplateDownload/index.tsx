import { getValueViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import {
  ActionCard,
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMutation } from '@apollo/client'
import { FC, useEffect, useRef, useState } from 'react'
import { createDefaultJobFactors, SyncMethodEnum } from '../../utils/constants'
import type { ReportCriterionDto } from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import { messages } from '../../lib/messages'

// The next screen in the flow — both upload and manual entry advance here.
const NEXT_SCREEN_ID = 'criteriaMultiField'

export const ExcelTemplateDownload: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, goToScreen, setBeforeSubmitCallback, answerQuestions }) => {
  const { formatMessage, lang: locale } = useLocale()
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(
    null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )
  // Ensures the DMR draft exists (idempotent) and fetches its criteria —
  // this is the sole entry point that opens the draft, since it's the first
  // screen of the part of the form the draft now owns. Shares the
  // `draftCriteria` externalData key with CriteriaEditor, so that screen
  // gets this read for free on first visit without its own refetch.
  const { content, loading, refetch } = useDraftQuery<{
    criteria: ReportCriterionDto[]
  }>(application, 'DirectorateOfEquality.listDraftCriteria', 'draftCriteria', {
    ensureDraft: true,
  })
  const { sync } = useDraftSync(application)

  const base64Template = getValueViaPath<string>(
    application.externalData,
    'blankExcelTemplate.data.base64',
  )
  const filename =
    getValueViaPath<string>(
      application.externalData,
      'blankExcelTemplate.data.filename',
    ) ?? 'launagreining-sniðmát.xlsx'

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Template}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const XLSX_CONTENT_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  // Cap the presigned upload so a stalled request can't leave isImporting stuck.
  const UPLOAD_TIMEOUT_MS = 60_000

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset so the same file can be re-selected if needed
    e.target.value = ''

    setIsImporting(true)
    setImportStatus(null)
    try {
      // 1. Ask the server (authenticated against DMR) for a presigned upload
      //    URL. The resulting { url, key } lands in externalData.importPresign.
      const presignResult = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: 'DirectorateOfEquality.presignImportUpload',
                order: 0,
              },
            ],
          },
          locale,
        },
      })

      const presign = presignResult.data?.updateApplicationExternalData
        .externalData?.importPresign?.data as
        | { url: string; key: string }
        | undefined

      if (!presign?.url) {
        setImportStatus('error')
        return
      }

      // 2. Upload the raw workbook bytes straight to the presigned URL. No auth
      //    header — the URL itself is the capability. DMR decides the target
      //    (local disk vs S3) and returns it, so never hardcode it here.
      const controller = new AbortController()
      const uploadTimeout = setTimeout(
        () => controller.abort(),
        UPLOAD_TIMEOUT_MS,
      )
      let uploadResponse: Response
      try {
        uploadResponse = await fetch(presign.url, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': XLSX_CONTENT_TYPE },
          signal: controller.signal,
        })
      } finally {
        clearTimeout(uploadTimeout)
      }

      if (!uploadResponse.ok) {
        setImportStatus('error')
        return
      }

      // 3. Trigger the import — the server reads the key from externalData and
      //    calls DMR's `draft/import` with { key }. REPLACE semantics: the
      //    draft's scoring content is bulk-seeded from the workbook there.
      const result = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: 'DirectorateOfEquality.importSalaryDraftWorkbook',
                order: 0,
              },
            ],
          },
          locale,
        },
      })

      const importData = result.data?.updateApplicationExternalData.externalData
        ?.importSalaryDraftWorkbook as
        | {
            status?: 'success' | 'failure'
            data?: { criteria?: { type?: string }[] }
          }
        | undefined

      if (importData?.status !== 'success') {
        setImportStatus('error')
        return
      }

      // 4. The import response is only an ack for the DRAFT content — the UI
      //    still re-fetches the draft's criteria so downstream screens
      //    populate from DMR, never from this response, and never into
      //    applicationAnswers. The one exception is the "does a PERSONAL
      //    criterion exist" navigation signal below: that's read straight
      //    off this response since it's already right here, and it must be
      //    answers-backed regardless (see `hasPersonalCriteria` in
      //    dataSchema.ts for why).
      await refetch({ silent: true })
      answerQuestions?.({
        hasPersonalCriteria:
          importData.data?.criteria?.some((c) => c.type === 'PERSONAL') ??
          false,
      })
      setImportStatus('success')
      goToScreen?.(NEXT_SCREEN_ID)
    } catch {
      setImportStatus('error')
    } finally {
      setIsImporting(false)
    }
  }

  // Manual entry mirrors "continue without a workbook": seed the four fixed
  // job factors onto the draft (via sync) if nothing is there yet, then move
  // on. Existing draft content (from a prior import or manual entry) is left
  // untouched.
  const handleManualEntry = async () => {
    if (!content || content.criteria.length === 0) {
      const jobFactors = createDefaultJobFactors()
      await sync({
        criteria: jobFactors.map((factor) => ({
          method: SyncMethodEnum.CREATE,
          id: factor.id,
          data: {
            title: factor.title,
            description: factor.description,
            weight: Number(factor.weight) || 0,
            type: factor.type,
          },
        })),
      })
      await refetch({ silent: true })
    }
    goToScreen?.(NEXT_SCREEN_ID)
  }

  // Pressing the footer "Halda áfram" behaves the same as manual entry: if
  // the draft has no criteria yet, seed the defaults before advancing;
  // existing content (imported or manually entered) is preserved.
  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      if (!content || content.criteria.length === 0) {
        const jobFactors = createDefaultJobFactors()
        await sync({
          criteria: jobFactors.map((factor) => ({
            method: SyncMethodEnum.CREATE,
            id: factor.id,
            data: {
              title: factor.title,
              description: factor.description,
              weight: Number(factor.weight) || 0,
              type: factor.type,
            },
          })),
        })
        await refetch({ silent: true })
      }
      return [true, null]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBeforeSubmitCallback, content])

  const m = messages.report.dataEntry

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {base64Template && (
        <Box display="flex" justifyContent="flexEnd" marginBottom={3}>
          <Button
            variant="utility"
            icon="download"
            iconType="outline"
            onClick={handleDownload}
          >
            {formatMessage(m.downloadTemplateButton)}
          </Button>
        </Box>
      )}

      {isImporting ? (
        <Box display="flex" justifyContent="center" paddingY={5}>
          <LoadingDots />
        </Box>
      ) : (
        <Stack space={2}>
          <ActionCard
            backgroundColor="white"
            heading={formatMessage(m.uploadCardTitle)}
            text={formatMessage(m.uploadCardIntro)}
            cta={{
              label: formatMessage(m.uploadButtonLabel),
              variant: 'primary',
              icon: 'attach',
              onClick: () => fileInputRef.current?.click(),
            }}
          />
          <ActionCard
            backgroundColor="white"
            heading={formatMessage(m.manualEntryCardTitle)}
            text={formatMessage(m.manualEntryCardIntro)}
            cta={{
              label: formatMessage(m.manualEntryButtonLabel),
              variant: 'primary',
              icon: 'arrowForward',
              onClick: () => void handleManualEntry(),
            }}
          />
        </Stack>
      )}

      {importStatus === 'error' && (
        <Box marginTop={3}>
          <AlertMessage type="error" message={formatMessage(m.importError)} />
        </Box>
      )}
    </Box>
  )
}
