import { FC, PropsWithChildren } from 'react'

import { Box, LinkV2, Text } from '@island.is/island-ui/core'

import { link } from '../../MarkdownWrapper/MarkdownWrapper.css'

interface RenderItemProps {
  breakSpaces: boolean
}

const RenderItem: FC<PropsWithChildren<RenderItemProps>> = (props) => (
  <Box display={props.breakSpaces ? 'block' : 'flex'} component="span">
    {props.children}
  </Box>
)

const RenderPersonalData = (
  name?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  breakSpaces = true,
) => (
  <Box
    display={breakSpaces ? 'block' : ['block', 'block', 'block', 'flex']}
    dataTestId="personalInfo"
    component="p"
  >
    {name && (
      <RenderItem breakSpaces={breakSpaces}>
        <Text as="span" whiteSpace="pre">{`${name}${
          (email || phoneNumber) && !breakSpaces ? `, ` : ''
        }`}</Text>
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
