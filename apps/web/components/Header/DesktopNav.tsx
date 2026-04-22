import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { Button, Icon, Link } from '@island.is/island-ui/core'
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
import * as styles from './DesktopNav.css'

interface DesktopNavProps {
  // Contentful-driven nav data. Falls back to HEADER_NAV_MOCK_DATA when
  // omitted — keeps local dev and the initial render (before the query
  // resolves) populated.
  data?: HeaderNavData
  onOpenChange?: (isOpen: boolean) => void
}

type DropdownKey = HeaderNavKey

const FULL_WIDTH_BREAKPOINT = 1100

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

// Finds the first tabbable element in the document that is positioned
// AFTER `container` AND is actually focusable. Used to escape out of the
// nav when natural Tab would otherwise loop back into the panel (whose
// DOM position sits after all triggers as siblings).
const focusNextTabbableAfter = (container: HTMLElement) => {
  const all = Array.from(
    document.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR),
  )
  for (const el of all) {
    if (container.contains(el)) continue
    if (
      !(
        container.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
      )
    )
      continue
    // offsetParent is null for display:none elements (or inside one). Those
    // match the selector but can't actually receive focus, so skip them.
    if (el.offsetParent === null) continue
    el.focus()
    // Some elements (e.g. visibility:hidden) still pass the above checks
    // but refuse focus; if focus didn't land, try the next candidate.
    if (document.activeElement === el) return
  }
}

