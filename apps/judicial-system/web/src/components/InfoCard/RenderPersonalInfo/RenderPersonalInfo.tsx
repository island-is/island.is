import { FC, PropsWithChildren } from 'react'

import { Box, LinkV2, Text } from '@island.is/island-ui/core'

import IconButton from '../../IconButton/IconButton'
import { link } from '../../MarkdownWrapper/MarkdownWrapper.css'

interface RenderItemProps {
  breakSpaces: boolean
}

const RenderItem: FC<PropsWithChildren<RenderItemProps>> = (props) => (
  <Box display={props.breakSpaces ? 'block' : 'inlineBlock'} component="span">
    {props.children}
  </Box>
)

const RenderPersonalData = ({
  name,
  email,
  phoneNumber,
  breakSpaces = true,
  onClick,
}: {
  name?: string | null
  email?: string | null
  phoneNumber?: string | null
  breakSpaces?: boolean
  onClick?: () => void
} = {}) => (
  <Box dataTestId="personalInfo" component="span">
    {name && (
      <RenderItem breakSpaces={breakSpaces}>
        <Text as="span" whiteSpace="pre">
          <Box display="flex" alignItems="center">
            {`${name}${(email || phoneNumber) && !breakSpaces ? `, ` : ''}`}
            {onClick && (
              <span style={{ marginLeft: '4px' }}>
                <IconButton
                  icon="pencil"
                  colorScheme="transparent"
                  onClick={onClick}
                />
              </span>
            )}
          </Box>
        </Text>
      </RenderItem>
    )}
    {email && (
      <RenderItem breakSpaces={breakSpaces}>
        <LinkV2 href={`mailto:${email}`} className={link} key={email}>
          <Text as="span" whiteSpace="pre">
            {email}
          </Text>
        </LinkV2>
        {phoneNumber && <Text as="span" whiteSpace="pre">{`, `}</Text>}
      </RenderItem>
    )}
    {phoneNumber && (
      <RenderItem breakSpaces={breakSpaces}>
        <Text key={phoneNumber} whiteSpace="pre" as="span">
          {`s. ${phoneNumber}`}
        </Text>
      </RenderItem>
    )}
  </Box>
)

export default RenderPersonalData
