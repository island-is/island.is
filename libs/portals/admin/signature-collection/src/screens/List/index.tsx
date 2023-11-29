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
              <IntroHeader title={list.owner.name + ' - ' + list.area.name} />
              <Stack space={3}>
                <Box>
                  <Text variant="h5">
                    {formatMessage(m.listSigneesNumberHeader)}
                  </Text>
                  <Text variant="default">{list.numberOfSignatures}</Text>
                </Box>
                <Box>
                  <Text variant="h5" marginBottom={1}>
                    {formatMessage(m.updateListEndTime)}
                  </Text>
                  <Box display="flex">
                    <Box width="half">
                      <DatePicker
                        appearInline
                        label={formatMessage(m.signeeDate)}
                        locale="is"
                        handleChange={(date) => console.log(date)}
                        minDate={new Date(list.endTime)}
                        selected={new Date(list.endTime)}
                        placeholderText=""
                        size="sm"
                      />
                    </Box>

                    <Box marginX={[0, 3]}>
                      <Button iconType="outline">
                        {formatMessage(m.updateListEndTimeButton)}
                      </Button>
                    </Box>
                  </Box>
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
