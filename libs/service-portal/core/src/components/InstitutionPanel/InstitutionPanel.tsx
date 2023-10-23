import {
  Box,
  BoxProps,
  SkeletonLoader,
  Tooltip,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './InstitutionPanel.css'
import React from 'react'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

interface InstitutionPanelProps {
  title?: string
  img?: string
  linkHref: string
  imgContainerDisplay?: BoxProps['display']
  loading?: boolean
  backgroundColor?: 'purple100' | 'blue100' | 'white'
  tooltipText?: string
}

export const InstitutionPanel = ({
  img,
  linkHref,
  imgContainerDisplay,
  loading = false,
  backgroundColor = 'purple100',
  tooltipText,
  title,
}: InstitutionPanelProps) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  return (
    <a
      href={linkHref}
      target="_blank"
      rel="noreferrer noopener"
      className={styles.link}
    >
      <Box
        background={backgroundColor}
        borderRadius="large"
        padding={2}
        display="flex"
        alignItems="center"
        height={isMobile ? undefined : 'full'}
        width="full"
        position="relative"
      >
        <Box width="full" height="full" display={imgContainerDisplay}>
          {loading ? (
            <SkeletonLoader
              display="block"
              height={64}
              width={64}
              background="purple200"
            />
          ) : (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                component="img"
                alt=""
                src={img ? img : './assets/images/skjaldarmerki.svg'}
                width={isMobile ? undefined : 'full'}
                height={isMobile ? undefined : 'full'}
                marginRight={isMobile ? 2 : 0}
                className={isMobile && styles.image}
              />
              {title && (
                <Text variant="h4" as="p" color="purple600" lineHeight="xl">
                  {title}
                </Text>
              )}
              {tooltipText && (
                <div className={styles.tooltip}>
                  <Tooltip placement="bottom" text={tooltipText} />
                </div>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </a>
  )
}

export default InstitutionPanel
