import { HTMLText } from '@island.is/regulations'
import { Editor, EditorFileUploader } from '@island.is/regulations-tools/Editor'
import { useEffect, useRef, useState } from 'react'
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
  controller?: boolean
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
  controller = true,
}: Props) => {
  const [initialValue, setInitalValue] = useState(value)
  const valueRef = useRef(() => value)
  const editorRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (readOnly && value !== valueRef.current()) {
      valueRef.current = () => value
      if (editorRef.current) {
        editorRef.current.innerHTML = value
      }
    }
  }, [value, readOnly])

  const fileUploader = (): EditorFileUploader => async (blob) => {
    throw new Error('Not implemented')
  }

  return controller ? (
    <Controller
      name={name}
      defaultValue={initialValue}
      render={({ field: { onChange: updateFormValue, value } }) => {
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
                readOnly={readOnly}
                hideWarnings={hideWarnings}
                disabled={readOnly}
                elmRef={editorRef}
                config={config}
                fileUploader={fileUploader}
                valueRef={valueRef}
                classes={classes}
                onChange={() => {
                  onChange && onChange(valueRef.current())
                }}
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
  ) : (
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
          readOnly={readOnly}
          hideWarnings={hideWarnings}
          elmRef={editorRef}
          config={config}
          fileUploader={fileUploader}
          valueRef={valueRef}
          classes={classes}
          onChange={() => {
            onChange && onChange(valueRef.current())
          }}
          onBlur={() => {
            onChange && onChange(valueRef.current())
          }}
        />
      </Box>
      {error && <div className={errorStyle}>{error}</div>}
    </>
  )
}
