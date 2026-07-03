import sanitizeHtml from 'sanitize-html'

const RICH_TEXT_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'b', 'strong', 'i', 'em', 'span', 'br', 'ul', 'ol', 'li'],
  allowedAttributes: {
    p: ['style'],
    span: ['style'],
    li: ['style'],
  },
  allowedStyles: {
    p: {
      'padding-left': [/^\d+(?:\.\d+)?px$/],
    },
    span: {
      'background-color': [
        /^#[0-9a-fA-F]{3,8}$/,
        /^rgb\(\d+,\s*\d+,\s*\d+\)$/,
      ],
    },
    li: {
      'list-style-type': [/^none$/],
    },
  },
}

export const sanitizeRichTextHtml = (html: string): string =>
  sanitizeHtml(html, RICH_TEXT_SANITIZE_OPTIONS)
