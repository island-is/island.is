import {
  Box,
  GridColumn,
  GridRow,
  Icon,
  Inline,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import type {
  ActionCardProps,
  IconMapIcon,
} from '@island.is/island-ui/core/types'
import { isDefined } from '@island.is/shared/utils'

import { BaseProps } from './InfoCard'
import * as styles from './InfoCard.css'

const eyebrowColor = 'blueberry600'

export type DetailedProps = BaseProps & {
  logo?: string
  logoAlt?: string
  subEyebrow?: string
  subDescription?: string
  //max 5 lines
  detailLines?: Array<{
    icon: IconMapIcon
    text: string
  }>
  tags?: Array<ActionCardProps['tag']>
}

export const DetailedInfoCard = ({
  title,
  description,
  size = 'medium',
  eyebrow,
  subEyebrow,
  subDescription,
  detailLines,
  tags,
  logo,
  logoAlt,
}: DetailedProps) => {
  const renderLogo = () => {
    if (!logo) {
      return null
    }

    return (
      <Box style={{ flex: '0 0 48px' }}>
        <img height={48} src={logo} alt={logoAlt} />
      </Box>
    )
  }

  const renderDetails = () => {
    if (!detailLines?.length) {
      return null
    }

    return (
      <Box marginTop={2}>
        <Stack space={1}>
          {detailLines?.slice(0, 5).map((d, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection={'row'}
              alignItems="center"
              className={styles.iconBox}
            >
              <Icon
                icon={d.icon}
                size="medium"
                type="outline"
                color="blue400"
              />
              <Box marginLeft={2}>
                <Text variant="small">{d.text}</Text>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    )
  }

  const renderTags = () => {
    if (!tags?.length) {
      return null
    }

    return (
      <Inline space={1}>
        {tags
          .map((tag, index) => {
            if (!tag) {
              return null
            }
            return (
              <Tag
                outlined
                key={`${tag.label}-${index}`}
                disabled
                variant={tag.variant}
              >
                {tag.label}
              </Tag>
            )
          })
          .filter(isDefined)}
      </Inline>
    )
  }

  const renderHeader = () => {
    return (
      <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
        {subEyebrow ? (
          <Box>
            <Text fontWeight="semiBold" variant="eyebrow" color={eyebrowColor}>
              {eyebrow}
            </Text>
            <Text fontWeight="light" variant="eyebrow" color={eyebrowColor}>
              {subEyebrow}
            </Text>
          </Box>
        ) : (
          <Text variant="eyebrow" color={eyebrowColor}>
            {eyebrow}
          </Text>
        )}
        {renderLogo()}
      </Box>
    )
  }

  const renderContent = () => {
    if (size === 'large') {
      return (
        <GridRow direction="row">
          <GridColumn span="8/12">
            <Text variant="h3" color="blue400">
              {title}
            </Text>
            {description && (
              <Box flexGrow={1} marginTop={1}>
                <Text variant="medium" fontWeight="light">
                  {description}
                </Text>
              </Box>
            )}
            {subDescription && (
              <Box flexGrow={1} marginTop={description ? 3 : 1}>
                <Text variant="small" fontWeight="regular">
                  {subDescription}
                </Text>
              </Box>
            )}
          </GridColumn>
          <GridColumn span="4/12">{renderDetails()}</GridColumn>
        </GridRow>
      )
    }
    return (
      <Box marginTop={2}>
        <Text variant="h3" color="blue400">
          {title}
        </Text>
        {description && (
          <Box marginTop={1}>
            <Text variant="medium" fontWeight="light">
              {description}
            </Text>
          </Box>
        )}
        {subDescription && (
          <Box flexGrow={1} marginTop={description ? 2 : 1}>
            <Text variant="small" fontWeight="regular">
              {subDescription}
            </Text>
          </Box>
        )}
        {renderDetails()}
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      flexDirection="column"
      height="full"
    >
      <div>
        {renderHeader()}
        {renderContent()}
      </div>
      <Box marginTop={3} display="flex" justifyContent="spaceBetween">
        {renderTags()}
      </Box>
    </Box>
  )
}
