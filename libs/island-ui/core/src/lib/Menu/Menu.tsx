import React, { ReactElement, ReactNode, useState } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import { ModalBase, ModalBaseProps } from '../ModalBase/ModalBase'
import { Button } from '../Button/Button'

import * as styles from './Menu.css'
import { Logo } from '../Logo/Logo'
import { Input } from '../Input/Input'
import { Box } from '../Box/Box'
import { Text, getTextStyles } from '../Text/Text'
import Img from './Img'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { useBoxStyles } from '../Box/useBoxStyles'

type RenderLinkObj = {
  className: string
  text: string
  href: any
}

type Link = {
  text: string
  href: any
}

type LinkWithSub = {
  text: string
  href: any
  sub?: Link[]
}

export interface MenuProps {
  /**
   * Unique ID for accessibility purposes
   */
  baseId: string
  /**
   * Element that opens the menu.
   * It will be forwarded necessary props for a11y and event handling.
   */
  menuButton?: ReactElement
  /**
   * Render function for all links, useful for wrapping framework specific routing links
   */
  renderLink?: (settings: RenderLinkObj, closeModal?: () => void) => ReactNode
  /**
   * Render function for Logo, useful for wrapping framework specific routing links
   */
  renderLogo?: (logo: ReactNode, closeModal?: () => void) => ReactNode
  /**
   * Render function search input, useful for rendering custom search
   */
  renderSearch?: (search?: ReactNode, closeModal?: () => void) => ReactNode
  /**
   * Render function for my pages button, useful for adding specific logic to my pages button
   */
  renderMyPagesButton?: (
    myPagesButton: ReactNode,
    closeModal?: () => void,
  ) => ReactNode
  /**
   * Render function for language switch button, useful for adding specific logic to language switch button
   */
  renderLanguageSwitch?: (
    languageSwitch: ReactNode,
    isMobile?: boolean,
  ) => ReactNode
  /**
   * Logo title for accessibility
   */
  logoTitle?: string
  myPagesText?: string
  languageSwitchText?: string
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
  /**
   * Optional cb function that is fired when the modal visibility changes
   */
  onVisibilityChange?: ModalBaseProps['onVisibilityChange']
  renderDisclosure?: ModalBaseProps['renderDisclosure']
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
          {sub.map((link, index) => (
            <Box marginBottom={1} key={index}>
              {link}
            </Box>
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
  onVisibilityChange,
  renderDisclosure,
}: MenuProps) => {
  const [mainLinksCollapsed, setMainLinksCollapsed] = useState(true)
  const fullHeight = useBoxStyles({ component: 'div', height: 'full' })
  const gridContainerStyles = useBoxStyles({
    component: 'div',
    background: 'white',
    height: 'full',
  })

  const myPages = renderMyPagesButton(
    <Button variant="utility" icon="person" as="span">
      {myPagesText}
    </Button>,
  )
  const mainLinksRender = (closeModal: () => void) =>
    mainLinks.map(({ text, href }, index) => (
      <div className={styles.mainLinkOuter} key={index}>
        {renderLink(
          {
            className: cn(getTextStyles({}), styles.mainLink),
            text: text,
            href: href,
          },
          closeModal,
        )}
      </div>
    ))
  return (
    <ModalBase
      baseId={baseId}
      className={styles.container}
      disclosure={menuButton}
      modalLabel="Menu"
      onVisibilityChange={onVisibilityChange}
      renderDisclosure={renderDisclosure}
      backdropWhite
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <GridContainer className={gridContainerStyles}>
          <GridRow className={fullHeight}>
            <GridColumn span={['12/12', '12/12', '6/12', '7/12', '8/12']}>
              <Box
                paddingTop={4}
                paddingRight={[0, 0, 6, 6, 15]}
                paddingBottom={[4, 4, 4, 4, 20]}
                display="flex"
                justifyContent="flexEnd"
                position="relative"
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
                        <Box marginRight={[2, 3]}>
                          {renderLanguageSwitch(
                            <Button variant="utility">
                              {languageSwitchText}
                            </Button>,
                            true,
                          )}
                        </Box>
                      </Box>
                      <Button
                        onClick={closeModal}
                        circle
                        icon="close"
                        colorScheme="light"
                      />
                    </Box>
                    <Box
                      marginTop={[5, 5, 0]}
                      className={styles.searchContainer}
                    >
                      {renderSearch(
                        <Input
                          placeholder="Leitaðu á Ísland.is"
                          backgroundColor="blue"
                          size="sm"
                          name="search"
                          icon="search"
                          iconType="outline"
                        />,
                        closeModal,
                      )}
                    </Box>
                  </Box>
                  <Box marginTop={9} display={['none', 'none', 'block']}>
                    <Text variant="h3" marginBottom={2}>
                      {mainTitle}
                    </Text>
                    <div className={styles.mainLinkContainer}>
                      {mainLinksRender(closeModal)}
                    </div>
                  </Box>
                  <Box marginTop={7} display={['block', 'block', 'none']}>
                    <Box
                      display="flex"
                      justifyContent="spaceBetween"
                      alignItems="center"
                    >
                      <Box
                        className={getTextStyles({ variant: 'h3' })}
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
                        onClick={() =>
                          setMainLinksCollapsed(!mainLinksCollapsed)
                        }
                      />
                    </Box>
                    <AnimateHeight
                      duration={300}
                      height={mainLinksCollapsed ? 0 : 'auto'}
                      id="mainLinks"
                    >
                      {mainLinksRender(closeModal)}
                    </AnimateHeight>
                  </Box>
                </div>
                <Box className={styles.bg}>
                  <Img />
                </Box>
              </Box>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '6/12', '5/12', '4/12']}>
              <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                height="full"
              >
                <Box
                  paddingTop={4}
                  paddingBottom={6}
                  paddingLeft={[0, 0, 6, 6, 12]}
                  className={styles.asideTop}
                  flexGrow={1}
                >
                  <Box
                    display={['none', 'none', 'flex']}
                    justifyContent="spaceBetween"
                  >
                    <Box display="flex">
                      <Box marginRight={2}>{myPages}</Box>
                      {renderLanguageSwitch(
                        <Button variant="utility">{languageSwitchText}</Button>,
                      )}
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
                          link={renderLink(
                            {
                              className: cn(
                                getTextStyles({
                                  variant: 'h3',
                                  color: 'blue600',
                                }),
                                styles.asideLink,
                              ),
                              text: text,
                              href: href,
                            },
                            closeModal,
                          )}
                          sub={sub.map((link) =>
                            renderLink(
                              {
                                className: cn(
                                  getTextStyles({
                                    variant: 'small',
                                    color: 'blue600',
                                  }),
                                  styles.asideLink,
                                ),
                                ...link,
                              },
                              closeModal,
                            ),
                          )}
                        />
                      ) : (
                        <Box key={index} marginBottom={[5, 5, 3]}>
                          {renderLink(
                            {
                              className: cn(
                                getTextStyles({
                                  variant: 'h3',
                                  color: 'blue600',
                                }),
                                styles.asideLink,
                              ),
                              text: text,
                              href: href,
                            },
                            closeModal,
                          )}
                        </Box>
                      ),
                    )}
                  </Box>
                </Box>
                <Box
                  paddingTop={5}
                  paddingBottom={6}
                  paddingLeft={[0, 0, 6, 6, 12]}
                  className={styles.asideBottom}
                  flexGrow={1}
                >
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
                      {renderLink(
                        {
                          className: cn(
                            getTextStyles({
                              variant: 'small',
                              color: 'blue600',
                            }),
                            styles.asideLink,
                          ),
                          ...link,
                        },
                        closeModal,
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
    </ModalBase>
  )
}

export default Menu
