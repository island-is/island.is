import React, { useMemo } from 'react'
import ReactHtmlParser from 'react-html-parser'
import Hypher from 'hypher'
import { is } from './patterns'

type HypenateText = (
  content: string,
  options: { minLeft?: number; minRight?: number },
) => string

// TODO: support locale
const hypenateText: HypenateText = (content, { minLeft, minRight }) => {
  if (minLeft) {
    is.leftmin = minLeft
  }
  if (minRight) {
    is.leftmin = minRight
  }
  const h = new Hypher(is)
  return content.split(' ').reduce((text, word) => {
    const hyphenedWord = h.hyphenate(word).join('&shy;')
    text += ' ' + hyphenedWord
    return text
  }, '')
}

export interface HyphenProps {
  children: string
  minRight?: number
  minLeft?: number
}

export const Hyphen = ({
  children,
  minRight = 4,
  minLeft = 4,
}: HyphenProps) => {
  const text = useMemo(() => hypenateText(children, { minRight, minLeft }), [
    minRight,
    minLeft,
  ])
  return <>{ReactHtmlParser(text)}</>
}

export default Hyphen
