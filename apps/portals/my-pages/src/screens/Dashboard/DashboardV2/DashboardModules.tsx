import {
  Box,
  CategoryCard,
  GridColumn,
  GridRow,
  Icon,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m as portalMessages,
  PortalNavigationItem,
} from '@island.is/portals/core'
import { Link } from 'react-router-dom'
import { iconIdMapper, iconTypeToSVG } from '../../../utils/Icons/idMapper'
import * as styles from '../Dashboard.css'

interface Props {
  items: PortalNavigationItem[]
  isMobile: boolean
}

export const DashboardModules = ({ items, isMobile }: Props) => {
  const { formatMessage } = useLocale()

  const getDisabledReasonText = (reason: string, moduleName: string) => {
    switch (reason) {
      case 'notAvailableForActors':
        return formatMessage(
          portalMessages.disabledReasonNotAvailableForActors,
          { moduleName },
        )
      case 'notMinor':
        return formatMessage(portalMessages.disabledReasonNotMinor, {
          moduleName,
        })
      default:
        return formatMessage(portalMessages.disabledReasonDefault, {
          moduleName,
        })
    }
  }

  const onHover = (id: string) => {
    const el: HTMLElement | null | '' =
      id && document.getElementById(iconIdMapper(id))
    el && el.dispatchEvent(new Event('click'))
  }

  return (
    <Box>
      <GridRow>
        {items.map(
          (navRoot, index) =>
            navRoot.path && (
              <GridColumn
                key={
                  typeof navRoot.name === 'string'
                    ? navRoot.name
                    : String(navRoot.name.id ?? index)
                }
                span={['12/12', '6/12', '4/12']}
                paddingBottom={[1, 2, 3]}
              >
                <Box
                  onMouseEnter={() => onHover(navRoot.icon?.icon ?? '')}
                  height="full"
                  flexGrow={1}
                  className={styles.svgOutline}
                >
                  {navRoot.enabled === false && (
                    <Tooltip
                      placement="top"
                      text={getDisabledReasonText(
                        navRoot.disabledReason ?? 'default',
                        formatMessage(navRoot.name),
                      )}
                    >
                      <span className={styles.lock}>
                        <Icon
                          color="blue600"
                          type="outline"
                          icon="lockClosed"
                          size="small"
                        />
                      </span>
                    </Tooltip>
                  )}
                  <CategoryCard
                    autoStack
                    hyphenate
                    truncateHeading
                    component={Link}
                    to={navRoot.path}
                    headingVariant="h4"
                    headingAs="h2"
                    icon={
                      isMobile && navRoot.icon ? (
                        <Icon
                          icon={navRoot.icon.icon}
                          type="outline"
                          color="blue400"
                        />
                      ) : (
                        iconTypeToSVG(navRoot.icon?.icon ?? '') ??
                        (navRoot.icon ? (
                          <Icon
                            icon={navRoot.icon.icon}
                            type="outline"
                            color="blue400"
                          />
                        ) : undefined)
                      )
                    }
                    heading={formatMessage(
                      navRoot.customShortcut?.name ?? navRoot.name,
                    )}
                    text={
                      navRoot.customShortcut?.description
                        ? formatMessage(navRoot.customShortcut.description)
                        : navRoot.description
                        ? formatMessage(navRoot.description)
                        : formatMessage(navRoot.name)
                    }
                  />
                </Box>
              </GridColumn>
            ),
        )}
      </GridRow>
    </Box>
  )
}

export default DashboardModules
