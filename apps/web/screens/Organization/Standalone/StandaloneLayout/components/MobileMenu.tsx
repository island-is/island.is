import { useState } from 'react'

import {
  Box,
  Button,
  Divider,
  LinkV2,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './MobileMenu.css'

interface MobileMenuProps {
  links: { label: string; href: string }[]
}

export const MobileMenu: React.FC<React.PropsWithChildren<MobileMenuProps>> = ({
  links,
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
            <Button icon={'close'} variant="utility" onClick={closeModal}>
              {'Valmynd'}
            </Button>
            <Box>
              {links.map((link) => (
                <>
                  <LinkV2 key={link.label} href={link.href}>
                    <Text variant="h4" color="blue600">
                      {link.label}
                    </Text>
                  </LinkV2>
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
