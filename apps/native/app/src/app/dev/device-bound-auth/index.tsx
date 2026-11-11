import { Href, useRouter } from 'expo-router'
import React from 'react'
import { Image, ScrollView } from 'react-native'

import { PressableHighlight } from '@/components/pressable-highlight/pressable-highlight'
import { TableViewCell, TableViewGroup } from '@/ui'
import chevronForward from '@/ui/assets/icons/chevron-forward.png'

const screens: Array<{ title: string; subtitle: string; href: Href }> = [
  {
    title: 'A · Log in again',
    subtitle: 'After the update, for people who used a PIN',
    href: '/dev/device-bound-auth/preview?variant=relogin',
  },
  {
    title: 'B1 · Lock screen',
    subtitle: 'Buttons run the real biometric prompt',
    href: '/dev/device-bound-auth/preview?variant=lock',
  },
  {
    title: 'B2 · Biometric prompt',
    subtitle: 'Buttons disabled while the prompt is up',
    href: '/dev/device-bound-auth/preview?variant=lock&status=prompting',
  },
  {
    title: 'B3 · Biometrics failed or cancelled',
    subtitle: 'Error above the user card',
    href: '/dev/device-bound-auth/preview?variant=lock&status=failed',
  },
  {
    title: 'B4 · No biometrics',
    subtitle: 'Electronic ID is the only way in',
    href: '/dev/device-bound-auth/preview?variant=lock-electronic-id-only',
  },
  {
    title: 'B5 · Electronic ID, waiting for approval',
    subtitle: 'Opening the app',
    href: '/dev/device-bound-auth/electronic-id?purpose=unlock',
  },
  {
    title: 'C1 · Onboarding biometrics without PIN',
    subtitle: 'Existing onboarding screen, new copy',
    href: '/dev/device-bound-auth/preview?variant=onboarding',
  },
  {
    title: 'C3 · Turning on biometrics needs electronic ID',
    subtitle: 'From security settings',
    href: '/dev/device-bound-auth/electronic-id?purpose=enableBiometrics',
  },
  {
    title: 'D0 · Welcome',
    subtitle: 'Testing app: debug panel instead of the illustration',
    href: '/dev/device-bound-auth/login?variant=welcome',
  },
  {
    title: 'D0 · Welcome, store build',
    subtitle: 'With the illustration. Login flows on to D1 and D2',
    href: '/dev/device-bound-auth/login?variant=welcome&debug=off',
  },
  {
    title: 'D1 · Phone number',
    subtitle: 'The other button switches to kennitala',
    href: '/dev/device-bound-auth/login?variant=identifier',
  },
  {
    title: 'D1 · Kennitala (Auðkennisapp)',
    subtitle: 'Not in the designs yet',
    href: '/dev/device-bound-auth/login?variant=identifier&method=app',
  },
  {
    title: 'D2 · Security number',
    subtitle: 'Full screen, while logging in',
    href: '/dev/device-bound-auth/login?variant=waiting',
  },
]

export default function DeviceBoundAuthPreviews() {
  const router = useRouter()

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <TableViewGroup>
        {screens.map(({ title, subtitle, href }) => (
          <PressableHighlight key={title} onPress={() => router.push(href)}>
            <TableViewCell
              title={title}
              subtitle={subtitle}
              accessory={
                <Image
                  source={chevronForward}
                  style={{ width: 24, height: 24 }}
                />
              }
            />
          </PressableHighlight>
        ))}
      </TableViewGroup>
    </ScrollView>
  )
}
