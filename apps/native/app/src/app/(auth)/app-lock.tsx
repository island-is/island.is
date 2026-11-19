import { StackActions } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import {
  Alert,
  AppState,
  BackHandler,
  InteractionManager,
  Platform,
  View,
} from 'react-native'

import {
  clearPendingDeepLink,
  consumePendingDeepLink,
  hasPendingDeepLink,
} from '@/app/+native-intent'
import {
  authStore,
  clearLockScreenSuppression,
  suppressLockScreen,
  useAuthStore,
} from '@/stores/auth-store'
import { APP_LOCK_TIMEOUT_MS } from '@/constants/auth'
import { useUiStore } from '@/stores/ui-store'
import { DeviceLock } from '@/components/device-bound-auth/device-lock'
import { ElectronicIdConfirmation } from '@/components/device-bound-auth/electronic-id-confirmation'
import { useBiometricType } from '@/hooks/use-biometric-type'
import { useIsOffline } from '@/hooks/use-is-offline'
import { useNativeUnlock } from '@/hooks/use-native-unlock'
import {
  ensureDeviceUnlockCanary,
  isDeviceUnlocked,
} from '@/utils/device-unlock-canary'
import { testIDs } from '@/utils/test-ids'
import { useBrowser } from '@/hooks/use-browser'

export default function AppLockScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const logout = useAuthStore(({ logout }) => logout)
  const nativeUser = useAuthStore(({ nativeUser }) => nativeUser)
  const intl = useIntl()
  const { openBrowser } = useBrowser()

  // Closes the lock and any sheet on top of it in one step.
  const closeLock = () => {
    const state = navigation.getState()
    const lockIndex =
      state?.routes.map((route) => route.name).lastIndexOf('app-lock') ?? -1
    if (state && lockIndex !== -1) {
      navigation.dispatch(StackActions.pop(state.routes.length - lockIndex))
    } else if (router.canGoBack()) {
      router.back()
    }
  }

  const unlockApp = () => {
    // Approved while the app is away, e.g. in Auðkennisappið: the lock stays,
    // with the grace period starting now. Coming back soon opens the app,
    // coming back later asks again.
    if (AppState.currentState === 'background') {
      authStore.setState({
        lockScreenActivatedAt: Date.now(),
        biometricAutoPromptedForCurrentLock: false,
      })
      return
    }
    // The user just authenticated, so the device is unlocked — refresh the canary.
    void ensureDeviceUnlockCanary()
    authStore.setState({
      lockScreenActivatedAt: undefined,
      biometricAutoPromptedForCurrentLock: false,
    })
    // Suppress lock re-arming during the dismiss + replay: iOS fires a
    // transient active→inactive that the auth layout would otherwise treat as
    // backgrounding and re-push the lock. Re-armed once it settles.
    suppressLockScreen()

    // With a pending link, clear the lock AND any open modal so the replay
    // lands on the tabs base — leaving a stale modal on top breaks its own
    // back/close ("GO_BACK was not handled"). A plain unlock keeps it.
    if (hasPendingDeepLink() && router.canDismiss()) {
      router.dismissAll()
    } else {
      closeLock()
    }
    // Replay after the dismiss settles — on setTimeout(0) the navigate races
    // the pop and gets dropped.
    InteractionManager.runAfterInteractions(() => {
      void consumePendingDeepLink(openBrowser)
      // Buffer the clear past the replayed screen's present animation.
      setTimeout(() => clearLockScreenSuppression(), 600)
    })
  }

  const handleLogout = async () => {
    await logout()
    authStore.setState({
      lockScreenActivatedAt: undefined,
      biometricAutoPromptedForCurrentLock: false,
    })
    clearPendingDeepLink()
    router.replace('/login')
  }

  const nativeUnlock = useNativeUnlock({
    onUnlocked: unlockApp,
    onAppLoginGone() {
      Alert.alert(
        intl.formatMessage({ id: 'login.expiredTitle' }),
        intl.formatMessage({ id: 'login.expiredMessage' }),
      )
      void handleLogout()
    },
  })
  // The AppState effect below runs once; it needs the latest callbacks.
  const nativeUnlockRef = useRef(nativeUnlock)
  nativeUnlockRef.current = nativeUnlock

  // Swallow Android hardware back.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => sub.remove()
  }, [])

  // Own a componentId so the layout can detect external pops and re-push.
  // Also clears lockScreenPushPending — the synchronous dedup flag set by the
  // pusher to prevent racing pushes before this mount commits.
  useEffect(() => {
    const id = `app-lock-${Date.now()}-${Math.random().toString(36).slice(2)}`
    authStore.setState({
      lockScreenComponentId: id,
      lockScreenPushPending: false,
    })
    return () => {
      if (authStore.getState().lockScreenComponentId === id) {
        authStore.setState({ lockScreenComponentId: undefined })
      }
    }
  }, [])

  // On mount and each → active: undefined → dismiss, within grace → unlock,
  // else → require auth (biometric prompted once per lock).
  useEffect(() => {
    let unmounted = false
    const tryUnlockOrPrompt = async () => {
      // AppState can claim 'active' while the phone is locked (Always-On
      // Display), but the keychain can't lie: WHEN_UNLOCKED items are only
      // readable once the device is genuinely unlocked.
      const deviceUnlocked = await isDeviceUnlocked()
      // Re-check unmounted: the screen may have been dismissed during the
      // await, and acting (e.g. router.back below) would hit a stale screen.
      if (unmounted || !deviceUnlocked) {
        return
      }
      if (AppState.currentState !== 'active') {
        return
      }

      const {
        lockScreenActivatedAt,
        biometricAutoPromptedForCurrentLock,
        authorizeResult,
      } = authStore.getState()

      if (lockScreenActivatedAt === undefined) {
        if (router.canGoBack()) {
          router.back()
        }
        return
      }

      // Without tokens (after a restart) there's no skipping the lock.
      const elapsed = Date.now() - lockScreenActivatedAt
      if (elapsed < APP_LOCK_TIMEOUT_MS && authorizeResult) {
        unlockApp()
        return
      }

      // Past the grace period the tokens go: the unlock gets new ones from IAS.
      // They're gone at once; the prompt doesn't wait for the revocation.
      void authStore.getState().lockNative()

      if (biometricAutoPromptedForCurrentLock) {
        return
      }
      authStore.setState({ biometricAutoPromptedForCurrentLock: true })
      void nativeUnlockRef.current.unlockWithBiometrics()
    }

    // With Always-On Display, iOS fires ghost 'active' events while the
    // phone is locked and dark. Reacting to them pops/re-pushes the lock
    // modal off-screen, corrupting the native stack (black screen on
    // resume). Ghost events flip back to inactive within ~250ms, so require
    // 500ms of uninterrupted 'active' plus a rendered frame before acting.
    let pendingTimer: ReturnType<typeof setTimeout> | undefined
    const confirmVisibleThenRun = () => {
      // The ghost events are iOS-only; Android evaluates immediately.
      if (Platform.OS !== 'ios') {
        void tryUnlockOrPrompt()
        return
      }
      if (pendingTimer) {
        return
      }
      pendingTimer = setTimeout(() => {
        pendingTimer = undefined
        if (unmounted || AppState.currentState !== 'active') {
          return
        }
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (unmounted || AppState.currentState !== 'active') {
              return
            }
            void tryUnlockOrPrompt()
          })
        })
      }, 500)
    }
    const cancelPendingConfirm = () => {
      if (pendingTimer) {
        clearTimeout(pendingTimer)
        pendingTimer = undefined
      }
    }

    if (AppState.currentState === 'active') {
      confirmVisibleThenRun()
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        confirmVisibleThenRun()
      } else {
        cancelPendingConfirm()
      }
    })

    return () => {
      unmounted = true
      cancelPendingConfirm()
      subscription.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Only a native login locks; this is a moment's gap while logging out.
  if (!nativeUser) {
    return null
  }

  return (
    <View testID={testIDs.SCREEN_APP_LOCK} style={{ flex: 1 }}>
      <NativeLock
        name={nativeUser.name}
        nationalId={nativeUser.nationalId}
        unlock={nativeUnlock}
        onLogoutPress={handleLogout}
      />
    </View>
  )
}