export const DesktopNav = ({
  data,
  onOpenChange,
}: DesktopNavProps = {}) => {
  const { activeLocale } = useI18n()
  const router = useRouter()
  const navData = data ?? HEADER_NAV_MOCK_DATA
  const [openKey, setOpenKey] = useState<DropdownKey | null>(null)
  const containerRef = useRef<HTMLElement>(null)
  // One panel per section, all rendered on mount so every link is in the
  // initial DOM for crawlers (SEO) and screen reader navigation. Only the
  // open panel has opacity:1/visibility:visible; closed panels are
  // non-interactive (visibility:hidden removes them from tab order too).
  const panelRefs = useRef<Map<DropdownKey, HTMLDivElement>>(new Map())
  // Keyed map of tab-button nodes so Escape/outside-click handlers can
  // restore focus to the trigger that opened the dropdown, per APG.
  const tabButtonRefs = useRef<Map<DropdownKey, HTMLButtonElement>>(new Map())
  // See-all Button nodes keyed by panel — each panel has its own Link+Button
  // pair, and the onFocus handler forwards focus to the Button that belongs
  // to that panel.
  const seeAllButtonRefs = useRef<Map<DropdownKey, HTMLElement>>(new Map())
  const reactId = useId()
  const [fullWidthOffsets, setFullWidthOffsets] = useState<{
    left: number
    right: number
  } | null>(null)
  // Tracks whether any panel is currently in an opacity fade. The top-mask
  // div is only visible during this window so it can cover the header
  // shadow that would otherwise bleed through the translucent panel top.
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevOpenKeyRef = useRef<DropdownKey | null>(null)
  // When switching from one open panel to another (X→Y), we suppress the
  // opacity transition so the swap is instant — otherwise both panels sit
  // at ~0.5 opacity mid-crossfade and ghost through each other as
  // "flicker". Normal open/close fades are unaffected.
  const [suppressTransition, setSuppressTransition] = useState(false)
  const suppressFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (prevOpenKeyRef.current === openKey) return
    prevOpenKeyRef.current = openKey
    setIsTransitioning(true)
    const timer = setTimeout(
      () => setIsTransitioning(false),
      NAV_TRANSITION_DURATION_MS,
    )
    return () => clearTimeout(timer)
  }, [openKey])

  useEffect(() => {
    onOpenChange?.(openKey !== null)
  }, [openKey, onOpenChange])

  const close = useCallback(() => setOpenKey(null), [])

  useEffect(() => {
    if (!openKey) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // APG: on Escape, close the popup AND return focus to the trigger
        // button so keyboard users don't get dropped into the page body.
        const keyToRestore = openKey
        close()
        tabButtonRefs.current.get(keyToRestore)?.focus()
      }
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
  }, [openKey, close])

  useEffect(() => {
    const handle = () => close()
    router.events.on('routeChangeStart', handle)
    return () => {
      router.events.off('routeChangeStart', handle)
    }
  }, [router.events, close])

  // When the viewport is below FULL_WIDTH_BREAKPOINT we want the dropdown
  // to span from viewport edge to viewport edge. All panels share the same
  // positional footprint, so measuring any one of them gives the right
  // offsets; we read the currently-open panel.
  //
  // useIsomorphicLayoutEffect runs synchronously before paint on the client,
  // so the inline offsets are in place on the first visible frame. Without
  // this, a regular useEffect paints the dropdown at its unadjusted position
  // for one frame before we correct it — visible as a jump on slow machines.
  useIsomorphicLayoutEffect(() => {
    // Skip on close: clearing the offsets mid-fade would strip the inline
    // left/right/width and the dropdown would snap back to its narrow CSS
    // positioning while it's still fading out. The offsets are harmless
    // while closed (visibility: hidden) and get recomputed on next open.
    if (!openKey) return
    const update = () => {
      const panel = panelRefs.current.get(openKey)
      if (!panel) return
      if (window.innerWidth >= FULL_WIDTH_BREAKPOINT) {
        setFullWidthOffsets(null)
        return
      }
      const parent = panel.offsetParent as HTMLElement | null
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
    // X→Y swap: both current and next are non-null AND different. Suppress
    // the opacity transition just for this render so the new panel snaps
    // in while the old one snaps out — instead of crossfading and ghosting.
    const isSwap = openKey !== null && openKey !== key
    if (isSwap) {
      if (suppressFrameRef.current !== null) {
        cancelAnimationFrame(suppressFrameRef.current)
      }
      setSuppressTransition(true)
      suppressFrameRef.current = requestAnimationFrame(() => {
        suppressFrameRef.current = null
        setSuppressTransition(false)
      })
    }
    setOpenKey((current) => (current === key ? null : key))
  }

  const navLabel = activeLocale === 'is' ? 'Aðalvalmynd' : 'Main navigation'

  const handleNavKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // Keep Tab order logical when a panel is open:
    //   trigger → its panel links → next trigger sibling
    // instead of the natural DOM order which would be
    //   trigger → sibling triggers → panel links.
    if (event.key !== 'Tab') return
    if (!openKey) return
    const panel = panelRefs.current.get(openKey)
    if (!panel) return
    const panelLinks = Array.from(
      panel.querySelectorAll<HTMLElement>('a[href]'),
    )
    const firstLink = panelLinks[0]
    const lastLink = panelLinks[panelLinks.length - 1]
    if (!firstLink || !lastLink) return

    const openTrigger = tabButtonRefs.current.get(openKey)
    const openIdx = HEADER_NAV_KEYS.indexOf(openKey)
    const nextKey = HEADER_NAV_KEYS[openIdx + 1]
    const nextTrigger = nextKey ? tabButtonRefs.current.get(nextKey) : undefined
    const target = event.target as HTMLElement

    // Forward Tab on the open trigger routes INTO the panel's first link.
    if (!event.shiftKey && target === openTrigger) {
      event.preventDefault()
      firstLink.focus()
      return
    }
    // Forward Tab from the see-all link exits the panel to the next
    // trigger (or lets natural tab order leave the nav if it was last).
    if (!event.shiftKey && lastLink.contains(target) && nextTrigger) {
      event.preventDefault()
      nextTrigger.focus()
      return
    }
    // Backward Shift+Tab from the first panel link returns to the open
    // trigger that revealed it.
    if (event.shiftKey && target === firstLink && openTrigger) {
      event.preventDefault()
      openTrigger.focus()
      return
    }
    // Backward Shift+Tab from the trigger that sits after the open one
    // re-enters the panel at its last link (the see-all).
    if (event.shiftKey && target === nextTrigger) {
      event.preventDefault()
      lastLink.focus()
      return
    }
    // The panel lives as a DOM sibling AFTER all triggers. When the open
    // trigger isn't the last one, natural Tab from the last trigger would
    // loop back into the panel's first link (keyboard trap per WCAG 2.1.2).
    // Skip the panel and land on the next tabbable after the nav instead.
    const lastKey = HEADER_NAV_KEYS[HEADER_NAV_KEYS.length - 1]
    const lastTrigger = tabButtonRefs.current.get(lastKey)
    if (
      !event.shiftKey &&
      target === lastTrigger &&
      openKey !== lastKey &&
      containerRef.current
    ) {
      event.preventDefault()
      focusNextTabbableAfter(containerRef.current)
      return
    }
  }

  const panelIdFor = (key: DropdownKey) => `desktop-nav-panel-${reactId}-${key}`
  const buttonIdFor = (key: DropdownKey) => `desktop-nav-tab-${reactId}-${key}`

  return (
    <nav
      ref={containerRef}
      aria-label={navLabel}
      className={styles.nav}
      onKeyDown={handleNavKeyDown}
    >
      {HEADER_NAV_KEYS.map((key) => {
        const data = navData[key]
        const isOpen = openKey === key
        return (
          <button
            key={key}
            id={buttonIdFor(key)}
            type="button"
            ref={(node) => {
              if (node) tabButtonRefs.current.set(key, node)
              else tabButtonRefs.current.delete(key)
            }}
            className={`${styles.tabButton} ${
              isOpen ? styles.tabButtonActive : ''
            }`}
            // Disclosure pattern: aria-expanded conveys the open state and
            // aria-controls points to the (always-mounted) panel for this
            // specific section. We do NOT use aria-haspopup because the
            // panel contains links, not menuitems — "haspopup=true" would
            // imply a real ARIA menu.
            aria-expanded={isOpen}
            aria-controls={panelIdFor(key)}
            data-desktop-nav-open={isOpen ? 'true' : undefined}
            onClick={() => toggle(key)}
          >
            {data.label}
            <span
              aria-hidden="true"
              className={`${styles.chevron} ${
                isOpen ? styles.chevronOpen : ''
              }`}
            >
              <Icon icon="chevronDown" size="small" />
            </span>
          </button>
        )
      })}

      <div
        aria-hidden="true"
        className={`${styles.topMask} ${
          isTransitioning ? styles.topMaskVisible : ''
        }`}
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
      />

      {HEADER_NAV_KEYS.map((key) => {
        const data = navData[key]
        const isOpen = openKey === key
        return (
          <div
            key={key}
            ref={(node) => {
              if (node) panelRefs.current.set(key, node)
              else panelRefs.current.delete(key)
            }}
            id={panelIdFor(key)}
            role="region"
            aria-labelledby={buttonIdFor(key)}
            aria-hidden={!isOpen}
            className={`${styles.dropdown} ${
              isOpen ? styles.dropdownOpen : ''
            }`}
            style={{
              ...(fullWidthOffsets
                ? {
                    left: `${fullWidthOffsets.left}px`,
                    right: `${fullWidthOffsets.right}px`,
                    width: 'auto',
                    maxWidth: 'none',
                  }
                : {}),
              ...(suppressTransition ? { transition: 'none' } : {}),
            }}
          >
            <div className={styles.dropdownTitle}>{data.title}</div>
            <ul className={styles.dropdownList}>
              {data.items.slice(0, HEADER_NAV_MAX_ITEMS).map((item) => (
                <li key={item.href}>
                  <Link
                    href={
                      activeLocale === 'en' && !item.href.startsWith('/en')
                        ? `/en${item.href}`
                        : item.href
                    }
                    className={styles.dropdownLink}
                  >
                    {item.logoUrl && (
                      <img
                        aria-hidden="true"
                        alt=""
                        src={item.logoUrl}
                        width={20}
                        height={20}
                        className={styles.dropdownLinkLogo}
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
                const seeAllButton = seeAllButtonRefs.current.get(key)
                if (!seeAllButton) return
                // Shift+Tab from the Button lands focus back on the Link;
                // forwarding to Button again would trap focus, so jump to
                // the previous tabbable element inside the nav instead.
                if (
                  event.relatedTarget === seeAllButton &&
                  containerRef.current
                ) {
                  focusPreviousTabbableIn(containerRef.current, event.target)
                  return
                }
                // Otherwise this is a forward tab onto the Link — forward
                // focus to the Button so its mint `:focus` style shows.
                seeAllButton.focus()
              }}
            >
              <Link
                href={
                  activeLocale === 'en' && !data.seeAllHref.startsWith('/en')
                    ? `/en${data.seeAllHref}`
                    : data.seeAllHref
                }
              >
                <Button
                  ref={(node) => {
                    if (node) {
                      seeAllButtonRefs.current.set(key, node)
                      node.tabIndex = -1
                      // Because we forward keyboard focus here from the
                      // wrapping <Link>, the browser's built-in "Enter on a
                      // focused <a> fires click" behaviour doesn't run (the
                      // anchor itself isn't focused). Simulate it by clicking
                      // the closest <a> on Enter / Space. Using .onkeydown
                      // (not addEventListener) so repeat ref calls overwrite
                      // rather than accumulate handlers.
                      node.onkeydown = (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          node.closest('a')?.click()
                        }
                      }
                    } else {
                      seeAllButtonRefs.current.delete(key)
                    }
                  }}
                  icon="arrowForward"
                  iconType="filled"
                  variant="text"
                  size="small"
                  as="span"
                >
                  {data.seeAllLabel}
                </Button>
              </Link>
            </div>
          </div>
        )
      })}
    </nav>
  )
}

export default DesktopNav
