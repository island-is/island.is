import { Box, Hidden, Text } from '@island.is/island-ui/core'
import { useOrganization } from '@island.is/service-portal/graphql'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import { ProviderSlugType } from '../../utils/constants'

type Note = {
  text: string
  linkTitle?: string
  linkUrl?: string
}

interface Props {
  notes?: Note[]
  serviceProviderSlug?: ProviderSlugType
}

export const FootNote = ({ notes, serviceProviderSlug }: Props) => {
  const { data: organization, loading } = useOrganization(serviceProviderSlug)

  return (
    <Box style={{ pageBreakBefore: 'always' }}>
      {notes?.map((item, index) => {
        return (
          <Text
            paddingTop={index === 0 ? 0 : 3}
            variant="small"
            key={`footnote-item-${index}`}
          >
            {item.text}
          </Text>
        )
      })}
      <Hidden above="sm">
        {organization && (
          <Box paddingY={3}>
            <InstitutionPanel
              loading={loading}
              linkHref={organization?.link ?? ''}
              img={organization?.logo?.url ?? ''}
              imgContainerDisplay="block"
              title={organization.title}
            />
          </Box>
        )}
      </Hidden>
    </Box>
  )
}

export default FootNote
