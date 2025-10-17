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
  withLessSpace = false,
}: {
  slug: string
  title: string
  intro: string
  withLessSpace?: boolean
}) => {
  return (
    // Adjust margin bottom for presidential as it comes with the action drawer
    <Box marginBottom={withLessSpace ? 3 : 8}>
      <IntroWrapper
        title={title}
        intro={intro}
        serviceProviderSlug={providerSlug}
      />
      {slug && <ShareLink slug={slug} />}
    </Box>
  )
}

export default Intro
