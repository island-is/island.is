import { Box } from '@island.is/island-ui/core'
import {
  IntroWrapper,
  THJODSKRA_SLUG as providerSlug,
} from '@island.is/portals/my-pages/core'
import ShareLink from '../ShareLink'

const Intro = ({
  slug,
  title,
  intro,
}: {
  slug: string
  title: string
  intro: string
}) => {
  return (
    <Box marginBottom={8}>
      <IntroWrapper
        title={title}
        intro={intro}
        serviceProviderSlug={providerSlug}
      />
      <ShareLink slug={slug} />
    </Box>
  )
}

export default Intro
