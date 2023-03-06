import {
  Box,
  BoxProps,
  SkeletonLoader,
  Tooltip,
} from '@island.is/island-ui/core'
import * as styles from './InstitutionPanel.css'
import React from 'react'

interface InstitutionPanelProps {
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
}: InstitutionPanelProps) => {
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
      >
        <Box display={imgContainerDisplay}>
          {loading ? (
            <SkeletonLoader
              display="block"
              height={64}
              width={64}
              background="purple200"
            />
          ) : (
            <>
              <Box
                component="img"
                alt=""
                src={img ? img : './assets/images/skjaldarmerki.svg'}
                width="full"
                height="full"
              />
              <div className={styles.tooltip}>
                <Tooltip text={tooltipText} />
              </div>
            </>
          )}
        </Box>
      </Box>
    </a>
  )
}

export default InstitutionPanel
