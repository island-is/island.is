const URL_REGEX =
  /(https?:\/\/[^\s<]+[^\s<.,:;!?'")\]]|www\.[^\s<]+[^\s<.,:;!?'")\]])/gi

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

    const url = match[0]
    parts.push({
      type: 'link',
      value: url,
      href: url.startsWith('www.') ? `https://${url}` : url,
    })

    lastIndex = match.index + url.length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return parts
}
