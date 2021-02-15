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
        <a href={element.url as string} {...attributes}>
          {children}
        </a>
      )

    case 'heading_one':
      return <h1 {...attributes}>{children}</h1>

    case 'heading_two':
      return <h2 {...attributes}>{children}</h2>

    case 'ul_list':
      return <ul {...attributes}>{children}</ul>

    case 'ol_list':
      return <ol {...attributes}>{children}</ol>

    case 'list_item':
      return <li {...attributes}>{children}</li>

    case 'paragraph':
      // Warning: validateDOMNesting(...): <p> cannot appear as a descendant of <p>.
      return <p {...attributes}>{children}</p>

    default:
      return <span {...attributes}>{children}</span>
  }
}
