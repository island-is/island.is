import { Box, AlertMessage, AlertMessageType } from '@island.is/island-ui/core'

const ListInfo = ({
  message,
  type,
}: {
  message: string
  type?: AlertMessageType
}) => {
  return (
    <Box marginTop={3} marginBottom={7}>
      <AlertMessage message={message} type={type ? type : 'info'} />
    </Box>
  )
}

export default ListInfo
