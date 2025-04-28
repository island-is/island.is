import {
  Box,
  Button,
  Drawer,
  Text,
  Table as T,
} from '@island.is/island-ui/core'

const { Table, Row, Head, HeadData, Body, Data } = T

const ListManagers = () => {
  return (
    <Box>
      <Drawer
        ariaLabel={''}
        baseId={''}
        disclosure={
          <Box marginLeft={2}>
            <Button variant="utility" icon="person" iconType="outline">
              Aðilar
            </Button>
          </Box>
        }
      >
        <Text variant="h2" marginTop={2} marginBottom={7}>
          Aðilar
        </Text>
        <Text variant="h4" marginBottom={3}>
          Ábyrgðaraðilar
        </Text>
        <Table>
          <Head>
            <Row>
              <HeadData style={{ width: '25%' }}>Kennitala</HeadData>
              <HeadData>Nafn</HeadData>
            </Row>
          </Head>
          <Body>
            <Row>
              <Data>010130-3019</Data>
              <Data>Gervimaður Afríka</Data>
            </Row>
            <Row>
              <Data>010130-2399</Data>
              <Data>Gervimaður Færeyjar</Data>
            </Row>
          </Body>
        </Table>

        <Text variant="h4" marginTop={7} marginBottom={3}>
          Umsjónaraðilar
        </Text>
        <Table>
          <Head>
            <Row>
              <HeadData style={{ width: '25%' }}>Kennitala</HeadData>
              <HeadData>Nafn</HeadData>
            </Row>
          </Head>
          <Body>
            <Row>
              <Data>012345-3799</Data>
              <Data>Nafni Nafnasson</Data>
            </Row>
            <Row>
              <Data>012345-3799</Data>
              <Data>Nafni Nafnasson</Data>
            </Row>
            <Row>
              <Data>012345-3799</Data>
              <Data>Nafni Nafnasson</Data>
            </Row>
          </Body>
        </Table>
      </Drawer>
    </Box>
  )
}

export default ListManagers
