export const isSingleParagraph = (htmlString: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const bodyChildren = Array.from(doc.body.children)

  return (
    bodyChildren.length === 1 && bodyChildren[0].tagName.toLowerCase() === 'p'
  )
}
