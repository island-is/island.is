import { HTMLText } from '@island.is/regulations'
import { Editor, EditorFileUploader } from '@dmr.is/regulations-tools/Editor'
import { useRef } from 'react'
import { classes, editorWrapper, errorStyle } from './HTMLEditor.css'
import { Box, Text } from '@island.is/island-ui/core'
type Props = {
  title?: string
  value: HTMLText
  config?: React.ComponentProps<typeof Editor>['config']
  hideWarnings?: boolean
  onChange?: (value: HTMLText) => void
  onBlur?: (value: HTMLText) => void
  error?: string
  readOnly?: boolean
  fileUploader: EditorFileUploader
  buttonGroup?: React.ReactNode[]
}

export const HTMLEditor = ({
  title,
  value,
  config,
  error,
  onChange,
  onBlur,
  hideWarnings,
  readOnly = false,
  fileUploader,
  buttonGroup,
}: Props) => {
  const valueRef = useRef(() => value)
  const editorRef = useRef<HTMLElement>(null)

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="spaceBetween"
        marginBottom={2}
      >
        {title && <Text variant="h5">{title}</Text>}
        {buttonGroup && (
          <Box display="flex" flexDirection="row" rowGap={2}>
            {buttonGroup.map((button, index) => (
              <Box key={index} marginLeft={2}>
                {button}
              </Box>
            ))}
          </Box>
        )}
      </Box>
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
          onChange={() => onChange?.(valueRef.current())}
          onBlur={() => onBlur?.(valueRef.current())}
        />
      </Box>
      {error && <div className={errorStyle}>{error}</div>}
    </>
  )
}
