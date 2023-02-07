import React from 'react'
import { Icon, Table as T, Checkbox, Text } from '@island.is/island-ui/core'
import * as styles from './SubscriptionTable.css'
import tableRowBackgroundColor from '../../utils/helpers/tableRowBackgroundColor'

const Headers = {
    'Mál': ['Málsnr.', 'Heiti máls'],
    'Stofnanir': ['Stofnun'],
    'Málefnasvið': ['Málefnasvið']
}

const MapIsToEn = {
    'Mál': 'caseIds',
    'Stofnanir': 'institutionIds',
    'Málefnasvið': 'policyAreaIds'
}

const SubscriptionTable = ({ data, currentTab, subscriptionArray, setSubscriptionArray }) => {
    let headerKey = 0

    const onCheckboxChange = (id: number, action: boolean) => {
        const sub = [...subscriptionArray[MapIsToEn[currentTab]]]
        const subArr = {...subscriptionArray}
        if(action) {
            sub.push(id)
        } else {
            const idx = sub.indexOf(id)
            sub.splice(idx, 1)
        }
        subArr[MapIsToEn[currentTab]] = sub
        return setSubscriptionArray(subArr)
    }

    const checkboxStatus = (id: number) => {
        return subscriptionArray[MapIsToEn[currentTab]].includes(id)
    }

    return (
        <T.Table>
            <T.Head>
                <T.Row>
                <T.HeadData box={{ background: 'transparent', borderColor: 'transparent' }} key={headerKey++}><Icon icon="checkmark" color="blue400" className={styles.checkmarkIcon} /></T.HeadData>
                {Headers[currentTab].map((header) => (
                    <T.HeadData text={{ variant: 'h4'}} box={{ background: 'transparent', borderColor: 'transparent' }} key={headerKey++}>{header}</T.HeadData>
                ))}
                </T.Row>
                
            </T.Head>
            <T.Body>
                {data.map((item, idx) => (
                    <T.Row key={item.id }>
                        <T.Data borderColor="transparent" box={{ className: styles.tableRowLeft, background: tableRowBackgroundColor(idx)}}><Checkbox checked={checkboxStatus(item.id)} onChange={(e) => onCheckboxChange(item.id, e.target.checked)} /></T.Data>
                        {currentTab == 'Mál' && (
                            <T.Data borderColor="transparent" box={{ background: tableRowBackgroundColor(idx)}}><Text variant="h5">{item.caseNumber}</Text></T.Data>
                        )}
                        <T.Data borderColor="transparent" box={{ className: styles.tableRowRight, background: tableRowBackgroundColor(idx)}}><Text variant="medium">{item.name}</Text></T.Data>
                    </T.Row>
                ))}
            </T.Body>
        </T.Table>
    )
}

export default SubscriptionTable
