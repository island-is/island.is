// Health conversation message bodies arrive as free text with no markup, so any
// URL in them has to be detected before it can be rendered as a tappable link.
// Mirrors the my-pages implementation so both clients linkify the same way.
const URL_REGEX =
  /\[([^\]|\n]+)\|((?:https?:\/\/|www\.)[^\s\]]+)\]|(https?:\/\/[^\s<]+[^\s<.,:;!?'")\]]|www\.[^\s<]+[^\s<.,:;!?'")\]])/gi

export interface LinkifiedTextPart {
  type: 'text' | 'link'
  value: string
  href?: string
}

export const linkifyText = (text: string): LinkifiedTextPart[] => {
  const parts: LinkifiedTextPart[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  URL_REGEX.lastIndex = 0
  while ((match = URL_REGEX.exec(text))) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }

    const [fullMatch, label, labelledUrl, bareUrl] = match
    const url = labelledUrl ?? bareUrl
    parts.push({
      type: 'link',
      // `[label|url]` links render as their label.
      value: label ?? url,
      // Bare `www.` URLs have no scheme, so give them one — the in-app browser
      // can't open a schemeless link.
      href: /^www\./i.test(url) ? `https://${url}` : url,
    })

    lastIndex = match.index + fullMatch.length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return parts
}
