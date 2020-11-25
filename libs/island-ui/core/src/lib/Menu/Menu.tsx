import React, { ReactElement, useState } from 'react'
import { ModalBase } from '../ModalBase/ModalBase'
import { Button } from '../Button/Button'

import * as styles from './Menu.treat'
import { Logo } from '../Logo/Logo'
import { Input } from '../Input/Input'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'

/* eslint-disable-next-line */
export interface MenuProps {
  /**
   * Unique ID for accessibility purposes
   */
  baseId: string
}

export const Menu = ({ baseId }: MenuProps) => {
  const [hideDemo, setHideDemo] = useState(false)

  return (
    <ModalBase
      baseId={baseId}
      className={styles.container}
      disclosure={<Button>Open</Button>}
      initialVisibility
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <>
          <Box
            paddingTop={8}
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
              >
                <Box display={['none', 'none', 'none', 'block']}>
                  <Logo width={160} />
                </Box>
                <Box
                  display={['block', 'block', 'block', 'none']}
                  marginRight={2}
                >
                  <Logo width={26} iconOnly />
                </Box>
                <Input
                  placeholder="Leitaðu á Ísland.is"
                  backgroundColor="blue"
                  size="sm"
                  name="search"
                  icon="search"
                  iconType="outline"
                />
              </Box>
              <Box marginTop={9}>
                <Text variant="h3" marginBottom={2}>
                  Þjónustuflokkar
                </Text>
                <Box
                  display="flex"
                  flexDirection={['column', 'column', 'column', 'row']}
                >
                  <Box
                    paddingLeft={2}
                    borderLeftWidth="standard"
                    borderColor="blue200"
                    flexGrow={1}
                  >
                    <Text marginBottom={2}>Akstur og bifreiðar</Text>
                    <Text marginBottom={2}>
                      Atvinnurekstur og sjálfstætt starfandi
                    </Text>
                    <Text marginBottom={2}>Dómstólar og réttarfar</Text>
                    <Text marginBottom={2}>Fjármál og skattar</Text>
                    <Text marginBottom={2}>Fjölskylda og velferð</Text>
                    <Text marginBottom={2}>Heilbrigðismál</Text>
                    <Text marginBottom={2}>Húsnæðismál</Text>
                    <Text marginBottom={2}>Iðnaður</Text>
                    <Text marginBottom={2}>Innflytjendamál</Text>
                    <Text marginBottom={2}>Launþegi, réttindi og lífeyrir</Text>
                    <Text marginBottom={2}>Málefni fatlaðs fólks</Text>
                    <Text>Menntun</Text>
                  </Box>
                  <Box marginLeft={[0, 0, 0, 3]} flexGrow={1}>
                    <Box
                      paddingLeft={2}
                      borderLeftWidth="standard"
                      borderColor="blue200"
                    >
                      <Text marginBottom={2}>Neytendamál</Text>
                      <Text marginBottom={2}>Samfélag og réttindi</Text>
                      <Text marginBottom={2}>Samgöngur</Text>
                      <Text marginBottom={2}>Umhverfismál</Text>
                      <Text marginBottom={2}>
                        Vegabréf, ferðalög og búseta erlendis
                      </Text>
                      <Text>Vörur og þjónusta Ísland.is</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </div>
          </Box>
          <div className={styles.aside}>
            <Box
              paddingTop={8}
              paddingRight={[3, 3, 6]}
              paddingBottom={6}
              paddingLeft={[3, 3, 6, 12, 12]}
              className={styles.asideTop}
            >
              <div className={styles.asideContainer}>
                <Box display="flex" justifyContent="spaceBetween">
                  <Box display="flex">
                    <Box marginRight={2}>
                      <Button variant="utility" icon="person">
                        Mínar síður
                      </Button>
                    </Box>
                    <Button variant="utility">EN</Button>
                  </Box>
                  <Button
                    onClick={closeModal}
                    circle
                    icon="close"
                    colorScheme="negative"
                  />
                </Box>
                <Box marginTop={9}>
                  <Text variant="h3" color="blue600" marginBottom={3}>
                    Stofnanir
                  </Text>
                  <Text variant="h3" color="blue600" marginBottom={3}>
                    Stafrænt Ísland
                  </Text>
                  <Box
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="center"
                    marginBottom={3}
                  >
                    <Box marginRight={4}>
                      <Text variant="h3" color="blue600">
                        Þróun
                      </Text>
                    </Box>
                    <Button
                      circle
                      colorScheme="negative"
                      icon={hideDemo ? 'remove' : 'add'}
                      onClick={() => setHideDemo(!hideDemo)}
                    />
                  </Box>
                  {hideDemo && (
                    <Box
                      paddingLeft={2}
                      borderLeftWidth="standard"
                      borderColor="blue200"
                      marginBottom={3}
                    >
                      <Text marginBottom={1} color="blue600" variant="small">
                        Viskuausan
                      </Text>
                      <Text marginBottom={1} color="blue600" variant="small">
                        Ísland UI
                      </Text>
                      <Text marginBottom={1} color="blue600" variant="small">
                        Hönnunarkerfi
                      </Text>
                      <Text marginBottom={1} color="blue600" variant="small">
                        Efnisstefna
                      </Text>
                    </Box>
                  )}
                  <Box
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="center"
                    marginBottom={3}
                  >
                    <Box marginRight={4}>
                      <Text variant="h3" color="blue600">
                        Upplýsingarsvæði
                      </Text>
                    </Box>
                    <Button circle colorScheme="negative" icon="add" />
                  </Box>
                </Box>
              </div>
            </Box>
            <Box
              paddingTop={5}
              paddingRight={[3, 3, 6]}
              paddingBottom={6}
              paddingLeft={[3, 3, 6, 12, 12]}
              className={styles.asideBottom}
            >
              <div className={styles.asideContainer}>
                <Text color="blue600" variant="eyebrow">
                  Aðrir opinberir vefir
                </Text>
                <Box
                  borderTopWidth="standard"
                  borderColor="blue300"
                  marginTop={3}
                  marginBottom={3}
                />
                <Text variant="small" color="blue600" marginBottom={2}>
                  Heilsuvera
                </Text>
                <Text variant="small" color="blue600" marginBottom={2}>
                  Samráðsgátt
                </Text>
                <Text variant="small" color="blue600" marginBottom={2}>
                  Mannanöfn
                </Text>
                <Text variant="small" color="blue600" marginBottom={2}>
                  Undirskriftarlistar
                </Text>
                <Text variant="small" color="blue600" marginBottom={2}>
                  Opin gögn
                </Text>
                <Text variant="small" color="blue600" marginBottom={2}>
                  Opinber nýsköpun
                </Text>
                <Text variant="small" color="blue600">
                  Tekjusagan
                </Text>
              </div>
            </Box>
          </div>
        </>
      )}
    </ModalBase>
  )
}

export default Menu
