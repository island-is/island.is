import * as s from './RegulationDisplay.treat'

import { NamespaceGetter } from '@island.is/web/hooks'
import React, { useState, MouseEvent, useEffect } from 'react'
import type { IndexTree } from './useRegulationIndexer'
import { Button, Text, Box, Link } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

const SCROLL_OFFSET = 150
const scrollToElm = (id?: string): boolean => {
  const elm = id && document.getElementById(id)
  if (!elm || !id) {
    return false
  }
  const beforePos = window.pageYOffset
  document.location.hash = id
  window.scrollTo({ top: beforePos, behavior: 'auto' })
  const y = elm.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET
  window.scrollTo({ top: y, behavior: 'smooth' })
  return true
}

const handleIndexSmoothScroll = (e: MouseEvent<HTMLDivElement>) => {
  const target = e.target
  if (!(target instanceof HTMLAnchorElement)) {
    return
  }
  if (scrollToElm(target.hash.slice(1))) {
    e.preventDefault()
  }
}

// ---------------------------------------------------------------------------

const IndexList = (props: { items: IndexTree }) => (
  <ul className={s.indexList}>
    {props.items.map(({ title, id, type, subItems }, i) => (
      <li key={i} className={s.indexItem} data-type={type}>
        <a className={s.indexLink} href={'#' + id}>
          {title}
        </a>
        {subItems && subItems.length > 0 && <IndexList items={subItems} />}
      </li>
    ))}
  </ul>
)

// ---------------------------------------------------------------------------

export type RegulationIndexProps = {
  index: IndexTree
  txt: NamespaceGetter<
    Partial<
      Record<'indexLegend' | 'indexToggler_open' | 'indexToggler_close', string>
    >
  >
}

export const RegulationIndex = (props: RegulationIndexProps) => {
  const { index, txt } = props
  const [visible, setVisible] = useState(false)

  const { asPath } = useRouter()
  useEffect(() => {
    // Trick Next.js into scrolling to the desired element on page load
    const anchorId = asPath.split('#').pop()
    scrollToElm(anchorId)

    // While we're at it, temporarily increase `scroll-margin-top` on `<body/>`
    // to account for the sticky statusHeader element
    const scrollMarginTop = 'scrollMarginTop' as 'height'
    document.body.style[scrollMarginTop] = SCROLL_OFFSET + 'px'
    return () => {
      // @ts-expect-error  (silly TypeScript doesn't allow resetting style properties)
      document.body.style[scrollMarginTop] = null
    }
  }, [asPath])

  return (
    <div className={s.indexWrapper}>
      <div className={s.indexToggler}>
        <Button
          icon={visible ? 'remove' : 'add'}
          iconType="outline"
          size="small"
          type="button"
          variant="text"
          aria-controls="regulation-index"
          onClick={() => setVisible(!visible)}
        >
          {txt(visible ? 'indexToggler_close' : 'indexToggler_open')}
        </Button>
      </div>

      <Box
        className={s.index}
        paddingTop={2}
        paddingBottom={3}
        paddingLeft={[2, 4]}
        borderLeftWidth="standard"
        borderColor="blue200"
        id="regulation-index"
        hidden={!visible}
        onClick={handleIndexSmoothScroll}
      >
        <Text variant="h5" as="h2">
          {txt('indexLegend')}
        </Text>
        <IndexList items={index} />
      </Box>
    </div>
  )
}
