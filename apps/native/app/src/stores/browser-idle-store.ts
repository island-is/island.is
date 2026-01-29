import { AppState, AppStateStatus } from 'react-native'
import { Navigation } from 'react-native-navigation'
import createUse from 'zustand'
import create, { State } from 'zustand/vanilla'

// ============================================================================
// Constants
// ============================================================================

const ONE_HOUR_MS = 3600000 // 1 hour in milliseconds
const CHECK_INTERVAL_MS = 60000 // Check every 60 seconds

// ============================================================================
// Types
// ============================================================================

interface BrowserIdleState extends State {
  lastActivityTime: number | null
  currentBrowserComponentId: string | null
  isBrowserOpen: boolean
  idleTimeout: number
}

interface BrowserIdleActions {
  onBrowserOpened: (componentId: string) => void
  onBrowserClosed: () => void
  resetActivity: () => void
  checkAndHandleTimeout: () => void
}

type BrowserIdleStore = BrowserIdleState & BrowserIdleActions

// ============================================================================
// Store
// ============================================================================

export const browserIdleStore = create<BrowserIdleStore>((set, get) => ({
  // Initial state
  lastActivityTime: null,
  currentBrowserComponentId: null,
  isBrowserOpen: false,
  idleTimeout: ONE_HOUR_MS,

  // Actions
  onBrowserOpened: (componentId: string) => {
    set({
      lastActivityTime: Date.now(),
      currentBrowserComponentId: componentId,
      isBrowserOpen: true,
    })
  },

  onBrowserClosed: () => {
    set({
      lastActivityTime: null,
      currentBrowserComponentId: null,
      isBrowserOpen: false,
    })
  },

  resetActivity: () => {
    if (get().isBrowserOpen) {
      set({ lastActivityTime: Date.now() })
    }
  },

  checkAndHandleTimeout: () => {
    const { isBrowserOpen, lastActivityTime, currentBrowserComponentId, idleTimeout } = get()

    if (!isBrowserOpen || !lastActivityTime) {
      return
    }

    const hasTimedOut = Date.now() - lastActivityTime >= idleTimeout

    if (hasTimedOut && currentBrowserComponentId) {
      dismissBrowser(currentBrowserComponentId)
      get().onBrowserClosed()
    }
  },
}))

export const useBrowserIdleStore = createUse(browserIdleStore)

// ============================================================================
// Helper Functions
// ============================================================================

function dismissBrowser(componentId: string) {
  Navigation.dismissModal(componentId).catch(() => {
    Navigation.dismissAllModals().catch((err) => {
      console.warn('[BrowserIdle] Failed to dismiss browser:', err)
    })
  })
}

// ============================================================================
// Monitoring Setup
// ============================================================================

let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null
let timeoutCheckInterval: NodeJS.Timeout | null = null

/**
 * Initialize browser idle timeout monitoring.
 * 
 * Monitors app state changes and periodically checks if any open browsers
 * have exceeded the idle timeout (1 hour). Automatically closes browsers
 * that have been open too long.
 * 
 * Should be called once during app initialization.
 */
export function initializeBrowserIdleMonitoring() {
  cleanupBrowserIdleMonitoring()

  // Check when app comes to foreground
  appStateSubscription = AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state === 'active') {
      browserIdleStore.getState().checkAndHandleTimeout()
    }
  })

  // Periodic check while app is active (every 5 seconds)
  timeoutCheckInterval = setInterval(() => {
    if (AppState.currentState === 'active') {
      browserIdleStore.getState().checkAndHandleTimeout()
    }
  }, CHECK_INTERVAL_MS)
}

/**
 * Clean up browser idle monitoring subscriptions.
 * Called automatically when reinitializing.
 */
export function cleanupBrowserIdleMonitoring() {
  appStateSubscription?.remove()
  appStateSubscription = null

  if (timeoutCheckInterval) {
    clearInterval(timeoutCheckInterval)
    timeoutCheckInterval = null
  }
}
