import {
  Box,
  Button,
  GridColumn,
  GridRow,
  LinkV2,
  Logo,
} from '@island.is/island-ui/core'

import * as styles from './DigitalIcelandFooter.css'

interface DigitalIcelandFooterProps {
  links: { label: string; href: string }[]
  illustrationSrc: string
}

export const DigitalIcelandFooter = ({
  links,
  illustrationSrc,
}: DigitalIcelandFooterProps) => {
  return (
    <Box>
      {Boolean(illustrationSrc) && (
        <Box
          display="flex"
          justifyContent="center"
          pointerEvents="none"
          userSelect="none"
        >
          <img src={illustrationSrc} alt="" />
        </Box>
      )}
      <Box
        background="blue100"
        borderRadius="large"
        paddingX={[3, 3, 5, 5, 15]}
        paddingY={[3, 3, 4]}
        className={styles.container}
      >
        <Logo
          iconOnly={true}
          id="digital-iceland-footer-icon"
          width={40}
          height={40}
        />
        <GridRow rowGap={[3, 3, 5, 9]}>
          {links.map((link) => (
            <GridColumn key={link.href} span={['1/1', '1/1', '1/1', '1/3']}>
              <LinkV2 href={link.href}>
                <Button as="span" unfocusable={true} variant="text">
                  {link.label}
                </Button>
              </LinkV2>
            </GridColumn>
          ))}
        </GridRow>
      </Box>
    </Box>
  )
}
