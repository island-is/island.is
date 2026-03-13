import { Box, Button, Tag, Text } from '@island.is/island-ui/core'
import type { TagVariant } from '@island.is/island-ui/core'
import { LinkButton } from '@island.is/portals/my-pages/core'
import * as styles from './SupportMaintenanceCard.css'

interface SupportMaintenanceCardTag {
  label: string
  variant?: TagVariant
}

interface SupportMaintenanceCardCta {
  label: string
  href?: string
  onClick?: () => void
}

export interface SupportMaintenanceCardProps {
  /** URL of the organisation/service logo shown on the left. */
  logo?: string
  /** Alt text for the logo image. Defaults to empty string (decorative). */
  logoAlt?: string
  heading: string
  text?: string
  tag?: SupportMaintenanceCardTag
  cta?: SupportMaintenanceCardCta
}

export const SupportMaintenanceCard = ({
  logo,
  logoAlt = '',
  heading,
  text,
  tag,
  cta,
}: SupportMaintenanceCardProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="spaceBetween"
      alignItems="flexStart"
      borderColor="blue200"
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      background="white"
    >
      {/* Left content */}
      <Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          columnGap={1}
        >
          {logo && (
            <img
              src={logo}
              alt={logoAlt}
              className={styles.logo}
              aria-hidden={!logoAlt}
            />
          )}
          <Text variant="h3" as="h2">
            {heading}
          </Text>
        </Box>
        {text && <Text paddingTop={1}>{text}</Text>}
      </Box>

      {/* Right content: tag + cta */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flexEnd"
        justifyContent="spaceBetween"
        flexShrink={0}
        marginLeft={3}
        style={{ minHeight: tag && cta ? 56 : undefined }}
      >
        {tag && (
          <Tag variant={tag.variant ?? 'purple'} disabled>
            {tag.label}
          </Tag>
        )}
        {cta && (
          <Box marginTop={tag ? 2 : 0}>
            {cta.href ? (
              <LinkButton
                to={cta.href}
                text={cta.label}
                variant="text"
                icon="arrowForward"
                size="small"
              />
            ) : (
              <Button
                variant="text"
                size="small"
                icon="arrowForward"
                iconType="filled"
                onClick={cta.onClick}
              >
                {cta.label}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
