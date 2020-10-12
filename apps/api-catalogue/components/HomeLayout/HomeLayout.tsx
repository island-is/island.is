import React, { ReactNode } from 'react';
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use';
import { Box, ContentBlock, Columns, Column } from '@island.is/island-ui/core';
import { theme } from '@island.is/island-ui/theme';

interface PropTypes {
  left: ReactNode
  right?: ReactNode
}

function HomeLayout({ left, right }: PropTypes) {

  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    //if (width < 771) {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <Box paddingX="gutter">
      <ContentBlock>
        <Columns align="right" space="gutter">
          <Column width={isMobile ? "11/12" : "6/12"}>{left}</Column>
          <Column width={isMobile ? "content" : "5/12"}>
            <Box paddingLeft={[0, 0, 0, 8, 15]} width="full">
              {right}
            </Box>
          </Column>
        </Columns>
      </ContentBlock>
    </Box>
  )
}

export default HomeLayout
