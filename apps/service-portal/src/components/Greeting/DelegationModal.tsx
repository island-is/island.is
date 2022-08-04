import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Hidden,
  Text,
} from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'

interface Props {
  onClose: () => void
  closeModal: boolean
}

export const DelegationModal = ({ onClose, closeModal }: Props) => {
  return (
    <Modal id="notifyDelegationModal" toggleClose={closeModal}>
      <GridRow align="flexStart" alignItems="flexStart">
        <GridColumn span={['7/8', '3/8']}>
          <Text variant="h4" as="h2" marginBottom={1}>
            Kæri Forráðamaður
          </Text>
          <Text>Skv barnasáttmála etc...</Text>
        </GridColumn>
        <GridColumn span={['2/8', '3/8']}>
          <Hidden below="sm">
            <img
              src="assets/images/familyGrid.svg"
              alt=""
              width="80%"
              style={{ float: 'right' }}
            />
          </Hidden>
        </GridColumn>
        <GridColumn span="6/8">
          <Box marginTop={4} display="flex" flexDirection="row">
            <Box paddingRight={2}>
              <Button onClick={onClose} size="small">
                Loka
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
    </Modal>
  )
}
