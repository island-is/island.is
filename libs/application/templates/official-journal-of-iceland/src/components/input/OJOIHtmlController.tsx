import { HTMLText } from '@island.is/regulations'
import { Editor, EditorFileUploader } from '@island.is/regulations-tools/Editor'
import { useRef } from 'react'
import { classes, editorWrapper } from '../htmlEditor/HTMLEditor.css'
import { baseConfig } from '../htmlEditor/config/baseConfig'
import { Box } from '@island.is/island-ui/core'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'
import debounce from 'lodash/debounce'
import { DEBOUNCE_INPUT_TIMER } from '../../lib/constants'

type Props = {
  applicationId: string
  name: string
  defaultValue?: string
  onChange?: (value: HTMLText) => void
}

export const OJOIHtmlController = ({
  applicationId,
  name,
  onChange,
  defaultValue,
}: Props) => {
  const { updateApplication, application } = useApplication({ applicationId })

  const valueRef = useRef(() => defaultValue as HTMLText)

  const fileUploader = (): EditorFileUploader => async (blob) => {
    throw new Error('Not implemented')
  }

  const handleChange = (value: HTMLText) => {
    const currentAnswers = structuredClone(application.answers)
    const newAnswers = set(currentAnswers, name, value)

    updateApplication(newAnswers)

    onChange && onChange(value)
  }

  const debouncedHandleChange = debounce(handleChange, DEBOUNCE_INPUT_TIMER)
  const onChangeHandler = () => {
    debouncedHandleChange.cancel()
    debouncedHandleChange(valueRef.current())
  }

  return (
    <Box
      className={editorWrapper({
        error: false,
      })}
    >
      <Editor
        config={baseConfig}
        classes={classes}
        fileUploader={fileUploader}
        valueRef={valueRef}
        onChange={onChangeHandler}
        onBlur={onChangeHandler}
      />
    </Box>
  )
}
