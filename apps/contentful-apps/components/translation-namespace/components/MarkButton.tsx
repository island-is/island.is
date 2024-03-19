import React, { FC, KeyboardEvent } from 'react'
import { Editor } from 'slate'
import { useSlate } from 'slate-react'

import { Button } from './Button'

interface MarkButtonProps {
  format: string
  icon: string
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor)

  return marks ? marks[format] === true : false
}

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const MarkButton: FC<React.PropsWithChildren<MarkButtonProps>> = ({
  format,
  icon,
}) => {
  const editor = useSlate()

  return (
    <Button
      icon={icon}
      active={isMarkActive(editor, format)}
      onMouseDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    />
  )
}
