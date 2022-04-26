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
  const mockDate = '2022-02-22T16:40:19.864Z'
  const date = new Date(mockDate)

  const mock = [
    {
      month: 11,
      payerNationalId: '6805131120',
      personalAllowance: 22897,
      totalSalary: 75838,
      userType: 'Applicant',
      withheldAtSource: 0,
      year: 2021,
    },
    {
      month: 11,
      payerNationalId: '6805131120',
      personalAllowance: 22897,
      totalSalary: 75838,
      userType: 'Applicant',
      withheldAtSource: 0,
      year: 2021,
    },
    {
      month: 12,
      payerNationalId: '6805131120',
      personalAllowance: 13999,
      totalSalary: 46365,
      userType: 'Applicant',
      withheldAtSource: 0,
      year: 2021,
    },
  ]
  return (
    <TaxBreakdown items={mock} dateDataWasFetched={mockDate} />
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
