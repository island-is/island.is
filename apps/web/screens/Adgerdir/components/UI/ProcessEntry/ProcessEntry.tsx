import React, { FC } from 'react'
import { Text, Box, Link, BoxProps } from '@island.is/island-ui/core'
import { IframeModal } from '@island.is/island-ui/contentful'
import { Button, ButtonProps, ButtonTypes } from '../Button/Button'

import * as covidStyles from '../styles/styles.css'
import * as styles from './ProcessEntry.css'

export const Titles: {
  [Digital: string]: { is: string; en: string }
} = {
  Digital: { is: 'Stafræn umsókn', en: 'Digital application' },
  'Digital w/login': {
    is: 'Aðgangsstýrð stafræn umsókn',
    en: 'Digital application with access control',
  },
  'Not digital': { is: 'Handvirk umsókn', en: 'Manual application' },
  'Not digital w/login': {
    is: 'Handvirk umsókn með innskráningu',
    en: 'Manual application with access control',
  },
  'No type': { is: '', en: '' },
}

export interface ProcessEntryProps {
  processTitle: string
  processLink: string
  openLinkInModal?: boolean
  buttonText: string
  /**
   * render process entry fixed to bottom of screen in a react portal
   */
  fixed?: boolean
}

export const ProcessEntryLinkButton: FC<
  React.PropsWithChildren<
    Omit<ProcessEntryProps, 'type'> & ButtonProps & ButtonTypes
  >
> = ({
  processTitle,
  buttonText,
  processLink,
  openLinkInModal,
  ...buttonProps
}) => {
  const button = (
    <Button icon="open" iconType="outline" {...buttonProps}>
      {buttonText}
    </Button>
  )

  return openLinkInModal ? (
    <IframeModal
      title={processTitle}
      baseId="process-entry-modal-iframe"
      disclosure={button}
      src={processLink}
    />
  ) : (
    <Link href={processLink}>{button}</Link>
  )
}

export const ProcessEntry: FC<React.PropsWithChildren<ProcessEntryProps>> = ({
  processTitle,
  processLink,
  openLinkInModal,
  buttonText,
  fixed,
}) => {
  const fixedProps: BoxProps = {
    position: 'fixed',
    bottom: 0,
    paddingY: 2,
    paddingX: 5,
    className: styles.fixedContainer,
    alignItems: 'center',
    flexDirection: 'row',
  }
  const defaultProps: BoxProps = {
    borderRadius: 'large',
    paddingY: 4,
    paddingX: [3, 3, 3, 3, 4],
    alignItems: ['flexStart', 'center'],
    flexDirection: ['column', 'row'],
  }
  return (
    <Box
      width="full"
      className={styles.box}
      display="flex"
      justifyContent="spaceBetween"
      {...(fixed ? fixedProps : defaultProps)}
    >
      <Box marginRight={fixed ? 2 : [0, 2]} marginBottom={fixed ? 0 : [3, 0]}>
        <Text variant={fixed ? 'eyebrow' : 'h3'} color="blue600">
          <span className={covidStyles.text}>{processTitle}</span>
        </Text>
      </Box>
      <ProcessEntryLinkButton
        processTitle={processTitle}
        processLink={processLink}
        openLinkInModal={openLinkInModal}
        buttonText={buttonText}
      />
    </Box>
  )
}

export default ProcessEntry
