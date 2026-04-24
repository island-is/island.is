import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import { Icon } from '@island.is/island-ui/core'
import { SearchInput } from '@island.is/web/components'
import { GlobalContext } from '@island.is/web/context'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './DesktopSearchPanel.css'

interface DesktopSearchPanelProps {
  organizationSearchFilter?: string
  searchPlaceholder?: string
  onOpenChange?: (isOpen: boolean) => void
}

export const DesktopSearchPanel = ({
  organizationSearchFilter,
  searchPlaceholder,
  onOpenChange,
}: DesktopSearchPanelProps) => {
  const { activeLocale, t } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const focusTimerRef = useRef<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const reactId = useId()
  const overlayId = `desktop-search-overlay-${reactId}`

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  const clearFocusTimer = useCallback(() => {
    if (focusTimerRef.current !== null) {
      window.clearTimeout(focusTimerRef.current)
      focusTimerRef.current = null
    }
  }, [])

  const close = useCallback(() => {
    clearFocusTimer()
    setIsOpen(false)
  }, [clearFocusTimer])

  const open = useCallback(() => {
    setIsOpen(true)
    // Wait for the panel to mount + become visible before focusing the
    // input; focusing a visibility:hidden element is a no-op. Tracked in
    // a ref so rapid open/close or unmount cancels the pending focus.
    clearFocusTimer()
    focusTimerRef.current = window.setTimeout(() => {
      focusTimerRef.current = null
      searchInputRef.current?.focus()
    }, 50)
  }, [clearFocusTimer])

  useEffect(() => clearFocusTimer, [clearFocusTimer])

  // Close on Escape (return focus to trigger per APG), outside click, and
  // route change — same contract as the other header surfaces.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        buttonRef.current?.focus()
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
  }, [isOpen, close])

  useEffect(() => {
    const handle = () => close()
    router.events.on('routeChangeStart', handle)
    return () => {
      router.events.off('routeChangeStart', handle)
    }
  }, [router.events, close])

  const searchLabel = n(
    'headerNavSearchLabel',
    activeLocale === 'is' ? 'Leit' : 'Search',
  )

  return (
    <div ref={containerRef} className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.iconButton} ${
          isOpen ? styles.iconButtonHidden : ''
        }`}
        aria-label={searchLabel}
        aria-expanded={isOpen}
        aria-controls={overlayId}
        onClick={() => (isOpen ? close() : open())}
      >
        <Icon icon="search" type="outline" size="small" color="blue400" />
      </button>

      <div
        id={overlayId}
        role="search"
        aria-label={searchLabel}
        aria-hidden={!isOpen}
        className={`${styles.inputOverlay} ${
          isOpen ? styles.inputOverlayOpen : ''
        }`}
      >
        <SearchInput
          ref={searchInputRef}
          id="desktop-header-search"
          size="medium"
          activeLocale={activeLocale}
          placeholder={searchPlaceholder ?? t.searchPlaceholder}
          autocomplete={true}
          autosuggest={true}
          organization={organizationSearchFilter}
        />
      </div>
    </div>
  )
}

export default DesktopSearchPanel
