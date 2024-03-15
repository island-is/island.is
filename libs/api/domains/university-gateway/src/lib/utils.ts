import sanitizeHtml from 'sanitize-html'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'

export const convertHtmlToContentfulRichText = async (
  html: string,
  id?: string,
) => {
  const sanitizedHtml = sanitizeHtml(html)
  const markdown = NodeHtmlMarkdown.translate(sanitizedHtml)
  const richText = await richTextFromMarkdown(markdown)

  return {
    __typename: 'Html',
    document: richText,
    id,
  }
}
