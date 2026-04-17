import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Button, Icon, Link } from '@island.is/island-ui/core'
import { useIsomorphicLayoutEffect } from '@island.is/web/hooks/useScrollPosition/useIsomorphicLayoutEffect'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './DesktopNav.css'
import {
  HEADER_NAV_KEYS,
  HEADER_NAV_MAX_ITEMS,
  HEADER_NAV_MOCK_DATA,
  type HeaderNavKey,
} from './headerNavData'

interface DesktopNavProps {
  onOpenChange?: (isOpen: boolean) => void
}

type DropdownKey = HeaderNavKey

const FULL_WIDTH_BREAKPOINT = 1100

export const DesktopNav = ({ onOpenChange }: DesktopNavProps = {}) => {
  const { activeLocale } = useI18n()
  const router = useRouter()
  const [openKey, setOpenKey] = useState<DropdownKey | null>(null)
  // Sticks to the last non-null openKey so the dropdown's CONTENT stays
  // rendered during the fade-out transition. Without this, closing the
  // dropdown would unmount the title/list instantly while the container
  // was still fading to opacity 0.
  const [displayKey, setDisplayKey] = useState<DropdownKey | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const [fullWidthOffsets, setFullWidthOffsets] = useState<{
    left: number
    right: number
  } | null>(null)

  useEffect(() => {
    onOpenChange?.(openKey !== null)
  }, [openKey, onOpenChange])

  useEffect(() => {
    if (openKey) setDisplayKey(openKey)
  }, [openKey])

  const close = useCallback(() => setOpenKey(null), [])

  useEffect(() => {
    if (!openKey) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && containerRef.current && !containerRef.current.contains(target)) {
        close()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [openKey, close])

  useEffect(() => {
    const handle = () => close()
    router.events.on('routeChangeStart', handle)
    return () => {
      router.events.off('routeChangeStart', handle)
    }
  }, [router.events, close])

  // When the viewport is below FULL_WIDTH_BREAKPOINT we want the dropdown
  // to span from viewport edge to viewport edge. Measure the dropdown's
  // actual positioning ancestor (offsetParent) — which may be <header>, a
  // GridContainer descendant, or something else depending on the ambient
  // CSS — and push left/right out to the viewport edges accordingly.
  //
  // useIsomorphicLayoutEffect runs synchronously before paint on the client,
  // so the inline offsets are in place on the first visible frame. Without
  // this, a regular useEffect paints the dropdown at its unadjusted position
  // for one frame before we correct it — visible as a jump on slow machines.
  useIsomorphicLayoutEffect(() => {
    if (!openKey) {
      setFullWidthOffsets(null)
      return
    }
    const update = () => {
      if (!dropdownRef.current) return
      if (window.innerWidth >= FULL_WIDTH_BREAKPOINT) {
        setFullWidthOffsets(null)
        return
      }
      const parent = dropdownRef.current.offsetParent as HTMLElement | null
      if (!parent) return
      const pRect = parent.getBoundingClientRect()
      setFullWidthOffsets({
        left: -pRect.left,
        right: pRect.right - window.innerWidth,
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
    }
  }, [openKey])

  const toggle = (key: DropdownKey) => {
    setOpenKey((current) => (current === key ? null : key))
  }

  // Render content from displayKey (sticky across fade-out), not openKey.
  const active = displayKey ? HEADER_NAV_MOCK_DATA[displayKey] : null
  const panelId = `desktop-nav-panel-${reactId}`

  return (
    <Box ref={containerRef} className={styles.nav}>
      {HEADER_NAV_KEYS.map((key) => {
        const data = HEADER_NAV_MOCK_DATA[key]
        const isOpen = openKey === key
        const buttonId = `desktop-nav-tab-${reactId}-${key}`
        return (
          <button
            key={key}
            id={buttonId}
            type="button"
            className={`${styles.tabButton} ${isOpen ? styles.tabButtonActive : ''}`}
            aria-expanded={isOpen}
            aria-controls={isOpen ? panelId : undefined}
            aria-haspopup="true"
            data-desktop-nav-open={isOpen ? 'true' : undefined}
            onClick={() => toggle(key)}
          >
            {data.label}
            <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
              <Icon icon="chevronDown" size="small" />
            </span>
          </button>
        )
      })}

      <div
        ref={dropdownRef}
        id={panelId}
        role="region"
        aria-labelledby={
          openKey ? `desktop-nav-tab-${reactId}-${openKey}` : undefined
        }
        aria-hidden={!openKey}
        className={`${styles.dropdown} ${openKey ? styles.dropdownOpen : ''}`}
        style={
          fullWidthOffsets
            ? {
                left: `${fullWidthOffsets.left}px`,
                right: `${fullWidthOffsets.right}px`,
                width: 'auto',
                maxWidth: 'none',
              }
            : undefined
        }
      >
        {active && (
          <>
            <div className={styles.dropdownTitle}>{active.title}</div>
            <ul className={styles.dropdownList}>
              {active.items.slice(0, HEADER_NAV_MAX_ITEMS).map((item) => (
                <li key={item.href}>
                  <Link
                    href={
                      activeLocale === 'en' && !item.href.startsWith('/en')
                        ? `/en${item.href}`
                        : item.href
                    }
                    className={styles.dropdownLink}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Box className={styles.seeAllRow}>
              <Link
                href={
                  activeLocale === 'en' && !active.seeAllHref.startsWith('/en')
                    ? `/en${active.seeAllHref}`
                    : active.seeAllHref
                }
              >
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  variant="text"
                  size="small"
                  as="span"
                >
                  {active.seeAllLabel}
                </Button>
              </Link>
            </Box>
          </>
        )}
      </div>
    </Box>
  )
}

export default DesktopNav
