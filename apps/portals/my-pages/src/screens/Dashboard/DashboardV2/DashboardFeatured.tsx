import { Box, CategoryCard, Icon, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m as coreMessages,
  PortalNavigationItem,
} from '@island.is/portals/core'
import { Link } from 'react-router-dom'
import { iconIdMapper, iconTypeToSVG } from '../../../utils/Icons/idMapper'
import * as styles from '../Dashboard.css'

interface Props {
  items: PortalNavigationItem[]
  isMobile: boolean
}

export const DashboardFeatured = ({ items, isMobile }: Props) => {
  const { formatMessage } = useLocale()

  if (!items.length) return null

  const onHover = (id: string) => {
    const el: HTMLElement | null | '' =
      id && document.getElementById(iconIdMapper(id))
    el && el.dispatchEvent(new Event('click'))
  }

  const getDisabledTooltip = (
    disabledReason: string | undefined,
    name: string,
  ) => {
    switch (disabledReason) {
      case 'notAvailableForActors':
        return formatMessage(coreMessages.disabledReasonNotAvailableForActors, {
          moduleName: name,
        })
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

  return (
    <Box display="flex" flexDirection="column" rowGap={[1, 2]}>
      {items.map((item, i) => {
        const isDisabled = item.enabled === false
        const title = formatMessage(item.customShortcut?.name ?? item.name)
        const description = item.customShortcut?.description
          ? formatMessage(item.customShortcut.description)
          : item.description
          ? formatMessage(item.description)
          : undefined

        const image = item.featuredImage

        const icon = item.icon
        const iconEl = icon ? (
          isMobile ? (
            <Icon
              icon={icon.icon}
              type="outline"
              color="blue400"
              size="medium"
            />
          ) : (
            iconTypeToSVG(icon.icon) ?? (
              <Icon
                icon={icon.icon}
                type="outline"
                color="blue400"
                size="medium"
              />
            )
          )
        ) : undefined

        return (
          <Box
            key={
              typeof item.name === 'string'
                ? item.name
                : String(item.name.id ?? i)
            }
            onMouseEnter={() => onHover(icon?.icon ?? '')}
            className={styles.svgOutline}
          >
            {isDisabled && (
              <Tooltip
                placement="top"
                text={getDisabledTooltip(
                  item.disabledReason,
                  formatMessage(item.name),
                )}
              >
                <span className={styles.lock}>
                  <Icon
                    icon="lockClosed"
                    type="outline"
                    color="blue600"
                    size="small"
                  />
                </span>
              </Tooltip>
            )}
            <CategoryCard
              component={item.path ? Link : undefined}
              to={item.path}
              heading={title}
              headingVariant="h4"
              headingAs="h2"
              text={description ?? title}
              icon={iconEl}
              customImage={
                image && !isMobile ? (
                  <img
                    src={image}
                    alt=""
                    className={styles.featuredCardImage}
                  />
                ) : undefined
              }
              tags={[]}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default DashboardFeatured
