import React from 'react'
import { Icon, Table as T, Checkbox, Text } from '@island.is/island-ui/core'
import * as styles from './SubscriptionTable.css'
import tableRowBackgroundColor from '../../utils/helpers/tableRowBackgroundColor'

const Headers = {
    'Mál': ['Málsnr.', 'Heiti máls'],
    'Stofnanir': ['Stofnun'],
    'Málefnasvið': ['Málefnasvið']
}

const SubscriptionTable = ({ data, setData, currentTab }) => {
    let headerKey = 0

    console.log("data", data)

    const onCheckboxChange = (id: number) => {
        const newData = data.map((item, idx: number) => {
            if(idx === id) {
                item.checked = !item.checked
                return item
            }
            return item
        })
        setData(newData)
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
                        <T.Data borderColor="transparent" box={{ className: styles.tableRowLeft, background: tableRowBackgroundColor(idx)}}><Checkbox checked={item.checked} onChange={() => onCheckboxChange(item.id)} /></T.Data>
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
