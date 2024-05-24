import { AlertMessage, Box, Button } from '@island.is/island-ui/core'

const DocumentActions = () => {
  return (
    <Box>
      <Box marginBottom={2}>
        <AlertMessage
          type="success"
          message={
            'Staðfesting á möttöku hefur verið send á dómstóla og ákæruvald.'
          }
        />
      </Box>
      <Box marginBottom={2}>
        <Button
          size="small"
          variant="utility"
          icon="receipt"
          iconType="outline"
        >
          {'Velja verjanda'}
        </Button>
      </Box>
    </Box>
  )
}

export default DocumentActions
