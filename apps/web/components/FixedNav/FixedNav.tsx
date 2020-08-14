import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './FixedNav.treat'
import { ContentBlock, Box, Icon, Button } from '@island.is/island-ui/core'
import SearchInput from '../SearchInput/SearchInput'

interface FixedNavProps {}

export const FixedNav: FC<FixedNavProps> = () => (
  <Box className={styles.container} paddingY={1} paddingX={3}>
    <ContentBlock>
      <Box
        display="flex"
        height="full"
        width="full"
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

export default FixedNav
