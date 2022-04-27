import React from 'react'
import { ModalBase, Text, Box, Button } from '@island.is/island-ui/core'

import * as styles from './DirectTaxPaymentModal.css'
import { DirectTaxPayment } from '@island.is/financial-aid/shared/lib'
import { TaxBreakdown } from '..'

interface Props {
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  items: DirectTaxPayment[]
  dateDataWasFetched: string
}

const DirectTaxPaymentModal = ({
  isVisible,
  onVisibilityChange,
  items,
  dateDataWasFetched,
}: Props) => {
  return (
    <TaxBreakdown items={items} dateDataWasFetched={dateDataWasFetched} />
    // <ModalBase
    //   baseId="directTaxPaymentModal"
    //   className={styles.modalBase}
    //   isVisible={isVisible}
    //   onVisibilityChange={(visibility) => {
    //     if (visibility !== isVisible) {
    //       onVisibilityChange(visibility)
    //     }
    //   }}
    // >
    //   {({
    //     closeModal,
    //   }: {
    //     closeModal: () => React.Dispatch<React.SetStateAction<boolean>>
    //   }) => (
    //     <Box onClick={closeModal} className={styles.container}>
    //       <Box
    //         position="relative"
    //         background="white"
    //         borderRadius="large"
    //         paddingY={4}
    //         paddingX={4}
    //         className={styles.modal}
    //       >
    //         <Text variant="h3" marginBottom={4}>
    //           Staðgreiðsluskrá
    //         </Text>

    //         {/* <TaxBreakdown items={items} /> */}

    //         <Box paddingTop={4} display="flex" justifyContent="flexEnd">
    //           <Button onClick={closeModal}>Loka</Button>
    //         </Box>
    //       </Box>
    //     </Box>
    //   )}
    // </ModalBase>
  )
}

export default DirectTaxPaymentModal
