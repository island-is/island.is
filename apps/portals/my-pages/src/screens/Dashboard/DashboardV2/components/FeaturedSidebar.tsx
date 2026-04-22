import { Box, Icon, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m as coreMessages,
  PortalNavigationItem,
} from '@island.is/portals/core'
import { Link } from 'react-router-dom'

interface Props {
  items: PortalNavigationItem[]
}

export const FeaturedSidebar = ({ items }: Props) => {
  const { formatMessage } = useLocale()

  if (!items.length) return null

  return (
    <Box display="flex" flexDirection="column" rowGap={[1, 2]}>
      {items.map((item, i) => {
        const title = formatMessage(item.customShortcut?.name ?? item.name)
        const description = item.customShortcut?.description
          ? formatMessage(item.customShortcut.description)
          : item.description
          ? formatMessage(item.description)
          : undefined

        const isDisabled = item.enabled === false

        const getDisabledTooltip = () => {
          const name = formatMessage(item.name)
          switch (item.disabledReason) {
            case 'notAvailableForActors':
              return formatMessage(
                coreMessages.disabledReasonNotAvailableForActors,
                { moduleName: name },
              )
            case 'notMinor':
              return formatMessage(coreMessages.disabledReasonNotMinor, {
                moduleName: name,
              })
            default:
              return formatMessage(coreMessages.disabledReasonDefault, {
                moduleName: name,
              })
          }
        }

        const cardContent = (
          <Box
            borderRadius="large"
            borderWidth="standard"
            borderColor="blue200"
            paddingY={3}
            paddingX={4}
          >
            <Box
              display="flex"
              alignItems="center"
              columnGap={1}
              marginBottom={description ? 1 : 0}
            >
              {item.icon && (
                <Icon
                  icon={item.icon.icon}
                  type="outline"
                  color={isDisabled ? 'dark300' : 'blue400'}
                  size="medium"
                />
              )}
              <Text
                variant="h4"
                as="h2"
                color={isDisabled ? 'dark300' : 'blue400'}
              >
                {title}
              </Text>
              {isDisabled && (
                <Icon
                  icon="lockClosed"
                  type="outline"
                  color="dark300"
                  size="small"
                />
              )}
            </Box>
            {description && (
              <Text variant="small" color="dark400">
                {description}
              </Text>
            )}
          </Box>
        )

        if (isDisabled) {
          return (
            <Tooltip
              key={(item.path ?? '') + i}
              placement="top"
              text={getDisabledTooltip()}
            >
              <Box>{cardContent}</Box>
            </Tooltip>
          )
        }

        return (
          <Link
            key={(item.path ?? '') + i}
            to={item.path ?? ''}
            style={{ textDecoration: 'none' }}
          >
            {cardContent}
          </Link>
        )
      })}
    </Box>
  )
}

export default FeaturedSidebar
