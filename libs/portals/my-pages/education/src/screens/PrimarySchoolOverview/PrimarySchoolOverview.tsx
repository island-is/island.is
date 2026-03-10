import { IntroWrapper, MMS_SLUG } from '@island.is/portals/my-pages/core'
import { useNamespaces } from '@island.is/localization'
import { Box, SkeletonLoader, Stack, Text } from '@island.is/island-ui/core'
import { primarySchoolMessages as psm } from '../../lib/messages'

export const PrimarySchoolOverview = () => {
  useNamespaces('sp.education-primary-school')

  return (
    <IntroWrapper
      title={psm.overviewTitle}
      intro={psm.overviewIntro}
      serviceProviderSlug={MMS_SLUG}
    >
      <Box marginTop={4}>
        <Stack space={2}>
          <SkeletonLoader height={24} width={300} />
          <SkeletonLoader height={24} width={260} />
          <SkeletonLoader height={24} width={280} />
          <SkeletonLoader height={24} width={240} />
        </Stack>
        <Box marginTop={4}>
          <Text variant="h4" as="h2">
            Grunnupplýsingar koma bráðlega
          </Text>
        </Box>
      </Box>
    </IntroWrapper>
  )
}

export default PrimarySchoolOverview
