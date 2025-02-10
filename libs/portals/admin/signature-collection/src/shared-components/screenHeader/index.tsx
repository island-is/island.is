import { Box, Breadcrumbs } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'

const ScreenHeader = ({
  electionName,
  intro,
  image,
}: {
  electionName: string
  intro: string
  image?: string
}) => {
  return (
    <Box>
      <Box marginBottom={3}>
        <Breadcrumbs
          items={[
            {
              title: electionName,
            },
          ]}
        />
      </Box>
      <IntroHeader
        title={electionName}
        intro={intro}
        imgPosition="right"
        imgHiddenBelow="sm"
        img={image}
      />
    </Box>
  )
}

export default ScreenHeader
