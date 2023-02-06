import { Icon, Table as T, Checkbox, Text, Box } from '@island.is/island-ui/core'
import isEvenCheck from '../../utils/helpers/isEvenCheck'
import SubscriptionDummyData from '../DummyData/SubscriptionDummyData'

const Headers = {
    cases: ['Málsnr.', 'Heiti máls'],
    institutions: ['Stofnun'],
    policyAreas: ['Málefnasvið']
}

const BackgroundColor = (idx: number) => {
    const isEven = isEvenCheck(idx)
    return isEven ? 'blue100' : 'transparent'
}

const SubscriptionTable = ({ }) => {
    const chosenTab = "cases"
    const dummyData = SubscriptionDummyData[chosenTab]

    let headerKey = 0

    const onCheckboxChange = (idx: number) => {
        
    }

    return (
        <T.Table>
            <T.Head>
                <T.Row>
                <T.HeadData box={{ background: 'transparent', borderColor: 'transparent' }} key={headerKey++}><Icon icon="checkmark" color="blue400" /></T.HeadData>
                {Headers[chosenTab].map((header) => (
                    <T.HeadData box={{ background: 'transparent', borderColor: 'transparent' }} key={headerKey++}>{header}</T.HeadData>
                ))}
                </T.Row>
                
            </T.Head>
            <T.Body>
                {dummyData.map((data, idx) => (
                    <T.Row key={data.id }>
                        <T.Data borderColor="transparent" box={{ borderRadius: 'standard', background: BackgroundColor(idx)}}><Checkbox checked={data.checked} onChange={() => onCheckboxChange(data.id)} /></T.Data>
                        <T.Data borderColor="transparent" box={{ background: BackgroundColor(idx)}}><Text variant="h5">{data.caseNumber}</Text></T.Data>
                        <T.Data borderColor="transparent" box={{ borderRadius: 'standard', background: BackgroundColor(idx)}}><Text variant="h5">{data.caseTitle}</Text></T.Data>
                    </T.Row>
                ))}
            </T.Body>
        </T.Table>
    )
}

export default SubscriptionTable
