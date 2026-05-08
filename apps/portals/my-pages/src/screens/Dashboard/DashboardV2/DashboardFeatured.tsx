import { Box, CategoryCard, Icon, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m as coreMessages,
  PortalNavigationItem,
} from '@island.is/portals/core'
import cn from 'classnames'
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

        // TODO: Update to use the featuredImage when it is available
        const image =
          item.path === '/heilsa' ? './assets/images/jobs.svg' : undefined
        const showImage = !!image && !isMobile

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
            position="relative"
            onMouseEnter={() => onHover(icon?.icon ?? '')}
            // Remove when category card supports no text
            className={cn(styles.svgOutline, {
              [styles.featuredCardNoText]: i >= 2,
              [styles.featuredCardWithImage]: showImage,
            })}
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
              truncateHeading
              hyphenate
              component={item.path ? Link : undefined}
              to={item.path}
              heading={title}
              headingVariant="h4"
              headingAs="h2"
              text={description ?? title}
              icon={iconEl}
              customImage={
                showImage ? (
                  <div className={styles.featuredCardImageWrapper}>
                    <img src={image} alt="" className={styles.featuredCardImage} />
                  </div>
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
