import { useUserInfo } from '@island.is/auth/react'
import { Stack, Text } from '@island.is/island-ui/core'


export const RelevantPartiesView = () => {
  const user = useUserInfo()
  console.log(user)
  return (
    <Stack space={2}>
      <Text variant="h2">{user.profile.name}</Text>
      <Text >{user.profile.actor?.name}</Text>
    </Stack>
  )
}
