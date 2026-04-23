import { Box, Icon, Tag, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m as coreMessages,
  PortalNavigationItem,
} from '@island.is/portals/core'
import { Link } from 'react-router-dom'
import { iconIdMapper, iconTypeToSVG } from '../../../../utils/Icons/idMapper'
import * as styles from '../../Dashboard.css'

interface Props {
  items: PortalNavigationItem[]
  isMobile: boolean
}

export const FeaturedSidebar = ({ items, isMobile }: Props) => {
  const { formatMessage } = useLocale()

  if (!items.length) return null

  const onHover = (id: string) => {
    const el: HTMLElement | null | '' =
      id && document.getElementById(iconIdMapper(id))
    el && el.dispatchEvent(new Event('click'))
  }

  return (
    <Box display="flex" flexDirection="column" rowGap={[1, 2]}>
      {items.map((item, i) => {
        const isDisabled = item.enabled === false
        const title = formatMessage(item.customShortcut?.name ?? item.name)
        const description = item.customShortcut?.description
          ? formatMessage(item.customShortcut.description)
          : item.description
          ? formatMessage(item.description)
          : formatMessage(item.name)

        const image = item.customShortcut?.image ?? item.featuredImage
        const tagDescriptor = item.customShortcut?.tag ?? item.featuredTag

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

        const iconEl = item.icon
          ? isMobile
            ? (
              <Icon
                icon={item.icon.icon}
                type="outline"
                color={isDisabled ? 'dark300' : 'blue400'}
                size="medium"
              />
            )
            : (iconTypeToSVG(item.icon.icon) ?? (
              <Icon
                icon={item.icon.icon}
                type="outline"
                color={isDisabled ? 'dark300' : 'blue400'}
                size="medium"
              />
            ))
          : undefined

        const cardContent = (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            borderRadius="large"
            borderWidth="standard"
            borderColor="blue200"
            paddingY={2}
            paddingX={3}
            background="white"
            overflow="hidden"
            height="full"
          >
            <Box display="flex" flexDirection="column" flexGrow={1}>
              <Box
                display="flex"
                alignItems="center"
                columnGap={1}
                marginBottom={1}
              >
                {iconEl && (
                  <Box className={styles.featuredCardIcon}>
                    {iconEl}
                  </Box>
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
              <Text paddingTop={1}>{description}</Text>
              {tagDescriptor && (
                <Box paddingTop={3}>
                  <Tag outlined variant="blue">
                    {formatMessage(tagDescriptor)}
                  </Tag>
                </Box>
              )}
            </Box>
            {image && (
              <Box
                flexShrink={0}
                marginLeft={2}
                display="flex"
                alignItems="center"
              >
                <img
                  src={image}
                  alt=""
                  style={{ height: 110, width: 'auto', display: 'block' }}
                />
              </Box>
            )}
          </Box>
        )

        const card = (
          <Box
            key={(item.path ?? '') + i}
            onMouseEnter={() => onHover(item.icon?.icon ?? '')}
            className={styles.svgOutline}
            height="full"
          >
            {!isDisabled && item.path ? (
              <Link
                to={item.path}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                {cardContent}
              </Link>
            ) : (
              cardContent
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
              <Box>{card}</Box>
            </Tooltip>
          )
        }

        return card
      })}
    </Box>
  )
}

export default FeaturedSidebar
