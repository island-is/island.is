import { Href, Redirect, Stack, useRouter } from 'expo-router'
import React, { useEffect } from 'react'

// The tabs, at whichever tab they start on. Typed routes only list the
// tabs' own screens.
const HOME = '/(auth)/(tabs)' as Href

/**
 * A link to a screen the app doesn't have, such as Cognito's return link in
 * testing builds. Goes back to where the person was, or home.
 */
export default function NotFoundScreen() {
  const router = useRouter()
  const canGoBack = router.canGoBack()

  useEffect(() => {
    if (canGoBack) {
      router.back()
    }
  }, [canGoBack, router])

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'none' }} />
      {!canGoBack && <Redirect href={HOME} />}
    </>
  )
}
