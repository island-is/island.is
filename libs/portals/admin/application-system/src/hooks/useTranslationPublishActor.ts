import { useUserInfo } from '@island.is/react-spa/bff'

export interface TranslationPublishActor {
  actorName: string
  onBehalfOfName?: string
}

export const useTranslationPublishActor = (): TranslationPublishActor => {
  const userInfo = useUserInfo()
  const profile = userInfo?.profile

  return {
    actorName: profile?.actor?.name ?? profile?.name ?? '',
    onBehalfOfName: profile?.actor ? profile.name : undefined,
  }
}
