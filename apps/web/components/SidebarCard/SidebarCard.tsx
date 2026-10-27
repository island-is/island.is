import { ProfileCard, Stack } from '@island.is/island-ui/core'
import { STICKY_NAV_MAX_WIDTH_LG } from '@island.is/web/constants'
import { SidebarCard as Card } from '@island.is/web/graphql/schema'

const DEFAULT_SIDEBAR_CARD_IMAGE_URL =
  'https://images.ctfassets.net/8k0h54kbe6bj/6jpT5mePCNk02nVrzVLzt2/6adca7c10cc927d25597452d59c2a873/bitmap.png'

interface SidebarCardProps {
  sidebarCard: Card
  showImage?: boolean
}

export const SidebarCard = ({
  sidebarCard,
  showImage = false,
}: SidebarCardProps) => (
  <ProfileCard
    title={sidebarCard.title}
    description={sidebarCard.contentString}
    link={sidebarCard.link ?? undefined}
    image={
      showImage
        ? `${
            sidebarCard.image?.url || DEFAULT_SIDEBAR_CARD_IMAGE_URL
          }?w=${STICKY_NAV_MAX_WIDTH_LG}`
        : undefined
    }
    size="small"
  />
)

interface SidebarCardsProps {
  cards: Card[]
  showImages?: boolean
}

export const SidebarCards = ({
  cards,
  showImages = false,
}: SidebarCardsProps) => (
  <Stack space={3}>
    {cards.map((card) => (
      <SidebarCard key={card.id} sidebarCard={card} showImage={showImages} />
    ))}
  </Stack>
)
