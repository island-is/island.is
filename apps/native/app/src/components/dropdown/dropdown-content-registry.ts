import { ReactNode } from 'react'

const contentMap = new Map<string, ReactNode>()

export function setDropdownContent(contentId: string, content: ReactNode) {
  contentMap.set(contentId, content)
}

export function getDropdownContent(contentId: string): ReactNode | undefined {
  return contentMap.get(contentId)
}

export function clearDropdownContent(contentId: string) {
  contentMap.delete(contentId)
}
