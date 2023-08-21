import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './Footer.css'

interface FooterProps {
  imageUrl: string
  heading: string
}

export const Footer = ({ imageUrl, heading }: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <Box paddingY={3}>
        <GridContainer>
          <GridRow alignItems="center" rowGap={3}>
            <GridColumn hiddenBelow="sm">
              <img width={75} src={imageUrl} alt="" />
            </GridColumn>
            <GridColumn>
              <Text variant="h2">{heading}</Text>
            </GridColumn>
          </GridRow>
          <GridRow>{/* TODO: add columns */}</GridRow>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default Footer
