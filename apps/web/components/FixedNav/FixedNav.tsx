import React, { FC, useState } from 'react'
import cn from 'classnames'
import * as styles from './FixedNav.treat'
import { ContentBlock, Box, Icon, Button } from '@island.is/island-ui/core'
import SearchInput from '../SearchInput/SearchInput'
import { useScrollPosition } from '../../hooks/useScrollPosition'

export const FixedNav: FC = () => {
  const [show, setShow] = useState<boolean>(false)

  useScrollPosition(
    ({ currPos }) => {
      setShow(-100 > currPos.y)
    },
    [setShow],
    null,
    false,
    150,
  )

  return (
    <Box className={cn(styles.container, { [styles.show]: show })}>
      <ContentBlock>
        <Box
          paddingX={[3, 3, 6]}
          paddingY={1}
          width="full"
          display="flex"
          height="full"
          flexDirection="row"
          alignItems="center"
          justifyContent="spaceBetween"
        >
          <Box>
            <Icon type="logo" color="white" width="30" />
          </Box>
          <Box
            display="flex"
            height="full"
            width="full"
            flexDirection="row"
            alignItems="center"
            justifyContent="flexEnd"
          >
            <Box>
              <SearchInput
                size="medium"
                activeLocale="is"
                placeholder="Leitaðu á Ísland.is"
                autocomplete={false}
              />
            </Box>
            <Box marginLeft={2}>
              <Button
                variant="menu"
                icon="arrowRight"
                onClick={() => {
                  window.scrollTo(0, 0)
                }}
              />
            </Box>
          </Box>
        </Box>
      </ContentBlock>
    </Box>
  )
}

export default FixedNav
