import { HTMLText } from '@island.is/regulations'
import { Editor, EditorFileUploader } from '@island.is/regulations-tools/Editor'
import { useEffect, useRef } from 'react'
import { Controller } from 'react-hook-form'
import { classes, editorWrapper, errorStyle } from './HTMLEditor.css'
import { Box, Text } from '@island.is/island-ui/core'
type Props = {
  title?: string
  name: string
  value: HTMLText
  config?: React.ComponentProps<typeof Editor>['config']
  hideWarnings?: boolean
  onChange?: (value: HTMLText) => void
  error?: string
  readOnly?: boolean
}

export const HTMLEditor = ({
  title,
  name,
  value,
  config,
  error,
  onChange,
  hideWarnings,
  readOnly = false,
}: Props) => {
  const valueRef = useRef(() => value)
  const editorRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (value !== valueRef.current()) {
      valueRef.current = () => value
      if (editorRef.current) {
        editorRef.current.innerHTML = value
      }
    }
  }, [value])

  const fileUploader = (): EditorFileUploader => async (blob) => {
    throw new Error('Not implemented')
  }

  return (
    <Controller
      name={name}
      defaultValue={valueRef.current()}
      render={({ field: { onChange: updateFormValue } }) => {
        return (
          <>
            {title && (
              <Text marginBottom={2} variant="h5">
                {title}
              </Text>
            )}
            <Box
              className={editorWrapper({
                error: !!error,
              })}
            >
              <Editor
                hideWarnings={hideWarnings}
                disabled={readOnly}
                elmRef={editorRef}
                config={config}
                fileUploader={fileUploader}
                valueRef={valueRef}
                classes={classes}
                onBlur={() => {
                  updateFormValue(valueRef.current())
                  onChange && onChange(valueRef.current())
                }}
              />
            </Box>
            {error && <div className={errorStyle}>{error}</div>}
          </>
        )
      }}
    />
  )
}
