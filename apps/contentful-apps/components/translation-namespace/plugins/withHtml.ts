import { Editor, Transforms } from 'slate'
import { jsx } from 'slate-hyperscript'

const ELEMENT_TAGS = {
  A: (el: HTMLElement) => ({ type: 'link', url: el.getAttribute('href') }),
  H1: () => ({ type: 'heading_one' }),
  H2: () => ({ type: 'heading_two' }),
  LI: () => ({ type: 'list_item' }),
  OL: () => ({ type: 'ol_list' }),
  P: () => ({ type: 'paragraph' }),
  UL: () => ({ type: 'ul_list' }),
}

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  STRONG: () => ({ bold: true }),
}

const deserialize = (el: any): any => {
  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  } else if (el.nodeName === 'BR') {
    return '\n'
  }

  const { nodeName } = el
  let parent = el

  if (
    nodeName === 'PRE' &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === 'CODE'
  ) {
    parent = el.childNodes[0]
  }
  const children = Array.from(parent.childNodes)
    .map(deserialize)
    .flat() as any[]

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children)
  }

  if (ELEMENT_TAGS[nodeName as keyof typeof ELEMENT_TAGS]) {
    const attrs = ELEMENT_TAGS[nodeName as keyof typeof ELEMENT_TAGS](el)
    return jsx('element', attrs, children)
  }

  if (TEXT_TAGS[nodeName as keyof typeof TEXT_TAGS]) {
    const attrs = TEXT_TAGS[nodeName as keyof typeof TEXT_TAGS]()
    return children.map((child) => jsx('text', attrs, child))
  }

  return children
}

/**
 * This plugin allow the copy/paste of HTML into the editor to keep the formatting to markdown
 */
export const withHtml = (editor: Editor) => {
  const { insertData, isInline, isVoid } = editor

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = (data) => {
    const html = data.getData('text/html')

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html')
      const fragment = deserialize(parsed.body)

      Transforms.insertFragment(editor, fragment)

      return
    }

    insertData(data)
  }

  return editor
}
