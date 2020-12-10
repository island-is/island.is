import { Button, Menu as MenuUI, Link } from '@island.is/island-ui/core'
import { useI18n } from 'apps/web/i18n'
import React, { FC } from 'react'
import { SearchInput } from '..'
import { LanguageToggler } from '../LanguageToggler'
import { AnchorAttributes } from 'apps/web/i18n/routes'

interface MegaMenuLink {
  href: AnchorAttributes
  text: string
  sub?: [MegaMenuLink]
}

interface Props {
  asideTopLinks: MegaMenuLink[]
  asideBottomTitle: string
  asideBottomLinks: MegaMenuLink[]
  mainTitle: string
  mainLinks: MegaMenuLink[]
}

export const Menu: FC<Props> = ({
  asideTopLinks,
  asideBottomTitle,
  asideBottomLinks,
  mainTitle,
  mainLinks,
}) => {
  const { activeLocale, t } = useI18n()
  return (
    <MenuUI
      baseId="Menu"
      mainLinks={mainLinks}
      asideTopLinks={asideTopLinks}
      asideBottomLinks={asideBottomLinks}
      mainTitle={mainTitle}
      asideBottomTitle={asideBottomTitle}
      myPagesText={t.login}
      menuButton={
        <Button variant="utility" icon="menu">
          {t.menuCaption}
        </Button>
      }
      renderLink={({ className, text, href }, closeModal) => {
        return (
          <Link {...href} onClick={closeModal}>
            <a className={className}>{text}</a>
          </Link>
        )
      }}
      renderMyPagesButton={(button) => {
        return <Link href="//minarsidur.island.is/">{button}</Link>
      }}
      renderLanguageSwitch={() => <LanguageToggler />}
      renderSearch={(input, closeModal) => (
        <SearchInput
          id="search_input_menu"
          size="medium"
          activeLocale={activeLocale}
          placeholder={t.searchPlaceholder}
          autocomplete={true}
          autosuggest={false}
          onRouting={closeModal}
        />
      )}
    />
  )
}

/*const mainLinks = [
  { text: 'Akstur og bifreiðar', href: { href: 'test', as: 'test1' } },
  {
    text: 'Atvinnurekstur og sjálfstætt starfandi',
    href: { href: 'test', as: 'test1' },
  },
  { text: 'Dómstólar og réttarfar', href: { href: 'test', as: 'test1' } },
  { text: 'Fjármál og skattar', href: { href: 'test', as: 'test1' } },
  { text: 'Fjölskylda og velferð', href: { href: 'test', as: 'test1' } },
  { text: 'Heilbrigðismál', href: { href: 'test', as: 'test1' } },
  { text: 'Húsnæðismál', href: { href: 'test', as: 'test1' } },
  { text: 'Iðnaður', href: { href: 'test', as: 'test1' } },
  { text: 'Innflytjendamál', href: { href: 'test', as: 'test1' } },
  {
    text: 'Launþegi, réttindi og lífeyrir',
    href: { href: 'test', as: 'test1' },
  },
  { text: 'Málefni fatlaðs fólks', href: { href: 'test', as: 'test1' } },
  { text: 'Menntun', href: { href: 'test', as: 'test1' } },
  { text: 'Neytendamál', href: { href: 'test', as: 'test1' } },
  { text: 'Samfélag og réttindi', href: { href: 'test', as: 'test1' } },
  { text: 'Samgöngur', href: { href: 'test', as: 'test1' } },
  { text: 'Umhverfismál', href: { href: 'test', as: 'test1' } },
  {
    text: 'Vegabréf, ferðalög og búseta erlendis',
    href: { href: 'test', as: 'test1' },
  },
  { text: 'Vörur og þjónusta Ísland.is', href: { href: 'test', as: 'test1' } },
]*/
