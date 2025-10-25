import { Box, LoadingDots, ModalBase } from '@island.is/island-ui/core'
import * as styles from './LoadModal.css'

export const LoadModal = () => {
  return (
    <ModalBase
      baseId="loading-onboarding-modal"
      hideOnClickOutside={false}
      initialVisibility={true}
      className={styles.dialog}
      modalLabel="Loading modal"
      backdropWhite={false}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="full"
      >
        <LoadingDots size="large" />
      </Box>
    </ModalBase>
  )
}
