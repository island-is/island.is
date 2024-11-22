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
import { useI18n } from '@island.is/web/i18n'

import * as styles from './MobileMenu.css'

interface MobileMenuProps {
  links: { label: string; href: string }[]
  homeHref: string
  homeLabel?: string
}

export const MobileMenu: React.FC<React.PropsWithChildren<MobileMenuProps>> = ({
  links,
  homeHref,
  homeLabel,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { activeLocale } = useI18n()

  const menuLabel = activeLocale === 'is' ? 'Valmynd' : 'Menu'
  const homeLabelPrefix = activeLocale === 'is' ? 'Forsíða' : 'Frontpage'

  return (
    <>
      <Button icon="menu" variant="utility" onClick={() => setIsVisible(true)}>
        {menuLabel}
      </Button>
      <ModalBase
        baseId={`${homeLabel ? homeLabel + '-' : ''}mobile-menu`}
        className={styles.container}
        isVisible={isVisible}
        onVisibilityChange={setIsVisible}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <>
            <Box display="flex" justifyContent="flexEnd">
              <Button icon={'close'} variant="utility" onClick={closeModal}>
                {menuLabel}
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
                    {`${homeLabelPrefix}${homeLabel ? ': ' + homeLabel : ''}`}
                  </Text>
                </Box>
              </LinkV2>
              <Divider />
              {links.map((link) => (
                <Box key={link.label}>
                  <Box className={styles.links}>
                    <LinkV2 href={link.href}>
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
                </Box>
              ))}
            </Box>
          </>
        )}
      </ModalBase>
    </>
  )
}
