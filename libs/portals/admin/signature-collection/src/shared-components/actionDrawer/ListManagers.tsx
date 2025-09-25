import { Button, Drawer, Text, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import { formatNationalId } from '@island.is/portals/core'

const { Table, Row, Head, HeadData, Body, Data } = T

const ListManagers = () => {
  const { formatMessage } = useLocale()
  const { list } = useLoaderData() as {
    list: SignatureCollectionList
  }
  return (
    <Drawer
      ariaLabel="managersDrawer"
      baseId="managersDrawer"
      disclosure={
        <Button variant="utility" icon="people" iconType="outline">
          {formatMessage(m.listManagersTitle)}
        </Button>
      }
    >
      <Text variant="h2" marginTop={2} marginBottom={7}>
        {formatMessage(m.listManagersTitle)}
      </Text>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(m.listManagers)}
      </Text>
      <Table>
        <Head>
          <Row>
            <HeadData style={{ width: '20%' }}>
              {formatMessage(m.nationalId)}
            </HeadData>
            <HeadData>{formatMessage(m.name)}</HeadData>
          </Row>
        </Head>
        <Body>
          <Row>
            <Data>{formatNationalId(list.candidate.nationalId)}</Data>
            <Data>{list.candidate.ownerName}</Data>
          </Row>
        </Body>
      </Table>
      <Text variant="h4" marginTop={7} marginBottom={2}>
        {formatMessage(m.listSupervisors)}
      </Text>
      <Table>
        <Head>
          <Row>
            <HeadData style={{ width: '20%' }}>
              {formatMessage(m.nationalId)}
            </HeadData>
            <HeadData>{formatMessage(m.name)}</HeadData>
          </Row>
        </Head>
        <Body>
          {list.collectors?.length ? (
            list.collectors.map((collector, key) => (
              <Row key={key}>
                <Data>{formatNationalId(collector.nationalId)}</Data>
                <Data>{collector.name}</Data>
              </Row>
            ))
          ) : (
            <Row>
              <Data colSpan={2}>{formatMessage(m.listNoSupervisors)}</Data>
            </Row>
          )}
        </Body>
      </Table>
    </Drawer>
  )
}

export default ListManagers
