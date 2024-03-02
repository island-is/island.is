import React from 'react'
import { RenderElementProps } from 'slate-react'

export const Element = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  switch (element.type) {
    case 'link':
      return (
        <a href={(element as { url?: string }).url} {...attributes}>
          {children}
        </a>
      )

    case 'heading_two':
      return <h2 {...attributes}>{children}</h2>

    case 'heading_three':
      return <h3 {...attributes}>{children}</h3>

    case 'heading_four':
      return <h4 {...attributes}>{children}</h4>

    case 'ul_list':
      return <ul {...attributes}>{children}</ul>

    case 'ol_list':
      return <ol {...attributes}>{children}</ol>

    case 'list_item':
      return <li {...attributes}>{children}</li>

    case 'paragraph':
      return <p {...attributes}>{children}</p>

    default:
      return <span {...attributes}>{children}</span>
  }
}
