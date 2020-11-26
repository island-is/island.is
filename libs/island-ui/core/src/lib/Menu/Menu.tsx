import React, { ReactElement, ReactNode, useState } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import { ModalBase } from '../ModalBase/ModalBase'
import { Button } from '../Button/Button'

import * as styles from './Menu.treat'
import { Logo } from '../Logo/Logo'
import { Input } from '../Input/Input'
import { Box } from '../Box/Box'
import { Text, useTextStyles } from '../Text/Text'

type RenderLinkObj = {
  className: string
  text: string
  href: string
}

type Link = {
  text: string
  href: string
}

type LinkWithSub = {
  text: string
  href: string
  sub?: Link[]
}

export interface MenuProps {
  /**
   * Unique ID for accessibility purposes
   */
  baseId: string
  /**
   * Element that opens the menu.
   * It will be forwarded neccessery props for a11y and event handling.
   */
  menuButton?: ReactElement
  /**
   * Render function for all links, usefull for wraping framework specific routing links
   */
  renderLink?: (settings: RenderLinkObj) => ReactNode
  /**
   * Render function for Logo, usefull for wraping framework specific routing links
   */
  renderLogo?: (logo: ReactNode) => ReactNode
  /**
   * Render function search input, useful for rendering custom search
   */
  renderSearch?: (search: ReactNode) => ReactNode
  /**
   * Render function for my pages button, useful for adding specific logic to my pages button
   */
  renderMyPagesButton?: (myPagesButton: ReactNode) => ReactNode
  /**
   * Render function for language switch button, useful for adding specific logic to language switch button
   */
  renderLanguageSwitch?: (languageSwitch: ReactNode) => ReactNode
  /**
   * Logo title for accessibility
   */
  logoTitle?: string
  myPagesText: string
  languageSwitchText: string
  /**
   * Main section title
   */
  mainTitle: string
  /**
   * Main section links
   */
  mainLinks: Link[]
  /**
   * Aside top section links
   */
  asideTopLinks: LinkWithSub[]
  /**
   * Aside bottom section title
   */
  asideBottomTitle: string
  /**
   * Aside bottom section links
   */
  asideBottomLinks: Link[]
}

const defaultRenderLinks = ({ text, href, className }: RenderLinkObj) => (
  <a href={href} className={className}>
    {text}
  </a>
)

const defaultRenderLogo: MenuProps['renderLogo'] = (logo) => logo
const defaultRenderSearch: MenuProps['renderSearch'] = (search) => search
const defaultRenderMyPagesButton: MenuProps['renderMyPagesButton'] = (button) =>
  button
const defaultRenderLanguageSwitch: MenuProps['renderLanguageSwitch'] = (
  languageSwitch,
) => languageSwitch

