import { getValueViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import {
  ActionCard,
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  InputFileUpload,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMutation } from '@apollo/client'
import { FC, useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import {
  ApiActions,
  createDefaultJobFactors,
  draftActionId,
  SyncMethodEnum,
} from '../../utils/constants'
import type { ReportCriterionDto } from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import { messages } from '../../lib/messages'
import { getProviderErrorMessages } from '../../utils/providerError'

// Manual entry (and the footer's default submit, prior to any successful
// import) both advance here — a successful Excel import instead jumps
// straight to ANALYSIS_SCREEN_ID, see importSucceededRef below.
const MANUAL_ENTRY_NEXT_SCREEN_ID = 'criteriaMultiField'
const ANALYSIS_SCREEN_ID = 'salaryAnalysisOverviewMultiField'

export const ExcelTemplateDownload: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, goToScreen, setBeforeSubmitCallback, answerQuestions }) => {
  const { formatMessage, lang: locale } = useLocale()
  const m = messages.report.dataEntry
  const [isImporting, setIsImporting] = useState(false)
  // The API rejects a bad workbook either with one specific reason ("Sniðmátið
  // er af eldri útgáfu … Sæktu nýjasta sniðmátið") or with one entry per
  // invalid row, so the generic importError alone would leave the likeliest
  // failure unexplained.
  const [importErrorMessages, setImportErrorMessages] = useState<
    string[] | undefined
  >()
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(
    null,
  )
  // The file currently sitting in the dropzone. Cleared on failure so the
  // "choose files" affordance reappears immediately for a retry — InputFileUpload
  // hides it while files.length !== 0 (multiple: false).
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // Client-side rejection (wrong file type, dropped via drag-and-drop) — a
  // distinct surface from importErrorMessages (server round-trip failures).
  // Each path resets the other's state so a stale message from one can't sit
  // alongside a fresh one from the other.
  const [uploadRejectionMessage, setUploadRejectionMessage] = useState<
    string | undefined
  >()
  // Set once an Excel import succeeds; read by the setBeforeSubmitCallback
  // below so the footer's default "Halda áfram" button also shortcuts to the
  // analysis screen instead of advancing to criteriaMultiField.
  const importSucceededRef = useRef(false)

  // Every failure path goes through this so none can leave a stale reason from
  // an earlier workbook import on screen — a manual-entry failure must not show
  // "Sniðmátið er af eldri útgáfu".
  const failImport = (messages?: string[]) => {
    setImportErrorMessages(messages)
    setImportStatus('error')
    setSelectedFile(null)
  }

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )
  // Ensures the draft exists (idempotent); shares the 'draftCriteria' key
  // with CriteriaEditor so that screen reuses this fetch.
  const { content, loading, hasError, refetch } = useDraftQuery<{
    criteria: ReportCriterionDto[]
  }>(
    application,
    draftActionId(ApiActions.listDraftCriteria),
    'draftCriteria',
    {
      ensureDraft: true,
    },
  )
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

  const handleFileSelected = async (file: File) => {
    setIsImporting(true)
    setImportStatus(null)
    setImportErrorMessages(undefined)
    setUploadRejectionMessage(undefined)
    try {
      // 1. Ask the server (authenticated against DMR) for a presigned upload
      //    URL. The resulting { url, key } lands in externalData.importPresign.
      const presignResult = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: draftActionId(ApiActions.presignImportUpload),
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
        failImport()
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
        failImport()
        return
      }

      // 3. Trigger the import — REPLACE semantics: DMR bulk-seeds the draft's
      //    scoring content from the workbook.
      const result = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: draftActionId(ApiActions.importSalaryDraftWorkbook),
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
            reason?: string | string[] | { title?: string; summary?: string }
          }
        | undefined

      if (importData?.status !== 'success') {
        failImport(getProviderErrorMessages(importData?.reason))
        return
      }

      // 4. Re-fetch so downstream screens read from DMR, not this response —
      //    except the PERSONAL-criteria signal below, which must stay
      //    answers-backed (see `hasPersonalCriteria` in dataSchema.ts).
      await refetch({ silent: true })
      answerQuestions?.({
        hasPersonalCriteria:
          importData.data?.criteria?.some((c) => c.type === 'PERSONAL') ??
          false,
      })
      importSucceededRef.current = true
      setImportStatus('success')
    } catch {
      failImport()
    } finally {
      setIsImporting(false)
    }
  }

  const handleFilesChanged = (newFiles: File[]) => {
    const file = newFiles[0]
    if (!file) return
    setSelectedFile(file)
    setUploadRejectionMessage(undefined)
    void handleFileSelected(file)
  }

  const handleUploadRejection = (rejections: FileRejection[]) => {
    // Clear the other error surface — a stale server-round-trip failure must
    // not linger under a fresh client-side rejection message, or vice versa.
    setImportStatus(null)
    setImportErrorMessages(undefined)
    setSelectedFile(null)
    setUploadRejectionMessage(
      rejections[0]?.errors[0]?.code === 'file-invalid-type'
        ? formatMessage(m.invalidFileType)
        : formatMessage(m.importError),
    )
  }

  // Shared by manual entry and the footer button: seed the draft's default
  // job factors if it's still empty, otherwise leave existing content alone.
  // Both callers can fire close together (double-click, or manual entry then
  // footer submit before `refetch` lands), so an in-flight seed is reused
  // instead of racing a second `sync` that would double the factors.
  const seededRef = useRef(false)
  const seedPromiseRef = useRef<Promise<void> | null>(null)
  const seedDefaultJobFactorsIfEmpty = () => {
    if (seededRef.current) return Promise.resolve()
    if (content && content.criteria.length > 0) {
      seededRef.current = true
      return Promise.resolve()
    }
    if (!seedPromiseRef.current) {
      seedPromiseRef.current = (async () => {
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
        seededRef.current = true
      })().finally(() => {
        seedPromiseRef.current = null
      })
    }
    return seedPromiseRef.current
  }

  // Manual entry mirrors "continue without a workbook".
  const handleManualEntry = async () => {
    // Bail on hasError rather than risk seeding duplicate job factors on top
    // of criteria that may already exist server-side.
    if (hasError) {
      failImport()
      return
    }
    try {
      await seedDefaultJobFactorsIfEmpty()
    } catch {
      failImport()
      return
    }
    goToScreen?.(MANUAL_ENTRY_NEXT_SCREEN_ID)
  }

  // Footer "Halda áfram" mirrors manual entry — except once an Excel import
  // has succeeded, in which case it shortcuts to the analysis screen instead,
  // matching the in-panel continue button (see handleContinueToAnalysis).
  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      if (importSucceededRef.current) {
        goToScreen?.(ANALYSIS_SCREEN_ID)
        // BeforeSubmitCallback's type requires a string alongside `false` —
        // Screen.tsx only surfaces it as a visible error when truthy, so an
        // empty string cancels the default submit without showing anything.
        return [false, '']
      }
      if (hasError) {
        return [false, formatMessage(messages.errors.draftLoadFailed)]
      }
      try {
        await seedDefaultJobFactorsIfEmpty()
      } catch {
        return [false, formatMessage(messages.errors.draftSyncFailed)]
      }
      return [true, null]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBeforeSubmitCallback, content, hasError])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  return (
    <Box>
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
          {importStatus === 'error' && (
            <AlertMessage
              type="error"
              title={formatMessage(m.importErrorTitle)}
              message={
                importErrorMessages && importErrorMessages.length > 1 ? (
                  <BulletList>
                    {importErrorMessages.map((message, index) => (
                      <Bullet key={index}>{message}</Bullet>
                    ))}
                  </BulletList>
                ) : (
                  importErrorMessages?.[0] ?? formatMessage(m.importError)
                )
              }
            />
          )}
          <InputFileUpload
            name="excelWorkbookUpload"
            files={selectedFile ? [selectedFile] : []}
            title={formatMessage(m.uploadCardTitle)}
            description={formatMessage(m.uploadCardIntro)}
            buttonLabel={formatMessage(m.uploadButtonLabel)}
            accept=".xlsx"
            multiple={false}
            onChange={handleFilesChanged}
            onRemove={() => setSelectedFile(null)}
            onUploadRejection={handleUploadRejection}
            errorMessage={uploadRejectionMessage}
          />
          {importStatus === 'success' && (
            <AlertMessage
              type="success"
              message={formatMessage(m.importSuccess)}
            />
          )}
          {importStatus !== 'success' && (
            <ActionCard
              backgroundColor="white"
              heading={formatMessage(m.manualEntryCardTitle)}
              headingVariant="h4"
              text={formatMessage(m.manualEntryCardIntro)}
              cta={{
                label: formatMessage(m.manualEntryButtonLabel),
                variant: 'ghost',
                icon: 'arrowForward',
                onClick: () => void handleManualEntry(),
              }}
            />
          )}
          <Text variant="small" color="dark400">
            {formatMessage(
              messages.report.dataEntry.excelTemplateDownloadDescription,
            )}
          </Text>
        </Stack>
      )}
    </Box>
  )
}
