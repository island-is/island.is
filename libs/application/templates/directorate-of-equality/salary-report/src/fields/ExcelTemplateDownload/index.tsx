import { getValueViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION, UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button, LoadingDots } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMutation } from '@apollo/client'
import { FC, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { ParsedCriterionDto } from '@island.is/clients/directorate-of-equality'
import { DEFAULT_JOB_FACTORS } from '../../lib/constants'
import { messages } from '../../lib/messages'

export const ExcelTemplateDownload: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const { setValue } = useFormContext()
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [updateApplicationExternalData] = useMutation(UPDATE_APPLICATION_EXTERNAL_DATA)

  const base64Template = getValueViaPath<string>(
    application.externalData,
    'blankExcelTemplate.data.base64',
  )
  const filename =
    getValueViaPath<string>(application.externalData, 'blankExcelTemplate.data.filename') ??
    'launagreining-sniðmát.xlsx'

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Template}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset so the same file can be re-selected if needed
    e.target.value = ''

    setIsImporting(true)
    setImportStatus(null)
    try {
      const base64 = await fileToBase64(file)

      // Store file temporarily so the server action can read it
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              dataEntry: {
                ...((application.answers.dataEntry as object) ?? {}),
                excelFile: base64,
              },
            },
          },
          locale,
        },
      })

      const result = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              { actionId: 'DirectorateOfEquality.parseSalaryReportWorkbook', order: 0 },
            ],
          },
          locale,
        },
      })

      if (result.data) {
        const parsedCriteria = (result.data.updateApplicationExternalData.externalData
          ?.parsedSalaryReport?.data?.criteria ?? []) as ParsedCriterionDto[]

        // Map parsed values onto the 4 fixed job factor slots, falling back to defaults
        const jobFactors = DEFAULT_JOB_FACTORS.map((defaultFactor) => {
          const parsed = parsedCriteria.find((c) => c.type === defaultFactor.type)
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

        // Remove the temporary file and write parsed criteria directly to answers
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { excelFile: _removed, ...dataEntryWithoutFile } = ((application.answers
          .dataEntry ?? {}) as Record<string, unknown>)

        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                ...application.answers,
                dataEntry: dataEntryWithoutFile,
                criteria: {
                  jobFactors,
                  personalFactors,
                },
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
        setValue('criteria.personalFactors', personalFactors, { shouldDirty: true })
        setImportStatus('success')
      } else {
        setImportStatus('error')
      }
    } catch {
      setImportStatus('error')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Box>
      <Box display="flex" columnGap={3} alignItems="center">
        {base64Template && (
          <Button variant="utility" icon="document" iconType="outline" onClick={handleDownload}>
            {formatMessage(messages.report.dataEntry.downloadTemplateButton)}
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          style={{ display: 'none' }}
          onChange={handleFileSelected}
        />
        {isImporting ? (
          <LoadingDots />
        ) : (
          <Button
            variant="utility"
            icon="attach"
            iconType="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            {formatMessage(messages.report.dataEntry.uploadButtonLabel)}
          </Button>
        )}
      </Box>
      {importStatus && (
        <Box marginTop={3}>
          <AlertMessage
            type={importStatus === 'success' ? 'success' : 'error'}
            message={formatMessage(
              importStatus === 'success'
                ? messages.report.dataEntry.importSuccess
                : messages.report.dataEntry.importError,
            )}
          />
        </Box>
      )}
    </Box>
  )
}
