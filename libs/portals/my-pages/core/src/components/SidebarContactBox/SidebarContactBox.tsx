import { Box, Button, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as linkButtonStyles from '../LinkButton/LinkButton.css'

export const SidebarContactBox = () => {
  const { formatMessage } = useLocale()

  return (
    <Box
      borderRadius="large"
      background="purple100"
      padding={3}
      marginTop={[4, 4, 3]}
    >
      <Box display="flex" alignItems="flexStart" marginBottom={1} columnGap={2}>
        <Icon icon="mail" type="outline" color="purple400" />
        <Text variant="h4" color="purple400">
          {formatMessage(m.sidebarContactBoxTitle)}
        </Text>
      </Box>
      <Text variant="default" color="dark400" marginBottom={1}>
        {formatMessage(m.sidebarContactBoxBody)}
      </Text>
      <Box display="flex" justifyContent="flexEnd">
        <LinkResolver
          className={linkButtonStyles.link}
          href={formatMessage(m.sidebarContactBoxLinkUrl)}
        >
          <Button
            as="span"
            variant="text"
            size="small"
            unfocusable
            icon="arrowForward"
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
