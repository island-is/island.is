import { HTMLText } from '@island.is/regulations'
import { Editor } from '@dmr.is/regulations-tools/Editor'
import { useRef } from 'react'
import { classes, editorWrapper } from '../htmlEditor/HTMLEditor.css'
import { Box } from '@island.is/island-ui/core'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'
import { useApplicationAssetUploader } from '../../hooks/useAssetUpload'

type Props = {
  applicationId: string
  name: string
  defaultValue?: string
  onChange?: (value: HTMLText) => void
  editorKey?: string
}

export const OJOIHtmlController = ({
  applicationId,
  name,
  onChange,
  defaultValue,
  editorKey,
}: Props) => {
  const { debouncedOnUpdateApplicationHandler, application } = useApplication({
    applicationId,
  })

  const { useFileUploader } = useApplicationAssetUploader({ applicationId })

  const valueRef = useRef(() => {
    const defaultHtml = Buffer.from(defaultValue || '', 'base64').toString(
      'utf-8',
    )

    return defaultHtml as HTMLText
  })

  const fileUploader = useFileUploader()

  const handleChange = (value: HTMLText) => {
    // convert incoming html to base64
    const base64 = Buffer.from(value).toString('base64')

    const currentAnswers = structuredClone(application.answers)
    const newAnswers = set(currentAnswers, name, base64)

    onChange && onChange(base64 as HTMLText)
    return newAnswers
  }

  const onChangeHandler = () => {
    return handleChange(valueRef.current())
  }

  return (
    <Box
      className={editorWrapper({
        error: false,
      })}
    >
      <Editor
        key={editorKey}
        classes={classes}
        fileUploader={fileUploader()}
        valueRef={valueRef}
        onChange={() => {
          // add little bit of delay for valueRef to update
          setTimeout(
            () => debouncedOnUpdateApplicationHandler(onChangeHandler()),
            100,
          )
        }}
        onBlur={() => debouncedOnUpdateApplicationHandler(onChangeHandler())}
      />
    </Box>
  )
}