/**
 * The lock for a native login.
 */
function NativeLock({
  name,
  nationalId,
  unlock,
  onLogoutPress,
}: {
  name: string
  nationalId: string
  unlock: ReturnType<typeof useNativeUnlock>
  onLogoutPress(): void
}) {
  const { authenticationTypes } = useUiStore()
  const isOffline = useIsOffline()
  const biometricType = useBiometricType(authenticationTypes)?.text

  // Electronic ID shows its code in place of the lock while it waits.
  if (unlock.verificationCode !== undefined) {
    return (
      <ElectronicIdConfirmation
        purpose="unlock"
        fullScreen
        verificationCode={unlock.verificationCode}
        onCancelPress={unlock.cancelElectronicId}
      />
    )
  }

  return (
    <DeviceLock
      name={name}
      nationalId={nationalId}
      biometricType={unlock.isBiometricsEnabled ? biometricType : undefined}
      status={
        unlock.status === 'prompting' ||
        unlock.status === 'failed' ||
        unlock.status === 'lockedOut'
          ? unlock.status
          : 'idle'
      }
      electronicIdError={unlock.electronicIdError}
      isOffline={isOffline}
      onBiometricsPress={unlock.unlockWithBiometrics}
      onElectronicIdPress={unlock.unlockWithElectronicId}
      onLogoutPress={onLogoutPress}
    />
  )
}
