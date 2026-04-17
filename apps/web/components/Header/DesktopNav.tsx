import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Button, Icon, Link } from '@island.is/island-ui/core'
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

export const DesktopNav = ({ onOpenChange }: DesktopNavProps = {}) => {
  const { activeLocale } = useI18n()
  const router = useRouter()
  const [openKey, setOpenKey] = useState<DropdownKey | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const reactId = useId()

  useEffect(() => {
    onOpenChange?.(openKey !== null)
  }, [openKey, onOpenChange])

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

  const toggle = (key: DropdownKey) => {
    setOpenKey((current) => (current === key ? null : key))
  }

  const active = openKey ? HEADER_NAV_MOCK_DATA[openKey] : null
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

      {active && openKey && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={`desktop-nav-tab-${reactId}-${openKey}`}
          className={styles.dropdown}
        >
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
        </div>
      )}
    </Box>
  )
}

export default DesktopNav
