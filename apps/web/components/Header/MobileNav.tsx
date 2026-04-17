import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  FocusableBox,
  Icon,
  Link,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { SearchInput } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './MobileNav.css'
import {
  HEADER_NAV_KEYS,
  HEADER_NAV_MAX_ITEMS,
  HEADER_NAV_MOCK_DATA,
  type HeaderNavKey,
} from './headerNavData'

interface MobileNavProps {
  organizationSearchFilter?: string
  searchPlaceholder?: string
  onOpenChange?: (isOpen: boolean) => void
}

export const MobileNav = ({
  organizationSearchFilter,
  searchPlaceholder,
  onOpenChange,
}: MobileNavProps) => {
  const { activeLocale, t } = useI18n()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [drilldownKey, setDrilldownKey] = useState<HeaderNavKey | null>(null)
  const [isPanelScrolled, setIsPanelScrolled] = useState(false)
  const reactId = useId()
  const panelId = `mobile-nav-panel-${reactId}`

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  useEffect(() => {
    if (!isOpen) return
    const hasScrollbar =
      window.innerWidth > document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (hasScrollbar) {
      document.documentElement.style.scrollbarGutter = 'stable'
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.scrollbarGutter = ''
    }
  }, [isOpen])

  // On close we only flip isOpen — drilldownKey and isPanelScrolled are
  // preserved so the current view stays rendered during the fade-out.
  // They get reset in `openPanel` instead, so the next open starts fresh.
  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const openPanel = useCallback(
    (focusSearch: boolean) => {
      // Scroll the page to the top before locking scroll so the header
      // (where the trigger button lives) is flush with the viewport top
      // and the fixed panel anchors seamlessly against the header bottom.
      window.scrollTo({ top: 0, left: 0 })
      // The panel stays mounted across open/close now, so explicitly reset
      // its internal scroll — previously a fresh mount did this for free.
      if (panelRef.current) panelRef.current.scrollTop = 0
      setIsOpen(true)
      setDrilldownKey(null)
      setIsPanelScrolled(false)
      if (focusSearch) {
        // Wait for the panel (and SearchInput) to mount before focusing.
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 100)
      }
    },
    [],
  )

  // Close on outside click / escape / route change.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (
        target &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        close()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isOpen, close])

  useEffect(() => {
    const handle = () => close()
    router.events.on('routeChangeStart', handle)
    return () => {
      router.events.off('routeChangeStart', handle)
    }
  }, [router.events, close])

  const drilldownSection = drilldownKey
    ? HEADER_NAV_MOCK_DATA[drilldownKey]
    : null

  const loginLabel = activeLocale === 'is' ? 'Mínar síður' : 'My Pages'
  const searchLabel = activeLocale === 'is' ? 'Leit' : 'Search'
  const menuLabel = activeLocale === 'is' ? 'Valmynd' : 'Menu'
  const backLabel = activeLocale === 'is' ? 'Til baka' : 'Back'

  return (
    <Box ref={containerRef} className={styles.headerButtons}>
      <FocusableBox href="/minarsidur/" className={styles.iconButton}>
        <Icon icon="person" type="outline" size="small" color="dark400" />
        <VisuallyHidden>{loginLabel}</VisuallyHidden>
      </FocusableBox>

      <button
        type="button"
        className={styles.iconButton}
        aria-label={searchLabel}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => openPanel(true)}
      >
        <Icon icon="search" type="outline" size="small" color="dark400" />
      </button>

      <button
        type="button"
        className={styles.valmyndButton}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-haspopup="true"
        onClick={() => {
          if (isOpen) {
            close()
          } else {
            openPanel(false)
          }
        }}
      >
        {menuLabel}
        <span
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        >
          <Icon
            icon={isOpen ? 'close' : 'menu'}
            type="outline"
            size="small"
            color="dark400"
          />
        </span>
      </button>

      <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-label={menuLabel}
          aria-hidden={!isOpen}
          className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
          onScroll={(event) =>
            setIsPanelScrolled(event.currentTarget.scrollTop > 10)
          }
        >
          <div
            aria-hidden="true"
            className={`${styles.scrollShadow} ${
              isPanelScrolled ? styles.scrollShadowVisible : ''
            }`}
          />
          <Box className={styles.searchWrapper}>
            <SearchInput
              ref={searchInputRef}
              id="mobile-nav-search"
              size="medium"
              activeLocale={activeLocale}
              placeholder={searchPlaceholder ?? t.searchPlaceholder}
              autocomplete={true}
              autosuggest={true}
              organization={organizationSearchFilter}
            />
          </Box>

          {drilldownSection ? (
            <>
              <Box className={styles.panelHeader}>
                <button
                  type="button"
                  className={styles.backButton}
                  aria-label={backLabel}
                  onClick={() => setDrilldownKey(null)}
                >
                  <Icon
                    icon="arrowBack"
                    type="outline"
                    size="small"
                    color="dark400"
                  />
                </button>
                <h2 className={styles.panelTitle}>{drilldownSection.label}</h2>
              </Box>
              <ul className={styles.panelList}>
                {drilldownSection.items
                  .slice(0, HEADER_NAV_MAX_ITEMS)
                  .map((item) => (
                    <li key={item.href}>
                      <Link
                        href={
                          activeLocale === 'en' && !item.href.startsWith('/en')
                            ? `/en${item.href}`
                            : item.href
                        }
                        className={styles.drillLink}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
              <Box className={styles.seeAllRow}>
                <Link
                  href={
                    activeLocale === 'en' &&
                    !drilldownSection.seeAllHref.startsWith('/en')
                      ? `/en${drilldownSection.seeAllHref}`
                      : drilldownSection.seeAllHref
                  }
                >
                  <Button
                    icon="arrowForward"
                    iconType="filled"
                    variant="text"
                    size="small"
                    as="span"
                  >
                    {drilldownSection.seeAllLabel}
                  </Button>
                </Link>
              </Box>
            </>
          ) : (
            <ul className={styles.panelList}>
              {HEADER_NAV_KEYS.map((key) => {
                const section = HEADER_NAV_MOCK_DATA[key]
                return (
                  <li key={key}>
                    <button
                      type="button"
                      className={styles.drillRow}
                      onClick={() => setDrilldownKey(key)}
                    >
                      <span className={styles.drillRowLabel}>
                        {section.label}
                      </span>
                      <Icon
                        icon="chevronForward"
                        type="outline"
                        size="small"
                        color="dark400"
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
    </Box>
  )
}

export default MobileNav
