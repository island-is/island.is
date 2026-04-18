import React, { useMemo } from 'react'
import { Locale } from '@island.is/shared/types'

import Hypher from 'hypher'

import is from './patterns/is'
import en from './patterns/en'

type HyphenateText = (
  content: string,
  options: { minLeft?: number; minRight?: number; locale?: Locale },
) => string

// TODO: import patterns dynamically
export const hyphenateText: HyphenateText = (
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
  const softHyphen = '\u00AD'
  return content?.split(' ').reduce((text, word) => {
    const hyphenedWord = h.hyphenate(word).join(softHyphen)
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
  return <>{text}</>
}

export default Hyphen
