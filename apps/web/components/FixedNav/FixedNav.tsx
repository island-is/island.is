import React, { FC, useState } from 'react'
import cn from 'classnames'
import * as styles from './FixedNav.treat'
import {
  GridContainer,
  Box,
  Button,
  FocusableBox,
  Logo,
  Link,
} from '@island.is/island-ui/core'
import SearchInput from '../SearchInput/SearchInput'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { useI18n } from '@island.is/web/i18n'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

export const FixedNav: FC = () => {
  const [show, setShow] = useState<boolean>(false)
  const { activeLocale, t } = useI18n()
  const { linkResolver } = useLinkResolver()

  useScrollPosition(
    ({ prevPos, currPos }) => {
      let px = -600

      if (typeof window !== `undefined`) {
        px = window.innerHeight * -1
      }

      const goingDown = currPos.y < prevPos.y
      const canShow = px > currPos.y

      setShow(canShow && !goingDown)
    },
    [setShow],
    null,
    false,
    150,
  )

  return (
    <div className={cn(styles.wrapper, { [styles.show]: show })}>
      <GridContainer className={styles.container}>
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
          <Link {...linkResolver('homepage')}>
            <FocusableBox marginRight={2}>
              <Logo id="fixed-nav-logo-icon" iconOnly solid={true} />
            </FocusableBox>
          </Link>

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
                autocomplete={true}
                autosuggest={false}
              />
            </Box>
            <Box marginLeft={2}>
              <Button
                variant="ghost"
                colorScheme="negative"
                size="small"
                icon="arrowUp"
                onClick={() => {
                  window.scrollTo(0, 0)
                }}
                aria-label={t.gotoTop}
              />
            </Box>
          </Box>
        </Box>
      </GridContainer>
    </div>
  )
}

export default FixedNav
