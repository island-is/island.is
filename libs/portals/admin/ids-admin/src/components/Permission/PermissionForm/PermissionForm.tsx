import { Form } from 'react-router-dom'
import { PermissionBasicInfo } from './PermissionBasicInfo'
import { Box } from '@island.is/island-ui/core'
import { PermissionContent } from './PermissionContent'

export const PermissionForm = () => {
  return (
    <Form method="post">
      <Box display="flex" flexDirection="column" rowGap={5}>
        <PermissionBasicInfo />
        <PermissionContent />
      </Box>
    </Form>
  )
}
