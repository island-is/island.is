import { Button, Menu as MenuUI, Link } from '@island.is/island-ui/core'
import { useI18n } from 'apps/web/i18n'
import React, { FC } from 'react'
import { SearchInput } from '..'
import { LanguageToggler } from '../LanguageToggler'

interface Props {}

export const Menu: FC<Props> = () => {
  const { activeLocale, t } = useI18n()
  return (
    <MenuUI
      baseId="Menu"
      mainLinks={mainLinks}
      asideTopLinks={asideTopLinks}
      asideBottomLinks={asideBottomLinks}
      mainTitle="Þjónustuflokkar"
      asideBottomTitle="Aðrir opinberir vefir"
      myPagesText={t.login}
      menuButton={
        <Button variant="utility" icon="menu">
          {t.menuCaption}
        </Button>
      }
      renderLink={({ className, text, href }, closeModal) => {
        return (
          <Link href={href} onClick={closeModal}>
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

const mainLinks = [
  { text: 'Akstur og bifreiðar', href: '#' },
  { text: 'Atvinnurekstur og sjálfstætt starfandi', href: '#' },
  { text: 'Dómstólar og réttarfar', href: '#' },
  { text: 'Fjármál og skattar', href: '#' },
  { text: 'Fjölskylda og velferð', href: '#' },
  { text: 'Heilbrigðismál', href: '#' },
  { text: 'Húsnæðismál', href: '#' },
  { text: 'Iðnaður', href: '#' },
  { text: 'Innflytjendamál', href: '#' },
  { text: 'Launþegi, réttindi og lífeyrir', href: '#' },
  { text: 'Málefni fatlaðs fólks', href: '#' },
  { text: 'Menntun', href: '#' },
  { text: 'Neytendamál', href: '#' },
  { text: 'Samfélag og réttindi', href: '#' },
  { text: 'Samgöngur', href: '#' },
  { text: 'Umhverfismál', href: '#' },
  { text: 'Vegabréf, ferðalög og búseta erlendis', href: '#' },
  { text: 'Vörur og þjónusta Ísland.is', href: '#' },
]

const asideTopLinks = [
  { text: 'Stofnanir', href: '#' },
  { text: 'Stafrænt Ísland', href: '#' },
  {
    text: 'Þróun',
    href: '#',
    sub: [
      { text: 'Viskuausan', href: '#' },
      { text: 'Ísland UI', href: '#' },
      { text: 'Hönnunarkerfi', href: '#' },
      { text: 'Efnisstefna', href: '#' },
    ],
  },
  {
    text: 'Upplýsingarsvæði',
    href: '#',
    sub: [
      {
        text: 'linkur á eitthvað',
        href: '#',
      },
    ],
  },
]

const asideBottomLinks = [
  { text: 'Heilsuvera', href: '#' },
  { text: 'Samráðsgátt', href: '#' },
  { text: 'Mannanöfn', href: '#' },
  { text: 'Undirskriftarlistar', href: '#' },
  { text: 'Opin gögn', href: '#' },
  { text: 'Opinber nýsköpun', href: '#' },
  { text: 'Tekjusagan', href: '#' },
]
