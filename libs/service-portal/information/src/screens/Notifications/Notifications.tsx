import { Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FootNote,
  IntroHeader,
  m,
  ISLANDIS_SLUG,
} from '@island.is/service-portal/core'

import { spmm } from '../../lib/messages'
import { ActionCard } from '@island.is/service-portal/core'
import { InformationPaths } from '../../lib/paths'

const UserNotifications = () => {
  useNamespaces('sp.notifications')
  const { formatMessage } = useLocale()

  return (
    <>
      <IntroHeader
        title={m.myInfo}
        intro={spmm.userInfoDesc}
        serviceProviderSlug={ISLANDIS_SLUG}
        serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
      />

      <Stack space={2}>
        <ActionCard
          heading="Ný tilkynning"
          text="Ég mæli með að skoða þessa tilkynningu. Hún er rosaleg."
          backgroundColor="blueberry"
          image={{
            type: 'image',
            url: 'https://images.ctfassets.net/8k0h54kbe6bj/3EumKpWqbPFygVWxWteoW/2961b0d9c162e8528e5771ab1707a368/Samgongustofa-stakt-400-400.png',
          }}
          cta={{
            label: formatMessage(m.seeDetails),
            variant: 'text',
            url: InformationPaths.NotificationDetail.replace(':id', '123'),
          }}
        />
        <ActionCard
          heading="Gömul tilkynning"
          text="Þessi er lesin."
          cta={{
            label: formatMessage(m.seeDetails),
            variant: 'text',
            url: InformationPaths.NotificationDetail.replace(':id', '456'),
          }}
        />
        <FootNote serviceProviderSlug={ISLANDIS_SLUG} />
      </Stack>
    </>
  )
}
export default UserNotifications
