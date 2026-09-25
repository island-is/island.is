import HtmlParser from 'react-html-parser'
import sanitizeHtml from 'sanitize-html'

// Question labels come from external questionnaire authors, so only plain
// formatting survives. No iframes, scripts, styles, event handlers or media.
const sanitizeConfig: sanitizeHtml.IOptions = {
  allowedTags: [
    'a',
    'b',
    'br',
    'em',
    'i',
    'li',
    'ol',
    'p',
    'span',
    'strong',
    'sub',
    'sup',
    'u',
    'ul',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', {
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
  },
}

export const renderSanitizedHtml = (html?: string | null) =>
  HtmlParser(sanitizeHtml(html ?? '', sanitizeConfig))

const hasText = (html?: string | null) =>
  sanitizeHtml(html ?? '', { allowedTags: [], allowedAttributes: {} }).trim()
    .length > 0

// htmlLabel replaces label when present, but a hostile htmlLabel can sanitize
// down to nothing, so the fallback is decided on the sanitized text.
export const renderQuestionLabel = (
  htmlLabel?: string | null,
  label?: string | null,
) => renderSanitizedHtml(hasText(htmlLabel) ? htmlLabel : label)
