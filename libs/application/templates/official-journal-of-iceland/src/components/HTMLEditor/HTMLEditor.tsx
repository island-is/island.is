import { HTMLText } from '@island.is/regulations'
import { Editor, EditorFileUploader } from '@island.is/regulations-tools/Editor'
import { useRef } from 'react'
import { Controller } from 'react-hook-form'
import { classes, editorWrapper, errorStyle } from './HTMLEditor.css'
import { Box } from '@island.is/island-ui/core'
type Props = {
  name: string
  defaultValue?: HTMLText
  config?: React.ComponentProps<typeof Editor>['config']
  error?: string
}

export const HTMLEditor = ({ name, defaultValue, config, error }: Props) => {
  const valueRef = useRef(() => defaultValue ?? '')

  const fileUploader = (): EditorFileUploader => async (blob) => {
    throw new Error('Not implemented')
  }

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange } }) => {
        return (
          <>
            <Box
              className={editorWrapper({
                error: !!error,
              })}
            >
              <Editor
                config={config}
                fileUploader={fileUploader}
                valueRef={valueRef}
                onChange={() => onChange(valueRef.current())}
                classes={classes}
                onBlur={() => onChange(valueRef.current())}
                onFocus={() => onChange(valueRef.current())}
              />
            </Box>
            {error && <div className={errorStyle}>{error}</div>}
          </>
        )
      }}
    />
  )
}
