import HtmlParser from 'react-html-parser'
import sanitizeHtml from 'sanitize-html'

export const renderInformationText = (text: string) =>
  HtmlParser(
    sanitizeHtml(text, {
      allowedTags: ['em', 'strong'],
      allowedAttributes: {},
    }),
    {
      preprocessNodes: (nodes) => {
        const preserveWhitespace = (node: typeof nodes[number]) => {
          if (
            node.type === 'text' &&
            node.data?.includes('\n') &&
            node.data.trim() === ''
          ) {
            node.type = 'tag'
            node.name = 'span'
          }
          node.children?.forEach(preserveWhitespace)
        }
        nodes.forEach(preserveWhitespace)
        return nodes
      },
      transform: (node, index) => {
        if (node.type === 'tag' && node.name === 'span') {
          return <span key={index}>{node.data}</span>
        }
      },
    },
  )
