import React, { FC, useState } from 'react'
import cn from 'classnames'
import * as styles from './FixedNav.treat'
import { ContentBlock, Box, Icon, Button } from '@island.is/island-ui/core'
import SearchInput from '../SearchInput/SearchInput'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { useI18n } from '@island.is/web/i18n'

export const FixedNav: FC = () => {
  const [show, setShow] = useState<boolean>(false)
  const { activeLocale, t } = useI18n()

  useScrollPosition(
    ({ prevPos, currPos }) => {
      if (prevPos.y > currPos.y) {
        setShow(false)
      } else {
        setShow(-100 > currPos.y)
      }
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
          paddingX={[2, 2, 6]}
          paddingY={1}
          width="full"
          display="flex"
          height="full"
          flexDirection="row"
          alignItems="center"
          justifyContent="spaceBetween"
        >
          <Box marginRight={2}>
            <Icon type="logo" color="white" height="40" />
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
                id="search_input_fixed_nav"
                white
                size="medium"
                activeLocale={activeLocale}
                placeholder={t.searchPlaceholder}
                autocomplete={false}
              />
            </Box>
            <Box marginLeft={2}>
              <Button
                white
                variant="menu"
                icon="arrowUp"
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
