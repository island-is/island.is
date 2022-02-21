import React from 'react'
import {
  ModalBase,
  Text,
  Box,
  Button,
  Divider,
} from '@island.is/island-ui/core'

import * as styles from './DirectTaxPaymentModal.css'
import {
  TaxBreakdownItem,
  TaxBreakdownHeaders,
  TaxBreakdown,
} from '@island.is/financial-aid/shared/components'
import {
  DirectTaxPayment,
  formatNationalId,
  getMonth,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  items: DirectTaxPayment[]
}

const DirectTaxPaymentModal = ({
  isVisible,
  onVisibilityChange,
  items,
}: Props) => {
  return (
    <ModalBase
      baseId="directTaxPaymentModal"
      className={styles.modalBase}
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
    >
      {({
        closeModal,
      }: {
        closeModal: () => React.Dispatch<React.SetStateAction<boolean>>
      }) => (
        <Box onClick={closeModal} className={styles.container}>
          <Box
            position="relative"
            background="white"
            borderRadius="large"
            paddingY={4}
            paddingX={4}
            className={styles.modal}
          >
            <Text variant="h3" marginBottom={4}>
              Staðgreiðsluskrá
            </Text>

            <table className={styles.tableContainer}>
              <thead>
                <tr className={styles.tableHeaders}>
                  {['Mánuður', 'Greiðandi', 'Upphæð'].map((head) => {
                    return (
                      <th key={`DirectTaxPaymentModalHeaders${head}`}>
                        <Text variant="small" fontWeight="semiBold">
                          {head}
                        </Text>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {items.map((i, index) => {
                  return (
                    <tr
                      key={`${index}-DirectTaxPaymentModalItem-${i.month}`}
                      className={styles.tableItem}
                    >
                      <td>
                        <Text variant="small" marginBottom={1}>
                          {`${getMonth(i.month)} ${i.year}`}
                        </Text>
                      </td>
                      <td>
                        <Text variant="small" marginBottom={1}>
                          {formatNationalId(i.payerNationalId.toString())}
                        </Text>
                      </td>
                      <td>
                        <Text variant="small" marginBottom={1}>
                          {`${i.totalSalary.toLocaleString('de-DE')} kr.`}
                        </Text>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <Box paddingTop={4} display="flex" justifyContent="flexEnd">
              <Button onClick={closeModal}>Loka</Button>
            </Box>
          </Box>
        </Box>
      )}
    </ModalBase>
  )
}

export default DirectTaxPaymentModal
