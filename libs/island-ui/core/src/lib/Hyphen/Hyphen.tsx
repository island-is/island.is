import React, { useMemo } from 'react'
import ReactHtmlParser from 'react-html-parser'
import Hypher from 'hypher'
import is from './patterns/is'
import en from './patterns/en'

type Locale = 'is' | 'en'

type HyphenateText = (
  content: string,
  options: { minLeft?: number; minRight?: number; locale?: Locale },
) => string

// TODO: import patterns dynamically
const hyphenateText: HyphenateText = (
  content,
  { minLeft, minRight, locale = 'is' },
) => {
  if (minLeft) {
    is.leftmin = minLeft
  }
  if (minRight) {
    is.leftmin = minRight
  }
  const h = new Hypher(locale === 'is' ? is : en)
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
  locale?: Locale
}

export const Hyphen = ({
  children,
  minRight = 4,
  minLeft = 4,
  locale = 'is',
}: HyphenProps) => {
  const text = useMemo(
    () => hyphenateText(children, { minRight, minLeft, locale }),
    [minRight, minLeft, children],
  )
  return <>{ReactHtmlParser(text)}</>
}

export default Hyphen
