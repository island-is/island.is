import React, { useRef } from 'react'

import {
  Box,
  Button,
  ButtonTypes,
  Link,
  Menu as MenuUI,
} from '@island.is/island-ui/core'
import { ProjectBasePath } from '@island.is/shared/constants'
import { SearchInput } from '@island.is/web/components'
import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'

import { LanguageToggler } from '../LanguageToggler'

interface MegaMenuLink {
  href: LinkResolverResponse
  text: string
  dataTestId: string
  sub?: [MegaMenuLink]
}

interface Props {
  asideTopLinks: MegaMenuLink[]
  asideBottomTitle: string
  asideBottomLinks: MegaMenuLink[]
  mainLinks: MegaMenuLink[]
  buttonColorScheme?: ButtonTypes['colorScheme']
  onMenuOpen?: () => void
}

const minarsidurLink = `${ProjectBasePath.ServicePortal}/`

export const Menu = ({
  asideTopLinks,
  asideBottomTitle,
  asideBottomLinks,
  mainLinks,
  buttonColorScheme = 'default',
  onMenuOpen,
}: Props) => {
  const searchInput = useRef<HTMLInputElement>()
  const { activeLocale, t } = useI18n()

  return (
    <MenuUI
      baseId="Menu"
      mainLinks={mainLinks.map((item) => ({
        ...item,
        dataTestId: 'mega-menu-link',
      }))}
      asideTopLinks={asideTopLinks}
      asideBottomLinks={asideBottomLinks}
      mainTitle={t.serviceCategories}
      asideBottomTitle={asideBottomTitle}
      myPagesText={t.login}
      renderDisclosure={(
        disclosureDefault,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        { onClick, ...disclosureProps },
      ) => {
        return (
          <Box display="flex">
            <Box marginRight={1} display={['block', 'block', 'block', 'none']}>
              <Button
                {...disclosureProps}
                colorScheme={buttonColorScheme}
                variant="utility"
                icon="search"
                value={t.search}
                onClick={(e) => {
                  onClick(e)
                  setTimeout(() => {
                    if (searchInput.current) {
                      searchInput.current.focus()
                    }
                  }, 100)
                }}
              />
            </Box>
            {disclosureDefault}
          </Box>
        )
      }}
      renderLogo={(logo, closeModal) => (
        <Link
          href={activeLocale === 'en' ? '/en' : '/'}
          onClick={() => {
            closeModal?.()
          }}
        >
          <div>{logo}</div>
        </Link>
      )}
      menuButton={
        <Button
          variant="utility"
          icon="menu"
          colorScheme={buttonColorScheme}
          data-testid="frontpage-burger-button"
          onClick={onMenuOpen}
        >
          {t.menuCaption}
        </Button>
      }
      renderLink={({ className, text, href }, closeModal) => {
        return (
          <Link href={href} onClick={closeModal}>
            <span className={className}>{text}</span>
          </Link>
        )
      }}
      renderMyPagesButton={(button) => {
        return (
          <a tabIndex={-1} href={minarsidurLink}>
            {button}
          </a>
        )
      }}
      renderLanguageSwitch={(isMobile) => (
        <LanguageToggler
          dialogId={
            isMobile ? 'menu-language-toggle-mobile' : 'menu-language-toggle'
          }
        />
      )}
      renderSearch={(input, closeModal) => (
        <SearchInput
          id="search_input_menu"
          size="medium"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          ref={searchInput}
          activeLocale={activeLocale}
          placeholder={t.searchPlaceholder}
          autocomplete={true}
          autosuggest={false}
          onRouting={closeModal}
          skipContext
        />
      )}
    />
  )
}
