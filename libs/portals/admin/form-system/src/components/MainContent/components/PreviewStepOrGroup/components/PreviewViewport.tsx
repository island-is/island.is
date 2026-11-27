import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import * as styles from '../PreviewStepOrGroup.css'

interface Props {
  children: ReactNode
  mobile: boolean
  title: string
  lang: string
}

export const PreviewViewport = ({ children, mobile, title, lang }: Props) => {
  const [frameDocument, setFrameDocument] = useState<Document | null>(null)

  useEffect(() => {
    if (!frameDocument) return

    const source = document
    const base = frameDocument.createElement('base')
    base.href = source.baseURI
    frameDocument.head.appendChild(base)
    frameDocument.documentElement.className = source.documentElement.className
    frameDocument.body.className = source.body.className
    frameDocument.body.style.margin = '0'
    let styleNodes: Node[] = []

    const syncStyles = () => {
      styleNodes.forEach((node) => node.parentNode?.removeChild(node))
      styleNodes = Array.from(
        source.head.querySelectorAll('style, link[rel="stylesheet"]'),
        (node) => node.cloneNode(true),
      )
      frameDocument.head.append(...styleNodes)
    }

    syncStyles()
    const observer = new MutationObserver(syncStyles)
    observer.observe(source.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    })

    return () => {
      observer.disconnect()
      styleNodes.forEach((node) => node.parentNode?.removeChild(node))
      base.remove()
    }
  }, [frameDocument])

  useEffect(() => {
    if (frameDocument) frameDocument.documentElement.lang = lang
  }, [frameDocument, lang])

  return (
    <div className={styles.viewportContainer}>
      <iframe
        title={title}
        className={mobile ? styles.mobileViewport : styles.viewport}
        srcDoc="<!DOCTYPE html><html><head></head><body></body></html>"
        onLoad={(event) =>
          setFrameDocument(event.currentTarget.contentDocument)
        }
      />
      {frameDocument && createPortal(children, frameDocument.body)}
    </div>
  )
}
