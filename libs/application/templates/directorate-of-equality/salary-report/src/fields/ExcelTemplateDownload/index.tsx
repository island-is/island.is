import { getValueViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION, UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, LoadingDots } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMutation } from '@apollo/client'
import { FC, useRef, useState } from 'react'
import { messages } from '../../lib/messages'

export const ExcelTemplateDownload: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const [isImporting, setIsImporting] = useState(false)
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
    try {
      const base64 = await fileToBase64(file)

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

      await updateApplicationExternalData({
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
    } finally {
      setIsImporting(false)
    }
  }

  return (
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
  )
}
