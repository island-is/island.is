import { Box, Breadcrumbs } from '@island.is/island-ui/core'
import { useLocation } from 'react-use'

const AboutBreadcrumbs = () => {
  const location = useLocation()
  return (
    <Box paddingY={3}>
      <Breadcrumbs
        items={[
          { title: 'Samráðsgátt', href: '/samradsgatt' },
          { title: 'Um samráðsgátt', href: location.href },
        ]}
      />
    </Box>
  )
}

export default AboutBreadcrumbs
