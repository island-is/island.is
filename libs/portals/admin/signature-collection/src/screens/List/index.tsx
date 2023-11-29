import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData, useRevalidator } from 'react-router-dom'
import { useEffect } from 'react'
import { SignatureList } from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
} from '@island.is/island-ui/core'

const List = () => {
  const list = useLoaderData() as SignatureList
  const { revalidate } = useRevalidator()
  const { formatMessage } = useLocale()

  useEffect(() => {
    revalidate()
  }, [])

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn span={['3/12']}>
          <Hidden below="md">
            <PortalNavigation
              navigation={signatureCollectionNavigation}
              title={formatMessage(m.signatureListsTitle)}
            />
          </Hidden>
        </GridColumn>
        <GridColumn
          offset={['0', '0', '1/12']}
          span={['12/12', '12/12', '8/12']}
        >
          {list && (
            <IntroHeader title={list.owner.name + ' - ' + list.area.name} />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
