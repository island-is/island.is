import {
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './DomainList.css'
import MockData from '../../lib/MockData'

const DomainList = () => {
  return (
    <GridContainer className={styles.relative}>
      <GridRow rowGap={3}>
        {MockData.map((item) => (
          <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
            <CategoryCard
              autoStack
              hyphenate
              truncateHeading
              to={'/innskraningarkerfi/' + item.id}
              key={item.id}
              heading={item.title}
              text={item.domain}
              component={Link}
              tags={[
                {
                  label: `${item.numberOfApplications} Applications`,
                },
                {
                  label: `${item.numberOfApis} APIs`,
                },
              ]}
            />
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )
}

export default DomainList
