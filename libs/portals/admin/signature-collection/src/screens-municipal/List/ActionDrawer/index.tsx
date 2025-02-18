import { Box } from '@island.is/island-ui/core'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import ListActions from './ListActions'
import ListManagers from './ListManagers'

const ActionDrawer = () => {
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }

  return (
    <Box marginTop={3} display="flex">
      <ListActions />
      <ListManagers />
    </Box>
  )
}

export default ActionDrawer
