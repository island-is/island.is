import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData, useRevalidator } from 'react-router-dom'
import { useEffect } from 'react'
import { SignatureCollectionList } from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import Signees from './components/signees'
import PaperUpload from './components/paperUpload'
import header from '../../../assets/headerImage.svg'
import format from 'date-fns/format'

const List = () => {
  const { list } = useLoaderData() as { list: SignatureCollectionList }
  const { revalidate } = useRevalidator()
  const { formatMessage } = useLocale()

  useEffect(() => {
    revalidate()
  }, [])

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <PortalNavigation
            navigation={signatureCollectionNavigation}
            title={formatMessage(m.signatureListsTitle)}
          />
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 2]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          {!!list && (
            <Box>
              <IntroHeader
                title={list.owner.name + ' - ' + list.area.name}
                intro={formatMessage(m.signatureListsIntro)}
                img={header}
                imgPosition="right"
                imgHiddenBelow="sm"
              />
              <Stack space={3}>
                <Box display={['block', 'flex']} justifyContent="spaceBetween">
                  <Box display={['block', 'flex']}>
                    <Input
                      readOnly
                      name="endTime"
                      value={
                        format(new Date(list.endTime), 'dd.MM.yyyy HH:mm') ?? ''
                      }
                      label={formatMessage(m.listEndTime)}
                      size="sm"
                    />
                    <Hidden below="sm">
                      <Box marginLeft={2}>
                        <Button icon="calendar" iconType="outline" />
                      </Box>
                    </Hidden>
                  </Box>

                  <Box
                    display={['flex', 'block']}
                    marginTop={[2, 0]}
                    justifyContent="spaceBetween"
                  >
                    <Hidden above="xs">
                      <Button icon="calendar" iconType="outline" />
                    </Hidden>
                    <Button
                      icon="lockClosed"
                      iconType="outline"
                      variant="ghost"
                      colorScheme="destructive"
                    >
                      {formatMessage(m.confirmListReviewed)}
                    </Button>
                  </Box>
                </Box>
                <Signees />
              </Stack>
              <PaperUpload />
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
