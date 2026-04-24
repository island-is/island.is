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

  return (
    <Box display="flex" flexDirection="column" rowGap={[1, 2]}>
      {items.map((item, i) => {
        const isDisabled = item.enabled === false
        const title = formatMessage(item.customShortcut?.name ?? item.name)
        const description = item.customShortcut?.description
          ? formatMessage(item.customShortcut.description)
          : item.featuredDescription
          ? formatMessage(item.featuredDescription)
          : undefined

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
                color="blue400"
                size="medium"
              />
            )
            : (iconTypeToSVG(item.icon.icon) ?? (
              <Icon
                icon={item.icon.icon}
                type="outline"
                color="blue400"
                size="medium"
              />
            ))
          : undefined

        return (
          <Box
            key={typeof item.name === 'string' ? item.name : String(item.name.id ?? i)}
            onMouseEnter={() => onHover(item.icon?.icon ?? '')}
            className={styles.svgOutline}
          >
            {isDisabled && (
              <Tooltip placement="top" text={getDisabledTooltip()}>
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
              component={!isDisabled && item.path ? Link : undefined}
              to={!isDisabled ? item.path : undefined}
              heading={title}
              headingVariant="h4"
              headingAs="h2"
              text={description}
              icon={iconEl}
              customImage={image ? <img src={image} alt="" style={{ height: 110, width: 'auto', display: 'block' }} /> : undefined}
              tags={
                tagDescriptor
                  ? [{ label: formatMessage(tagDescriptor), disabled: true }]
                  : []
              }
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default DashboardFeatured
