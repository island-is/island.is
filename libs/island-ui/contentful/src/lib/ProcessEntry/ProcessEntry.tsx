import { FC } from 'react'
import {
  Text,
  Button,
  Box,
  Link,
  ButtonProps,
  ButtonTypes,
  BoxProps,
} from '@island.is/island-ui/core'
import IframeModal from '../IframeModal/IframeModal'

import * as styles from './ProcessEntry.css'

export interface ProcessEntryProps {
  processTitle: string
  processLink: string
  openLinkInModal?: boolean
  buttonText: string
  /**
   * render process entry fixed to bottom of screen in a react portal
   */
  fixed?: boolean
  newTab?: boolean
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
  newTab = true,
  ...buttonProps
}) => {
  const button = (
    <Button icon="open" iconType="outline" nowrap {...buttonProps}>
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
    <Link href={processLink} newTab={newTab} skipTab>
      {button}
    </Link>
  )
}

export const ProcessEntry: FC<React.PropsWithChildren<ProcessEntryProps>> = ({
  processTitle,
  processLink,
  openLinkInModal,
  buttonText,
  fixed,
  newTab = true,
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
      background="blue100"
      display="flex"
      justifyContent="spaceBetween"
      {...(fixed ? fixedProps : defaultProps)}
    >
      <Box marginRight={fixed ? 2 : [0, 2]} marginBottom={fixed ? 0 : [3, 0]}>
        <Text variant={fixed ? 'eyebrow' : 'h3'} color="blue600">
          {processTitle}
        </Text>
      </Box>
      <ProcessEntryLinkButton
        processTitle={processTitle}
        processLink={processLink}
        openLinkInModal={openLinkInModal}
        buttonText={buttonText}
        newTab={newTab}
      />
    </Box>
  )
}

export default ProcessEntry
