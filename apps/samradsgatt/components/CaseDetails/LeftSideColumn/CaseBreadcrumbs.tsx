import { Box, Breadcrumbs } from '@island.is/island-ui/core'

const CaseBreadcrumbs = () => {
  return (
    <Box paddingY={3}>
      <Breadcrumbs
        items={[
          { title: 'Breadcrumb', href: '/' },
          { title: 'Breadcrumb', href: '/' },
          { title: 'Breadcrumb', href: '/' },
        ]}
      />
    </Box>
  )
}

export default CaseBreadcrumbs
