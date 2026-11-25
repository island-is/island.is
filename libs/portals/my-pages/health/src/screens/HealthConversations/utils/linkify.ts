const LINK_REGEX =
  /\[([^\]|\n]+)\|((?:https?:\/\/|www\.)[^\s\]]+)\]|(https?:\/\/[^\s<]+[^\s<.,:;!?'")\]]|www\.[^\s<]+[^\s<.,:;!?'")\]])/gi

export interface LinkifiedTextPart {
  type: 'text' | 'link'
  value: string
  href?: string
}

const toHref = (url: string) => (/^www\./i.test(url) ? `https://${url}` : url)

export const linkifyText = (text: string): LinkifiedTextPart[] => {
  const parts: LinkifiedTextPart[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  LINK_REGEX.lastIndex = 0
  while ((match = LINK_REGEX.exec(text))) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }

    const [fullMatch, label, labelledUrl, url] = match
    parts.push(
      labelledUrl
        ? { type: 'link', value: label, href: toHref(labelledUrl) }
        : { type: 'link', value: url, href: toHref(url) },
    )

    lastIndex = match.index + fullMatch.length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return parts
}