const AsideTopLinkWithSub = ({
  link,
  sub,
  id,
}: {
  link: ReactNode
  sub: ReactNode[]
  id: string | number
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={[isCollapsed ? 3 : 5, isCollapsed ? 3 : 5, 3]}
      >
        <Box marginRight={4}>{link}</Box>
        <Button
          circle
          colorScheme="negative"
          icon={isCollapsed ? 'add' : 'remove'}
          aria-expanded={!isCollapsed}
          aria-controls={`AsideTopLink-${id}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </Box>
      <AnimateHeight
        duration={300}
        height={isCollapsed ? 0 : 'auto'}
        id={`AsideTopLink-${id}`}
      >
        <Box
          paddingLeft={2}
          borderLeftWidth="standard"
          borderColor="blue200"
          marginBottom={[5, 5, 3]}
        >
          {sub.map((link) => (
            <Box marginBottom={1}>{link}</Box>
          ))}
        </Box>
      </AnimateHeight>
    </>
  )
}

export const Menu = ({
  baseId,
  menuButton,
  renderLink = defaultRenderLinks,
  renderLogo = defaultRenderLogo,
  renderSearch = defaultRenderSearch,
  renderMyPagesButton = defaultRenderMyPagesButton,
  renderLanguageSwitch = defaultRenderLanguageSwitch,
  logoTitle,
  myPagesText,
  languageSwitchText,
  mainTitle,
  mainLinks,
  asideTopLinks,
  asideBottomTitle,
  asideBottomLinks,
}: MenuProps) => {
  const [mainLinksCollapsed, setMainLinksCollapsed] = useState(true)

  const myPages = renderMyPagesButton(
    <Button variant="utility" icon="person">
      {myPagesText}
    </Button>,
  )
  const languageSwitch = renderLanguageSwitch(
    <Button variant="utility">{languageSwitchText}</Button>,
  )
  const mainLinksRender = mainLinks.map(({ text, href }, index) => (
    <div className={styles.mainLinkOuter} key={index}>
      {renderLink({
        className: cn(useTextStyles({}), styles.mainLink),
        text: text,
        href: href,
      })}
    </div>
  ))
  return (
    <ModalBase
      baseId={baseId}
      className={styles.container}
      disclosure={menuButton}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <>
          <Box
            paddingTop={[6, 6, 8]}
            paddingRight={[3, 3, 6, 6, 15]}
            paddingBottom={4}
            paddingLeft={[3, 3, 6]}
            className={styles.main}
            display="flex"
            justifyContent="flexEnd"
          >
            <div className={styles.mainContainer}>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="center"
                flexWrap={['wrap', 'wrap', 'nowrap']}
              >
                {renderLogo(
                  <>
                    <Box
                      display={['block', 'block', 'block', 'none']}
                      marginRight={[1, 4]}
                    >
                      <Logo width={40} iconOnly title={logoTitle} />
                    </Box>
                    <Box
                      display={['none', 'none', 'none', 'block']}
                      marginRight={4}
                    >
                      <Logo width={160} title={logoTitle} />
                    </Box>
                  </>,
                )}
                <Box
                  display={['flex', 'flex', 'none']}
                  justifyContent="flexEnd"
                  alignItems="center"
                >
                  <Box display="flex">
                    <Box marginRight={[1, 2]}>{myPages}</Box>
                    <Box marginRight={[2, 3]}>{languageSwitch}</Box>
                  </Box>
                  <Button
                    onClick={closeModal}
                    circle
                    icon="close"
                    colorScheme="light"
                  />
                </Box>
                <Box marginTop={[5, 5, 0]} className={styles.searchContainer}>
                  {renderSearch(
                    <Input
                      placeholder="Leitaðu á Ísland.is"
                      backgroundColor="blue"
                      size="sm"
                      name="search"
                      icon="search"
                      iconType="outline"
                    />,
                  )}
                </Box>
              </Box>
              <Box marginTop={9} display={['none', 'none', 'block']}>
                <Text variant="h3" marginBottom={2}>
                  {mainTitle}
                </Text>
                <div className={styles.mainLinkContainer}>
                  {mainLinksRender}
                </div>
              </Box>
              <Box marginTop={7} display={['block', 'block', 'none']}>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                >
                  <Box
                    className={useTextStyles({ variant: 'h3' })}
                    marginBottom={2}
                    marginRight={4}
                  >
                    {mainTitle}
                  </Box>
                  <Button
                    circle
                    colorScheme="light"
                    icon={mainLinksCollapsed ? 'add' : 'remove'}
                    aria-expanded={!mainLinksCollapsed}
                    aria-controls="mainLinks"
                    onClick={() => setMainLinksCollapsed(!mainLinksCollapsed)}
                  />
                </Box>
                <AnimateHeight
                  duration={300}
                  height={mainLinksCollapsed ? 0 : 'auto'}
                  id="mainLinks"
                >
                  {mainLinksRender}
                </AnimateHeight>
              </Box>
            </div>
          </Box>
          <div className={styles.aside}>
            <Box
              paddingTop={8}
              paddingRight={[3, 3, 3, 6]}
              paddingBottom={6}
              paddingLeft={[3, 3, 3, 6, 12]}
              className={styles.asideTop}
            >
              <div className={styles.asideContainer}>
                <Box
                  display={['none', 'none', 'flex']}
                  justifyContent="spaceBetween"
                >
                  <Box display="flex">
                    <Box marginRight={2}>{myPages}</Box>
                    {languageSwitch}
                  </Box>
                  <Button
                    onClick={closeModal}
                    circle
                    icon="close"
                    colorScheme="negative"
                  />
                </Box>
                <Box marginTop={[0, 0, 9]}>
                  {asideTopLinks.map(({ text, href, sub }, index) =>
                    sub && sub.length > 0 ? (
                      <AsideTopLinkWithSub
                        key={index}
                        id={index}
                        link={renderLink({
                          className: cn(
                            useTextStyles({ variant: 'h3', color: 'blue600' }),
                            styles.asideLink,
                          ),
                          text: text,
                          href: href,
                        })}
                        sub={sub.map((link) =>
                          renderLink({
                            className: cn(
                              useTextStyles({
                                variant: 'small',
                                color: 'blue600',
                              }),
                              styles.asideLink,
                            ),
                            ...link,
                          }),
                        )}
                      />
                    ) : (
                      <Box marginBottom={[5, 5, 3]}>
                        {renderLink({
                          className: cn(
                            useTextStyles({ variant: 'h3', color: 'blue600' }),
                            styles.asideLink,
                          ),
                          text: text,
                          href: href,
                        })}
                      </Box>
                    ),
                  )}
                </Box>
              </div>
            </Box>
            <Box
              paddingTop={5}
              paddingRight={[3, 3, 3, 6]}
              paddingBottom={6}
              paddingLeft={[3, 3, 3, 6, 12]}
              className={styles.asideBottom}
            >
              <div className={styles.asideContainer}>
                <Text color="blue600" variant="eyebrow">
                  {asideBottomTitle}
                </Text>
                <Box
                  borderTopWidth="standard"
                  borderColor="blue300"
                  marginTop={3}
                  marginBottom={3}
                />
                {asideBottomLinks.map((link, index) => (
                  <Box marginBottom={2} key={index}>
                    {renderLink({
                      className: cn(
                        useTextStyles({ variant: 'small', color: 'blue600' }),
                        styles.asideLink,
                      ),
                      ...link,
                    })}
                  </Box>
                ))}
              </div>
            </Box>
          </div>
        </>
      )}
    </ModalBase>
  )
}

export default Menu
