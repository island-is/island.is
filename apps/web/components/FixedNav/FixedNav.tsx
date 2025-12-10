import React, { useState } from 'react'
import cn from 'classnames'

import {
  Box,
  FocusableBox,
  GridContainer,
  Hidden,
  Icon,
  Logo,
} from '@island.is/island-ui/core'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'

import { useScrollPosition } from '../../hooks/useScrollPosition'
import SearchInput from '../SearchInput/SearchInput'
import * as styles from './FixedNav.css'

interface Props {
  organizationSearchFilter?: string
}

export const FixedNav = ({ organizationSearchFilter }: Props) => {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    null,
    false,
    150,
  )

  return (
    <div className={cn(styles.wrapper, { [styles.show]: show })}>
      <GridContainer className={styles.container}>
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
          <FocusableBox
            href={linkResolver('homepage').href}
            marginRight={[1, 1, 1, 2]}
          >
            <Box className={styles.logo}>
              <Hidden above="sm">
                <Logo
                  id="fixed-nav-logo-icon1"
                  width={24}
                  height={24}
                  solid={true}
                  iconOnly
                />
              </Hidden>
              <Hidden below="md">
                <Logo
                  id="fixed-nav-logo-icon2"
                  width={32}
                  height={32}
                  solid={true}
                  iconOnly
                />
              </Hidden>
            </Box>
          </FocusableBox>

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
                organization={organizationSearchFilter}
              />
            </Box>
            <Box marginLeft={[1, 1, 1, 2]}>
              <button
                className={styles.arrowButton}
                onClick={() => {
                  window.scrollTo(0, 0)
                }}
                aria-label={t.gotoTop}
              >
                <Icon icon="arrowUp" color="white" />
              </button>
            </Box>
          </Box>
        </Box>
      </GridContainer>
    </div>
  )
}

export default FixedNav
