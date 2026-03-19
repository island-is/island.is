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
  /**
   * Single tag shown top-right. Used in the default `'side'` variant.
   * In the `'bottom'` variant prefer `tags` for multiple tags, but `tag`
   * will be treated as a single-element array if `tags` is not provided.
   */
  tag?: SupportMaintenanceCardTag
  /**
   * Multiple tags. In the `'bottom'` variant these appear bottom-left,
   * horizontally inline with the CTA button.
   */
  tags?: SupportMaintenanceCardTag[]
  cta?: SupportMaintenanceCardCta
  /**
   * `'side'`   – tag top-right, CTA below it (default, original layout).
   * `'bottom'` – tags bottom-left, CTA bottom-right on the same row.
   */
  variant?: 'side' | 'bottom'
}

const Cta = ({ cta }: { cta: SupportMaintenanceCardCta }) =>
  cta.href ? (
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
  )

export const SupportMaintenanceCard = ({
  logo,
  logoAlt = '',
  heading,
  text,
  tag,
  tags,
  cta,
  variant = 'side',
}: SupportMaintenanceCardProps) => {
  const resolvedTags: SupportMaintenanceCardTag[] = tags ?? (tag ? [tag] : [])

  const logoAndHeading = (
    <Box display="flex" flexDirection="row" alignItems="center" columnGap={1}>
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
  )

  if (variant === 'bottom') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        borderColor="blue200"
        borderRadius="large"
        borderWidth="standard"
        paddingX={[3, 3, 4]}
        paddingY={3}
        background="white"
        rowGap={1}
      >
        {logoAndHeading}
        {text && <Text>{text}</Text>}
        {(resolvedTags.length > 0 || cta) && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            alignItems="center"
            paddingTop={1}
          >
            <Box
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              style={{ gap: '0.5rem' }}
            >
              {resolvedTags.map((t) => (
                <Tag key={t.label} variant={t.variant ?? 'blue'} disabled>
                  {t.label}
                </Tag>
              ))}
            </Box>
            {cta && (
              <Box flexShrink={0} marginLeft={3}>
                <Cta cta={cta} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    )
  }

  // variant === 'side' (original layout)
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
        {logoAndHeading}
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
            <Cta cta={cta} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
