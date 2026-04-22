import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import { Box, Button, Icon, Link } from '@island.is/island-ui/core'
import { SearchInput } from '@island.is/web/components'
import { useIsomorphicLayoutEffect } from '@island.is/web/hooks/useScrollPosition/useIsomorphicLayoutEffect'
import { useI18n } from '@island.is/web/i18n'

import {
  HEADER_NAV_KEYS,
  HEADER_NAV_MAX_ITEMS,
  HEADER_NAV_MOCK_DATA,
  type HeaderNavData,
  type HeaderNavKey,
} from './headerNavData'
import { NAV_TRANSITION_DURATION_MS } from './headerNavTokens'
import * as styles from './MobileNav.css'

const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const focusPreviousTabbableIn = (
  container: HTMLElement,
  current: HTMLElement,
) => {
  const tabbable = Array.from(
    container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR),
  )
  const idx = tabbable.indexOf(current)
  if (idx > 0) tabbable[idx - 1].focus()
}

// Imperative handle exposed by MobileNavPanel so the separately-rendered
// Search and Menu buttons (which can sit anywhere in the header layout)
// can control the panel without shared state lifting.
export interface MobileNavPanelHandle {
  open: () => void
  close: () => void
  toggle: () => void
  openAndFocusSearch: () => void
}

interface MobileNavPanelProps {
  // Contentful-driven nav data. Falls back to HEADER_NAV_MOCK_DATA when
  // omitted so local dev and the initial render (before the query
  // resolves) still show a populated panel.
  data?: HeaderNavData
  organizationSearchFilter?: string
  searchPlaceholder?: string
  // Fires whenever the panel's open state changes — used by Header to
  // forward isOpen to MobileNavMenuButton (for the X/menu icon swap) and
  // to toggle the header shadow.
  onOpenChange?: (isOpen: boolean) => void
  // Buttons outside the panel that should NOT trigger the outside-click
  // close (they have their own onClick that toggles the panel). Typically
  // the Search and Menu buttons.
  triggerRefs?: React.RefObject<HTMLElement>[]
}

export const MobileNavPanel = forwardRef<
  MobileNavPanelHandle,
  MobileNavPanelProps
