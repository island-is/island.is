import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData, useRevalidator } from 'react-router-dom'
import { useEffect } from 'react'
import { SignatureList } from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  Box,
  Button,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import Signees from './components/signees'
import PaperUpload from './components/paperUpload'
import img from '../../../assets/img.jpg'
import { format } from 'date-fns'

const List = () => {
  const { list } = useLoaderData() as { list: SignatureList }
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
          {!!list && (
            <Box>
              <IntroHeader
                title={list.owner.name + ' - ' + list.area.name}
                intro={formatMessage(m.signatureListsIntro)}
                img={img}
                imgPosition="right"
              />
              <Stack space={3}>
                <Box display="flex" justifyContent="spaceBetween">
                  <Button icon="reload" iconType="outline">
                    {formatMessage(m.updateListEndTimeButton)}
                  </Button>
                  <Button
                    icon="lockClosed"
                    iconType="outline"
                    variant="ghost"
                    colorScheme="destructive"
                  >
                    {formatMessage(m.confirmListReviewed)}
                  </Button>
                </Box>
                <Signees />
                <PaperUpload />
              </Stack>
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
