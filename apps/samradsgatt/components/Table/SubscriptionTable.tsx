import { Table as T } from '@island.is/island-ui/core'

const SubscriptionTable = () => {
    return (
        <T.Table>
            <T.Head>
                <T.Row>
                <T.HeadData box={{ background: 'transparent', borderColor: 'transparent' }}>Header</T.HeadData>
                <T.HeadData box={{ background: 'transparent', borderColor: 'transparent' }}>Header2</T.HeadData>
                </T.Row>
            </T.Head>
            <T.Body>
                <T.Row>
                <T.Data borderColor="transparent">Data</T.Data>
                <T.Data borderColor="transparent" >Data2</T.Data>
                </T.Row>
            </T.Body>
        </T.Table>
    )
}

export default SubscriptionTable
