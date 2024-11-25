import {
  Box,
  GridColumn,
  GridRow,
  Text,
  Button,
} from '@island.is/island-ui/core'
import Link from 'next/link'

import img from '../../../assets/images/educationLicense.svg'
import { useI18n } from '@island.is/web/i18n'
import { useLinkResolver } from '@island.is/web/hooks'

interface ContactBannerProps {
  slug?: string
  cantFindWhatYouAreLookingForText: string
  howCanWeHelpText: string
  contactUsText: string
}

const ContactBanner = ({
  slug,
  cantFindWhatYouAreLookingForText,
  howCanWeHelpText,
  contactUsText,
}: ContactBannerProps) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  const link = linkResolver('servicewebcontact', [
    slug || (activeLocale === 'en' ? 'digital-iceland' : 'stafraent-island'),
  ]).href

  return (
    <Box background="purple100" padding={[7, 10, 10]} borderRadius="large">
      <GridRow>
        <GridColumn span={['8/8', '6/8', '5/8']} order={[2, 1]}>
          <Text variant="h3" as="h3" marginBottom={2}>
            {cantFindWhatYouAreLookingForText}
          </Text>
          <Text variant="intro" marginBottom={[5, 10]}>
            {howCanWeHelpText}
          </Text>
          <Link href={link} legacyBehavior>
            <Button type="button" variant="ghost" icon="arrowForward">
              {contactUsText}
            </Button>
          </Link>
        </GridColumn>
        <GridColumn
          span={['8/8', '2/8']}
          offset={['0', '0', '1/8']}
          order={[2, 1]}
        >
          <Box textAlign={['center', 'right']} padding={[6, 0]}>
            <img src={img} alt="" />
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default ContactBanner
