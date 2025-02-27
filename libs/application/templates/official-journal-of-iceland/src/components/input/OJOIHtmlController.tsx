import { HTMLText } from '@island.is/regulations'
import { Editor, EditorFileUploader } from '@island.is/regulations-tools/Editor'
import { useCallback, useEffect, useRef } from 'react'
import { classes, editorWrapper } from '../htmlEditor/HTMLEditor.css'
import { baseConfig } from '../htmlEditor/config/baseConfig'
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

  const valueRef = useRef(() =>
    defaultValue ? (defaultValue as HTMLText) : ('' as HTMLText),
  )

  const fileUploader = useFileUploader()

  const handleChange = (value: HTMLText) => {
    const currentAnswers = structuredClone(application.answers)
    const newAnswers = set(currentAnswers, name, value)

    onChange && onChange(value)
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
