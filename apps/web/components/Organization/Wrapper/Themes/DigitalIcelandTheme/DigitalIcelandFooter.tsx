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
}

export const DigitalIcelandFooter = ({ links }: DigitalIcelandFooterProps) => {
  return (
    <Box>
      <Box
        background="blue100"
        borderRadius="large"
        paddingX={[3, 3, 5, 5, 15]}
        paddingY={[2, 2, 4]}
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
            <GridColumn span={['1/1', '1/1', '1/1', '1/3']}>
              <LinkV2 key={link.href} href={link.href}>
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
