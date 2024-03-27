import {
  GridRow as Row,
  GridColumn as Column,
  Box,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './Payments.css'

export default function Payments() {
  return (
    <Box
      style={{
        width: 'calc(100 % + 16px)',
        marginTop: '-16px',
      }}
    >
      <Row>
        <Box
          className={styles.header}
          style={{ width: '100%' }}
          paddingLeft={1}
        >
          <Row>
            <Column span="3/12">
              <Box paddingLeft={2}>
                <Text variant="medium">Vörutegund</Text>
              </Box>
            </Column>
            <Column span="3/12">
              <Text variant="medium">Vara</Text>
            </Column>
            <Column span="2/12">
              <Text variant="medium">Upphæð</Text>
            </Column>
            <Column span="2/12">
              <Text variant="medium">Bókhaldslykill</Text>
            </Column>
            <Column span="2/12">
              <Box>
                <Text variant="medium">Aðgerðir</Text>
              </Box>
            </Column>
          </Row>
        </Box>
      </Row>
      <Row>
        <Column span="2/10"></Column>
        <Column span="2/10"></Column>
        <Column span="2/10"></Column>
        <Column span="2/10"></Column>
        <Column span="2/10"></Column>
      </Row>
    </Box>
  )
}
