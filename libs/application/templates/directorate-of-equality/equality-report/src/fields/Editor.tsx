import { HTMLEditor } from '../components/html-editor/HTMLEditor'
import { HTMLText } from '@dmr.is/regulations-tools/types'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Button, DropdownMenu, toast } from '@island.is/island-ui/core'
import { messages } from '../lib/messages'
import { useIntl } from 'react-intl'
import { useRef, useState } from 'react'
import mammoth from 'mammoth'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'

export const Editor = ({ application, errors }: FieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { locale } = useLocale()
  const { setValue, clearErrors } = useFormContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [loadingDocx, setLoadingDocx] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const [editorHtml, setEditorHtml] = useState<HTMLText | null>(null)

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const handleChange = (val: HTMLText) => {
    const base64 = Buffer.from(val).toString('base64')
    setValue('goalsAndActions.customField', base64)
  }

  const handleBlur = (val: HTMLText) => {
    const base64 = Buffer.from(val).toString('base64')
    setValue('goalsAndActions.customField', base64, { shouldValidate: true })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''

    try {
      let html = ''

      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        html = result.value
      } else if (file.name.endsWith('.txt')) {
        const text = await file.text()
        html = text
          .split(/\n\n+/)
          .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
          .join('')
      } else {
        toast.error(
          formatMessage(
            messages.equalityReport.information.editorUnsupportedFile,
          ),
        )
        return
      }

      const base64 = Buffer.from(html).toString('base64')
      setValue('goalsAndActions.customField', base64)
      clearErrors('goalsAndActions.customField')
      setEditorHtml(html as HTMLText)
      setEditorKey((k) => k + 1)
    } catch {
      toast.error(
        formatMessage(messages.equalityReport.information.editorUploadError),
      )
    }
  }

  const handleFetchTemplateHtml = async () => {
    setLoadingTemplate(true)
    try {
      const res = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              { actionId: 'getEqualityReportTemplateHtml', order: 0 },
            ],
          },
          locale,
        },
      })

      const html =
        res.data?.updateApplicationExternalData?.externalData
          ?.equalityReportTemplateHtml?.data

      if (typeof html === 'string') {
        const base64 = Buffer.from(html).toString('base64')
        setValue('goalsAndActions.customField', base64)
        clearErrors('goalsAndActions.customField')
        setEditorHtml(html as HTMLText)
        setEditorKey((k) => k + 1)
      } else {
        toast.error(
          formatMessage(messages.equalityReport.information.editorUploadError),
        )
      }
    } catch {
      toast.error(
        formatMessage(messages.equalityReport.information.editorUploadError),
      )
    } finally {
      setLoadingTemplate(false)
    }
  }

  const handleDownloadTemplateDocx = async () => {
    setLoadingDocx(true)
    try {
      const res = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              { actionId: 'getEqualityReportTemplateDocx', order: 0 },
            ],
          },
          locale,
        },
      })

      const base64 =
        res.data?.updateApplicationExternalData?.externalData
          ?.equalityReportTemplateDocx?.data?.base64

      if (typeof base64 === 'string') {
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        const blob = new Blob([bytes], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'jafnrettisaaetlun-snidmat.docx'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 100)
      } else {
        toast.error(
          formatMessage(messages.equalityReport.information.editorUploadError),
        )
      }
    } catch {
      toast.error(
        formatMessage(messages.equalityReport.information.editorUploadError),
      )
    } finally {
      setLoadingDocx(false)
    }
  }

  const base64 =
    getValueViaPath<string>(
      application.answers,
      'goalsAndActions.customField',
    ) ?? ''

  const defaultHtml =
    editorHtml ?? (Buffer.from(base64, 'base64').toString('utf-8') as HTMLText)

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <HTMLEditor
        key={editorKey}
        title={formatMessage(messages.equalityReport.information.editorTitle)}
        error={errors && getErrorViaPath(errors, 'goalsAndActions.customField')}
        value={defaultHtml}
        onChange={handleChange}
        onBlur={handleBlur}
        fileUploader={() => Promise.resolve({} as unknown)}
        buttonGroup={[
          <Button
            variant="utility"
            size="small"
            icon="download"
            iconType="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            {formatMessage(
              messages.equalityReport.information.editorUploadFile,
            )}
          </Button>,
          <DropdownMenu
            icon="attach"
            iconType="outline"
            title={formatMessage(
              messages.equalityReport.information.editorFetchTemplate,
            )}
            disabled={loadingTemplate || loadingDocx}
            loading={loadingTemplate || loadingDocx}
            items={[
              {
                title: formatMessage(
                  messages.equalityReport.information.editorFetchTemplateDoc,
                ),
                onClick: (e) => {
                  e.preventDefault()
                  handleDownloadTemplateDocx()
                },
              },
              {
                title: formatMessage(
                  messages.equalityReport.information.editorFetchTemplateFill,
                ),
                onClick: (e) => {
                  e.preventDefault()
                  handleFetchTemplateHtml()
                },
              },
            ]}
          />,
        ]}
      />
    </>
  )
}

export default Editor
