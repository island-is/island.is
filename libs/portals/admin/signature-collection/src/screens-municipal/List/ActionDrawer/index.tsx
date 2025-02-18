import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import ActionExtendDeadline from '../../../shared-components/extendDeadline'
import ActionLockList from '../../../shared-components/lockList'
import ActionReviewComplete from '../../../shared-components/completeReview'

const ActionDrawer = () => {
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }

  return (
    <Box>
      <Box marginTop={3} display="flex">
        <Drawer
          ariaLabel={''}
          baseId={''}
          disclosure={
            <Button variant="utility" icon="settings" iconType="outline">
              Aðgerðir
            </Button>
          }
        >
          <Text variant="h2" color="backgroundBrand" marginY={3}>
            Aðgerðir
          </Text>
          <Divider />
          <Text marginY={6}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
            justo interdum, pharetra enim vel, ultrices augue. Vestibulum
            tincidunt cursus viverra.{' '}
          </Text>

          <Stack space={7}>
            <ActionExtendDeadline listId={list?.id} endTime={list?.endTime} />
            <ActionLockList listId={list?.id} listStatus={listStatus} />
            <ActionReviewComplete listId={list?.id} listStatus={listStatus} />
          </Stack>
        </Drawer>
        <Drawer
            ariaLabel={''}
            baseId={''}
            disclosure={
              <Box marginLeft={2}>
                <Button variant="utility" icon="person" iconType="outline">
                  Aðilar
                </Button>
              </Box>
            }
          >
            <Text variant="h2" color="backgroundBrand" marginY={3}>
              Aðgerðir
            </Text>
            <Divider />
            <Text marginY={6}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
              justo interdum, pharetra enim vel, ultrices augue. Vestibulum
              tincidunt cursus viverra.{' '}
            </Text>

            <Stack space={7}>
              <ActionExtendDeadline listId={list?.id} endTime={list?.endTime} />
              <ActionLockList listId={list?.id} listStatus={listStatus} />
              <ActionReviewComplete listId={list?.id} listStatus={listStatus} />
            </Stack>
          </Drawer>
      </Box>
    </Box>
  )
}

export default ActionDrawer
