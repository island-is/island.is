import { Box, Button, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useIsMobile } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as linkButtonStyles from '../LinkButton/LinkButton.css'

export const SidebarContactBox = () => {
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()

  return (
    <Box
      borderRadius="large"
      background="purple100"
      border={isMobile ? 'standard' : undefined}
      borderColor="purple200"
      padding={3}
      marginTop={isMobile ? 0 : 3}
    >
      <Box display="flex" alignItems="flexStart" marginBottom={1} columnGap={2}>
        <Icon icon="mail" type="outline" color="purple400" />
        <Text variant={isMobile ? 'h5' : 'h4'} color="purple400">
          {formatMessage(m.sidebarContactBoxTitle)}
        </Text>
      </Box>
      <Text
        variant={isMobile ? 'medium' : 'default'}
        fontWeight="light"
        color="dark400"
        marginBottom={1}
      >
        {formatMessage(m.sidebarContactBoxBody)}
      </Text>
      <Box display="flex" justifyContent="flexEnd">
        <LinkResolver
          className={linkButtonStyles.link}
          href={formatMessage(m.sidebarContactBoxLinkUrl)}
          aria-label={`${formatMessage(
            m.sidebarContactBoxLinkText,
          )} – ${formatMessage(m.sidebarContactBoxTitle)}`}
        >
          <Button
            as="span"
            variant="text"
            size="small"
            unfocusable
            icon="open"
            iconType="outline"
          >
            {formatMessage(m.sidebarContactBoxLinkText)}
          </Button>
        </LinkResolver>
      </Box>
    </Box>
  )
}

export default SidebarContactBox
