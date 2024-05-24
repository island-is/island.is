export const groupElementsByArticleTitleFromDiv = (
  div: HTMLDivElement,
): HTMLElement[][] => {
  const result: HTMLElement[][] = []
  let currentGroup: HTMLElement[] = []

  Array.from(div.children).forEach((child) => {
    const element = child as HTMLElement
    if (
      element.classList.contains('article__title')
    ) {
      if (currentGroup.length > 0) {
        result.push(currentGroup)
      }
      currentGroup = [element]
    } else {
      currentGroup.push(element)
    }
  })

  if (currentGroup.length > 0) {
    result.push(currentGroup)
  }

  return result
}
