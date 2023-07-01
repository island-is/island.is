import React, { FC, KeyboardEvent } from 'react'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import { useSlate } from 'slate-react'

import { LIST_TYPES } from '../utils/constants'
import { Button } from './Button'

interface BlockButtonProps {
  format: string
  icon: string
}

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })

  return !!match
}

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && (n.type as any),
      ),
    split: true,
  })

  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list_item' : format,
  }

  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }

    Transforms.wrapNodes(editor, block)
  }
}

export const BlockButton: FC<React.PropsWithChildren<BlockButtonProps>> = ({
  format,
  icon,
}) => {
  const editor = useSlate()

  return (
    <Button
      icon={icon}
      active={isBlockActive(editor, format)}
      onMouseDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    />
  )
}