>(
  (
    {
      data,
      organizationSearchFilter,
      searchPlaceholder,
      onOpenChange,
      triggerRefs,
    },
    ref,
  ) => {
    const navData = data ?? HEADER_NAV_MOCK_DATA
    const { activeLocale, t } = useI18n()
    const router = useRouter()
    const panelRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    // Captures the "see all" Button DOM node so we can forward keyboard focus
    // from the wrapping Link to the Button — the Button has a much nicer
    // focus-visible state (mint fill + underline) that only triggers when the
    // Button itself is focused.
    const seeAllButtonRef = useRef<HTMLElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [drilldownKey, setDrilldownKey] = useState<HeaderNavKey | null>(null)
    const [isPanelScrolled, setIsPanelScrolled] = useState(false)
    // Tracks whether the panel is currently in its opacity fade window. The
    // top-mask div is only visible during this time so it can cover the
    // header shadow that would otherwise bleed through the translucent panel
    // top. Mirrors the pattern used by DesktopNav for its dropdown.
    const [isTransitioning, setIsTransitioning] = useState(false)
    const prevIsOpenRef = useRef(isOpen)
    const reactId = useId()
    const panelId = `mobile-nav-panel-${reactId}`

    // Use a layout effect so the parent's `isMobileNavOpen` (which drives
    // the header shadow) flips in the SAME paint as our `.panelOpen` class
    // flip. With a regular `useEffect`, the browser paints the panel's new
    // class first, then re-renders to apply the header shadow — a ~1-frame
    // gap that reads as the panel fading in ahead of the shadow.
    useIsomorphicLayoutEffect(() => {
      onOpenChange?.(isOpen)
    }, [isOpen, onOpenChange])

    // Same reasoning: `isTransitioning` drives the top-mask visibility, and
    // we want it to turn on in the same paint as the panel's fade starts.
    useIsomorphicLayoutEffect(() => {
      if (prevIsOpenRef.current === isOpen) return
      prevIsOpenRef.current = isOpen
      setIsTransitioning(true)
      const timer = setTimeout(
        () => setIsTransitioning(false),
        NAV_TRANSITION_DURATION_MS,
      )
      return () => clearTimeout(timer)
    }, [isOpen])

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

    const openPanel = useCallback((focusSearch: boolean) => {
      // Scroll the page to the top before locking scroll so the header
      // (where the trigger button lives) is flush with the viewport top
      // and the fixed panel anchors seamlessly against the header bottom.
      window.scrollTo({ top: 0, left: 0 })
      // The panel stays mounted across open/close, so explicitly reset its
      // internal scroll — previously a fresh mount did this for free.
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
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        open: () => openPanel(false),
        close,
        toggle: () => {
          if (isOpen) close()
          else openPanel(false)
        },
        openAndFocusSearch: () => openPanel(true),
      }),
      [openPanel, close, isOpen],
    )

    // Close on outside click / escape / route change.
    useEffect(() => {
      if (!isOpen) return
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') close()
      }
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null
        if (!target) return
        if (panelRef.current?.contains(target)) return
        // Clicks on registered trigger buttons are their own concern — they
        // have onClick handlers that toggle the panel, so we must NOT double
        // up by closing here.
        for (const triggerRef of triggerRefs ?? []) {
          if (triggerRef.current?.contains(target)) return
        }
        close()
      }
      document.addEventListener('keydown', onKeyDown)
      document.addEventListener('pointerdown', onPointerDown)
      return () => {
        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('pointerdown', onPointerDown)
      }
    }, [isOpen, close, triggerRefs])

    useEffect(() => {
      const handle = () => close()
      router.events.on('routeChangeStart', handle)
      return () => {
        router.events.off('routeChangeStart', handle)
      }
    }, [router.events, close])

    const drilldownSection = drilldownKey
      ? navData[drilldownKey]
      : null

    const menuLabel = activeLocale === 'is' ? 'Valmynd' : 'Menu'
    const backLabel = activeLocale === 'is' ? 'Til baka' : 'Back'

    return (
      <>
        {/* <div
          aria-hidden="true"
          className={`${styles.topMask} ${
            isTransitioning ? styles.topMaskVisible : ''
          }`}
        /> */}
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
                        {item.logoUrl && (
                          <img
                            aria-hidden="true"
                            alt=""
                            src={item.logoUrl}
                            width={20}
                            height={20}
                            className={styles.drillLinkLogo}
                          />
                        )}
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
              <div
                className={styles.seeAllRow}
                onFocus={(event) => {
                  if (!(event.target instanceof HTMLAnchorElement)) return
                  if (!seeAllButtonRef.current) return
                  // Shift+Tab from the Button lands focus back on the Link;
                  // forwarding to Button again would trap focus, so jump to
                  // the previous tabbable element inside the panel instead.
                  if (
                    event.relatedTarget === seeAllButtonRef.current &&
                    panelRef.current
                  ) {
                    focusPreviousTabbableIn(panelRef.current, event.target)
                    return
                  }
                  // Otherwise this is a forward tab onto the Link — forward
                  // focus to the Button so its mint `:focus` style shows.
                  seeAllButtonRef.current.focus()
                }}
              >
                <Link
                  href={
                    activeLocale === 'en' &&
                    !drilldownSection.seeAllHref.startsWith('/en')
                      ? `/en${drilldownSection.seeAllHref}`
                      : drilldownSection.seeAllHref
                  }
                >
                  <Button
                    ref={(node) => {
                      seeAllButtonRef.current = node
                      if (node) node.tabIndex = -1
                    }}
                    icon="arrowForward"
                    iconType="filled"
                    variant="text"
                    size="small"
                    as="span"
                  >
                    {drilldownSection.seeAllLabel}
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <ul className={styles.panelList}>
              {HEADER_NAV_KEYS.map((key) => {
                const section = navData[key]
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
      </>
    )
  },
)

interface MobileNavSearchButtonProps {
  onClick: () => void
  // Accepted for parity with the menu button but unused here — the search
  // trigger doesn't disclose a sibling popup (pressing it opens the same
  // panel the menu button does), so no `aria-expanded` is needed.
  isOpen?: boolean
}

export const MobileNavSearchButton = forwardRef<
  HTMLButtonElement,
  MobileNavSearchButtonProps
>(({ onClick }, ref) => {
  const { activeLocale } = useI18n()
  const searchLabel = activeLocale === 'is' ? 'Leit' : 'Search'
  return (
    <Button
      ref={ref}
      variant="utility"
      icon="search"
      iconType="outline"
      title={searchLabel}
      onClick={onClick}
    />
  )
})

interface MobileNavMenuButtonProps {
  onClick: () => void
  isOpen: boolean
}

export const MobileNavMenuButton = forwardRef<
  HTMLButtonElement,
  MobileNavMenuButtonProps
>(({ onClick, isOpen }, forwardedRef) => {
  const { activeLocale } = useI18n()
  const menuLabel = activeLocale === 'is' ? 'Valmynd' : 'Menu'
  // Island-ui's Button doesn't type `aria-*` in its props, but its impl
  // spreads unknown props onto the underlying element — however relying on
  // that would fail TypeScript. Setting the attributes imperatively via a
  // ref + effect keeps Button's API clean and still yields the correct
  // runtime DOM.
  const localRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const node = localRef.current
    if (!node) return
    node.setAttribute('aria-expanded', String(isOpen))
    node.setAttribute('aria-haspopup', 'true')
  }, [isOpen])

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      localRef.current = node
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    },
    [forwardedRef],
  )

  return (
    <Button
      ref={setRef}
      variant="utility"
      icon={isOpen ? 'close' : 'menu'}
      iconType="outline"
      onClick={onClick}
    >
      {menuLabel}
    </Button>
  )
})
