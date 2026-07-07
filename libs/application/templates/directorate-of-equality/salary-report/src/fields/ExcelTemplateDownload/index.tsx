import { getValueViaPath } from '@island.is/application/core'
import {
  UPDATE_APPLICATION,
  UPDATE_APPLICATION_EXTERNAL_DATA,
} from '@island.is/application/graphql'
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
import { useFormContext } from 'react-hook-form'
import type {
  ParsedCriterionDto,
  ParsedEmployeeDto,
  ParsedRoleDto,
} from '@island.is/clients/directorate-of-equality'
import {
  DEFAULT_CRITERIA_ANSWERS,
  DEFAULT_JOB_FACTORS,
  DEFAULT_SUB_CRITERION,
} from '../../lib/constants'
import { messages } from '../../lib/messages'

// The next screen in the flow — both upload and manual entry advance here.
const NEXT_SCREEN_ID = 'criteriaMultiField'

export const ExcelTemplateDownload: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, goToScreen, setBeforeSubmitCallback }) => {
  const { formatMessage, lang: locale } = useLocale()
  const { setValue } = useFormContext()
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(
    null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

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
      //    calls DMR's import endpoint with { key }.
      const result = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: 'DirectorateOfEquality.parseSalaryReportWorkbook',
                order: 0,
              },
            ],
          },
          locale,
        },
      })

      if (result.data) {
        const parsedCriteria = (result.data.updateApplicationExternalData
          .externalData?.parsedSalaryReport?.data?.criteria ??
          []) as ParsedCriterionDto[]

        // Map parsed values onto the 4 fixed job factor slots, falling back to defaults
        const jobFactors = DEFAULT_JOB_FACTORS.map((defaultFactor) => {
          const parsed = parsedCriteria.find(
            (c) => c.type === defaultFactor.type,
          )
          return parsed
            ? {
                type: parsed.type,
                title: parsed.title,
                description: parsed.description,
                weight: String(parsed.weight),
              }
            : defaultFactor
        })

        const personalFactors = parsedCriteria
          .filter((c) => c.type === 'PERSONAL')
          .map((c) => ({
            title: c.title,
            description: c.description,
            weight: String(c.weight),
          }))

        // parsedCriteria is a runtime cast of externalData — the nested arrays
        // aren't guaranteed, so guard each level and fall back to defaults so a
        // partial parse doesn't fail the whole import.
        const mapSubCriteria = (sc: ParsedCriterionDto['subCriteria'][0]) =>
          Array.isArray(sc?.steps)
            ? {
                title: sc.title,
                description: sc.description,
                weight: String(sc.weight),
                stepCount: String(sc.steps.length),
                steps: sc.steps.map((s) => ({ description: s.description })),
              }
            : { ...DEFAULT_SUB_CRITERION }

        const subCriteriaJobFactors = DEFAULT_JOB_FACTORS.map(
          (defaultFactor) => {
            const parsed = parsedCriteria.find(
              (c) => c.type === defaultFactor.type,
            )
            return parsed &&
              Array.isArray(parsed.subCriteria) &&
              parsed.subCriteria.length > 0
              ? parsed.subCriteria.map(mapSubCriteria)
              : [{ ...DEFAULT_SUB_CRITERION }]
          },
        )

        const subCriteriaPersonalFactors = parsedCriteria
          .filter((c) => c.type === 'PERSONAL')
          .map((c) =>
            Array.isArray(c.subCriteria) && c.subCriteria.length > 0
              ? c.subCriteria.map(mapSubCriteria)
              : [{ ...DEFAULT_SUB_CRITERION }],
          )

        // Employees are stored as the full parsed object (read-only on screen)
        const employees = (result.data.updateApplicationExternalData
          .externalData?.parsedSalaryReport?.data?.employees ??
          []) as ParsedEmployeeDto[]

        // Roles drive the "Flokkun starfa" screen — stored as the full object
        const roles = (result.data.updateApplicationExternalData.externalData
          ?.parsedSalaryReport?.data?.roles ?? []) as ParsedRoleDto[]

        // Write the parsed criteria directly to answers
        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                ...application.answers,
                criteria: {
                  jobFactors,
                  personalFactors,
                },
                subCriteria: {
                  jobFactors: subCriteriaJobFactors,
                  personalFactors: subCriteriaPersonalFactors,
                },
                employees,
                roles,
              },
            },
            locale,
          },
        })

        // Update form state immediately — Apollo cache update alone won't trigger
        // react-hook-form to re-display new values without a page refresh
        jobFactors.forEach((factor, i) => {
          setValue(`criteria.jobFactors.${i}.type`, factor.type)
          setValue(`criteria.jobFactors.${i}.title`, factor.title)
          setValue(`criteria.jobFactors.${i}.description`, factor.description)
          setValue(`criteria.jobFactors.${i}.weight`, factor.weight)
        })
        setValue('criteria.personalFactors', personalFactors, {
          shouldDirty: true,
        })

        // Also push the parsed sub-criteria into the form so they survive in
        // react-hook-form. The sub-criteria screen isn't mounted yet, but its
        // CriterionPanel seeds from the live form value first, so without this
        // the imported sub-criteria would only live in the backend/answers.
        setValue('subCriteria.jobFactors', subCriteriaJobFactors, {
          shouldDirty: true,
        })
        setValue('subCriteria.personalFactors', subCriteriaPersonalFactors, {
          shouldDirty: true,
        })
        setValue('employees', employees, { shouldDirty: true })
        setValue('roles', roles, { shouldDirty: true })
        setImportStatus('success')

        // Parsing succeeded — move straight on to the criteria screen.
        goToScreen?.(NEXT_SCREEN_ID)
      } else {
        setImportStatus('error')
      }
    } catch {
      setImportStatus('error')
    } finally {
      setIsImporting(false)
    }
  }

  // Seed the default job factors so the criteria screen starts populated
  // instead of empty. Only when there's no data yet — a prior import or manual
  // entry is left untouched.
  const seedDefaultCriteriaIfEmpty = async () => {
    const existingCriteria = getValueViaPath(application.answers, 'criteria')
    if (existingCriteria) return
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            criteria: DEFAULT_CRITERIA_ANSWERS,
          },
        },
        locale,
      },
    })
    setValue('criteria', DEFAULT_CRITERIA_ANSWERS)
  }

  // Manual entry mirrors "continue without a workbook": seed defaults and move on.
  const handleManualEntry = async () => {
    await seedDefaultCriteriaIfEmpty()
    goToScreen?.(NEXT_SCREEN_ID)
  }

  // Pressing the footer "Halda áfram" behaves the same as manual entry: if the
  // user has no data yet, seed the defaults before advancing; existing data
  // (imported or manually entered) is preserved.
  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      await seedDefaultCriteriaIfEmpty()
      return [true, null]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBeforeSubmitCallback, application.answers])

  const m = messages.report.dataEntry

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
            text={formatMessage(m.uploadCardDescription)}
            cta={{
              label: formatMessage(m.uploadButtonLabel),
              variant: 'primary',
              icon: 'attach',
              onClick: () => fileInputRef.current?.click(),
            }}
          />
          <ActionCard
            backgroundColor="white"
            heading={formatMessage(m.manualCardTitle)}
            text={formatMessage(m.manualCardDescription)}
            cta={{
              label: formatMessage(m.manualButtonLabel),
              variant: 'primary',
              icon: 'arrowForward',
              onClick: handleManualEntry,
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
