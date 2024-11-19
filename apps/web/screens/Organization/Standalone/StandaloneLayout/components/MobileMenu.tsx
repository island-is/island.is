import { useState } from 'react'

import {
  Box,
  Button,
  Divider,
  Icon,
  LinkV2,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './MobileMenu.css'

interface MobileMenuProps {
  links: { label: string; href: string }[]
  homeHref: string
  title?: string
}

export const MobileMenu: React.FC<React.PropsWithChildren<MobileMenuProps>> = ({
  links,
  homeHref,
  title,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <Button icon="menu" variant="utility" onClick={() => setIsVisible(true)}>
        {'Valmynd'}
      </Button>
      <ModalBase
        baseId={'id'}
        className={styles.container}
        isVisible={isVisible}
        onVisibilityChange={(visibility) => {
          if (visibility !== isVisible) {
            setIsVisible(visibility)
          }
        }}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <>
            <Box display="flex" justifyContent="flexEnd">
              <Button icon={'close'} variant="utility" onClick={closeModal}>
                {'Valmynd'}
              </Button>
            </Box>
            <Box className={styles.mobileContent}>
              <LinkV2 key={'frontpage'} href={homeHref}>
                <Box
                  display="flex"
                  alignItems="center"
                  className={styles.links}
                >
                  <Icon
                    icon="home"
                    color="dark400"
                    type="outline"
                    className={styles.icon}
                  />
                  <Text
                    variant="default"
                    color="dark400"
                    paddingTop={1}
                    paddingBottom={1}
                  >
                    {'Forsíða: ' + title}
                  </Text>
                </Box>
              </LinkV2>
              <Divider />
              {links.map((link) => (
                <>
                  <Box className={styles.links}>
                    <LinkV2 key={link.label} href={link.href}>
                      <Text
                        variant="default"
                        color="dark400"
                        paddingTop={1}
                        paddingBottom={1}
                      >
                        {link.label}
                      </Text>
                    </LinkV2>
                  </Box>
                  <Divider />
                </>
              ))}
            </Box>
          </>
        )}
      </ModalBase>
    </>
  )
}
