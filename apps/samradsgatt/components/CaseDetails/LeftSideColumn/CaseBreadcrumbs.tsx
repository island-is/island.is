import { Box, Breadcrumbs } from '@island.is/island-ui/core'
import { useLocation } from 'react-use'

interface CaseBreadcrumbsProps {
  caseNumber: string
}

const CaseBreadcrumbs = ({ caseNumber }: CaseBreadcrumbsProps) => {
  const location = useLocation()
  return (
    <Box paddingY={3}>
      <Breadcrumbs
        items={[
          { title: 'Öll mál', href: '/samradsgatt' },
          { title: caseNumber, href: location.href },
        ]}
      />
    </Box>
  )
}

export default CaseBreadcrumbs
