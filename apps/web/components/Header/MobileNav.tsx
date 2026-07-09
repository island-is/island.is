import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import { Box, Button, Icon, Link } from '@island.is/island-ui/core'
import { webMenuButtonClicked } from '@island.is/plausible'
import { SearchInput } from '@island.is/web/components'
import { GlobalContext } from '@island.is/web/context'
import { useNamespace } from '@island.is/web/hooks'
import { useIsomorphicLayoutEffect } from '@island.is/web/hooks/useScrollPosition/useIsomorphicLayoutEffect'
import { useI18n } from '@island.is/web/i18n'

import {
  HEADER_NAV_KEYS,
  HEADER_NAV_MAX_ITEMS,
  HEADER_NAV_SEE_ALL_LABEL_KEYS,
  type HeaderNavData,
  type HeaderNavKey,
  withEnPrefix,
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
  // Contentful-driven nav data. When missing the panel renders nothing —
  // we'd rather surface the failure than serve stale hardcoded links.
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
  // When false the panel is search-only: the nav sections (drilldown rows)
  // are hidden, leaving just the search input. Used on institution sites
  // and project pages so mobile search keeps working with nav hidden.
  showNavigation?: boolean
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
      showNavigation = true,
    },
    ref,
  ) => {
    const { activeLocale, t } = useI18n()
    const { globalNamespace } = useContext(GlobalContext)
    const n = useNamespace(globalNamespace)
    const router = useRouter()
    const panelRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    // Captures the "see all" Button DOM node so we can forward keyboard focus
    // from the wrapping Link to the Button — the Button has a much nicer
    // focus-visible state (mint fill + underline) that only triggers when the
    // Button itself is focused.
    const seeAllButtonRef = useRef<HTMLElement | null>(null)
    // Remembers what had focus when the panel opened so Escape can return
    // focus to the trigger (APG disclosure pattern).
    const openerRef = useRef<HTMLElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [drilldownKey, setDrilldownKey] = useState<HeaderNavKey | null>(null)
    const [isPanelScrolled, setIsPanelScrolled] = useState(false)
    // Tracks whether the panel is currently in its opacity fade window. Feeds
    // the top-mask div (commented out in the JSX — see the block before the
    // return below). Dormant state is cheap and keeps re-enabling the mask a
    // one-line change.
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

    // Close on resize into desktop. Parent wraps the panel in
    // `Hidden above="md"` which only CSS-hides it at lg+ (992px). Without
    // this, a mobile→desktop resize leaves the panel invisible but still
    // "open", scroll-locking the body with no visible way to recover.
    useEffect(() => {
      if (!isOpen) return
      const mq = window.matchMedia('(min-width: 992px)')
      if (mq.matches) {
        close()
        return
      }
      const handleChange = (event: MediaQueryListEvent) => {
        if (event.matches) close()
      }
      mq.addEventListener('change', handleChange)
      return () => mq.removeEventListener('change', handleChange)
    }, [isOpen, close])

    const openPanel = useCallback((focusSearch: boolean) => {
      // Capture the opener (typically the search or menu button) so Escape
      // can restore focus there per APG.
      if (typeof document !== 'undefined') {
        const active = document.activeElement
        openerRef.current = active instanceof HTMLElement ? active : null
      }
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
        if (event.key === 'Escape') {
          close()
          openerRef.current?.focus()
        }
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

    const menuLabel = n(
      'headerNavMenuLabel',
      activeLocale === 'is' ? 'Valmynd' : 'Menu',
    )
    const backLabel = n(
      'headerNavBackLabel',
      activeLocale === 'is' ? 'Til baka' : 'Back',
    )

    // No Contentful-driven nav data yet: render nothing rather than fall back
    // to stale hardcoded links. Hooks above still run so hook order is stable.
    // When navigation is hidden the panel is search-only, so it still renders
    // even without nav data.
    if (!data && showNavigation) return null
    const navData = data
    const drilldownSection =
      showNavigation && navData && drilldownKey ? navData[drilldownKey] : null

    // Rendered in both layouts. Medium (40px, 16px placeholder) matches the
    // Figma Mobile_Search overlay; the no-nav pages just present it full-width.
    const searchEl = (
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
    )

    return (
      <>
        {/* Top-mask disabled for now: covers the header-shadow bleed nicely
            on the frontpage but flashes visibly on pages with content sitting
            flush under the header (e.g. org pages). Uncomment to re-enable. */}
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
          className={
            showNavigation
              ? `${styles.panel} ${isOpen ? styles.panelOpen : ''}`
              : `${styles.panelSearch} ${isOpen ? styles.panelSearchOpen : ''}`
          }
          onScroll={(event) =>
            setIsPanelScrolled(event.currentTarget.scrollTop > 10)
          }
        >
          {showNavigation && (
            <div
              aria-hidden="true"
              className={`${styles.scrollShadow} ${
                isPanelScrolled ? styles.scrollShadowVisible : ''
              }`}
            />
          )}
          {showNavigation ? (
            <Box className={styles.searchWrapper}>{searchEl}</Box>
          ) : (
            // Grid 0fr→1fr drives the "grow from the top down" reveal. The
            // inner clips only mid-transition (isTransitioning); once settled
            // it goes overflow:visible so the absolutely-positioned autosuggest
            // dropdown can escape the hug-content panel instead of being cut.
            <div
              className={`${styles.panelSearchInner} ${
                isOpen && !isTransitioning ? styles.panelSearchInnerOpen : ''
              }`}
            >
              <Box className={styles.searchWrapper}>{searchEl}</Box>
            </div>
          )}

          {showNavigation &&
            navData &&
            (drilldownSection && drilldownKey ? (
              <>
                <Box className={styles.panelHeader}>
                  <button
                    type="button"
                    className={styles.backButton}
                    aria-label={backLabel}
                    onClick={() => setDrilldownKey(null)}
                  >
                    <Icon
                      icon="chevronBack"
                      type="outline"
                      size="small"
                      color="dark400"
                    />
                  </button>
                  <h2 className={styles.panelTitle}>
                    {drilldownSection.label}
                  </h2>
                </Box>
                <ul className={styles.drilldownList}>
                  {drilldownSection.items
                    .slice(0, HEADER_NAV_MAX_ITEMS)
                    .map((item) => (
                      <li key={item.href}>
                        <Link
                          href={withEnPrefix(item.href, activeLocale)}
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
                  onKeyDown={(event) => {
                    // Focus is forwarded to the Button (a <span>), so Enter /
                    // Space on the forwarded focus wouldn't reach the wrapping
                    // anchor. Click it explicitly to navigate.
                    if (event.key !== 'Enter' && event.key !== ' ') return
                    if (event.target !== seeAllButtonRef.current) return
                    event.preventDefault()
                    const anchor = (
                      event.currentTarget as HTMLElement
                    ).querySelector('a')
                    anchor?.click()
                  }}
                >
                  <Link
                    href={withEnPrefix(
                      drilldownSection.seeAllHref,
                      activeLocale,
                    )}
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
                      {n(
                        HEADER_NAV_SEE_ALL_LABEL_KEYS[drilldownKey],
                        drilldownSection.seeAllLabel,
                      )}
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
                          color="blue400"
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
            ))}
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
  // On no-nav pages there is no separate menu button, so the open panel is
  // dismissed via this same trigger. When true it renders as the Figma
  // "Loka" close button (label + X) instead of the search icon.
  asClose?: boolean
}

export const MobileNavSearchButton = forwardRef<
  HTMLButtonElement,
  MobileNavSearchButtonProps
>(({ onClick, isOpen, asClose = false }, ref) => {
  const { activeLocale } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const searchLabel = n(
    'headerNavSearchLabel',
    activeLocale === 'is' ? 'Leit' : 'Search',
  )
  const closeLabel = n(
    'headerNavCloseLabel',
    activeLocale === 'is' ? 'Loka' : 'Close',
  )
  return (
    <Button
      ref={ref}
      variant="utility"
      icon={asClose ? 'close' : 'search'}
      iconType="outline"
      title={asClose ? closeLabel : searchLabel}
      onClick={() => {
        // When the panel is already open the search trigger just focuses
        // the input (or closes, on no-nav pages) — not a fresh open.
        if (!isOpen) {
          webMenuButtonClicked({ surface: 'mobile', trigger: 'search' })
        }
        onClick()
      }}
    >
      {asClose ? closeLabel : undefined}
    </Button>
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
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const menuLabel = n(
    'headerNavMenuLabel',
    activeLocale === 'is' ? 'Valmynd' : 'Menu',
  )
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
      onClick={() => {
        // Track opens only — toggling closed isn't an engagement event.
        if (!isOpen) {
          webMenuButtonClicked({ surface: 'mobile', trigger: 'menu' })
        }
        onClick()
      }}
    >
      {menuLabel}
    </Button>
  )
})
