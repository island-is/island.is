import {
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './DomainList.css'

const MockData = [
  {
    id: '1',
    title: 'Ísland.is,stjórnborð',
    domain: '@admin.island.is',
    numberOfApplications: 5,
    numberOfApis: 10,
  },
  {
    id: '2',
    title: 'Þjóðskrá',
    domain: '@skra.is',
    numberOfApplications: 2,
    numberOfApis: 3,
  },
  {
    id: '3',
    title: 'Ísland.is,stjórnborð',
    domain: '@admin.island.is',
    numberOfApplications: 5,
    numberOfApis: 10,
  },
  {
    id: '4',
    title: 'Þjóðskrá',
    domain: '@skra.is',
    numberOfApplications: 2,
    numberOfApis: 3,
  },
]

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
              to={'/ids-admin/' + item.id}
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
