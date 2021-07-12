import {
  Box,
  Button,
  LoadingIcon,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { MockPaymentPlan } from '../../PaymentPlan/useMockPaymentPlan'

interface Props {
  isLoading: boolean
  data: MockPaymentPlan | null
}

const TableRow = ({
  dueDate,
  payment,
  remaining,
  interestRates,
  totalPayment,
}: {
  dueDate: string
  payment: string
  remaining: string
  interestRates: string
  totalPayment: string
}) => (
  <T.Row>
    <T.Data>{dueDate}</T.Data>
    <T.Data>{remaining}</T.Data>
    <T.Data>{payment}</T.Data>
    <T.Data>{interestRates}</T.Data>
    <T.Data>
      <Text variant="h5">{totalPayment}</Text>
    </T.Data>
  </T.Row>
)

export const PaymentPlanTable = ({ isLoading, data }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpandTable = () => setIsExpanded(!isExpanded)

  return (
    <>
      {isLoading && (
        <Box display="flex" alignItems="center" justifyContent="center">
          <LoadingIcon animate size={50} />
        </Box>
      )}
      {!isLoading && data !== null && (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>Gjalddagi</T.HeadData>
              <T.HeadData>Eftirstöðvar</T.HeadData>
              <T.HeadData>Innborgun</T.HeadData>
              <T.HeadData>Vextir</T.HeadData>
              <T.HeadData>Greiðsla alls</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {!isExpanded && data.schedule.length > 6 ? (
              <>
                {data.schedule.slice(0, 2).map((line, index) => (
                  <TableRow key={index} {...line} />
                ))}
                {data.schedule.length > 2 && (
                  <T.Row>
                    <T.Data colSpan={5} box={{ background: 'blue100' }}>
                      <Box display="flex" justifyContent="center" marginY={1}>
                        <Button
                          variant="ghost"
                          onClick={handleExpandTable}
                          size="small"
                        >
                          Sjá alla gjalddaga
                        </Button>
                      </Box>
                    </T.Data>
                  </T.Row>
                )}
                {data.schedule
                  .slice(data.schedule.length - 2, data.schedule.length)
                  .map((line, index) => (
                    <TableRow key={index} {...line} />
                  ))}
              </>
            ) : (
              data.schedule.map((line, index) => (
                <TableRow key={index} {...line} />
              ))
            )}
            <T.Row>
              <T.Data>
                <Text variant="h5">Heildarupphæð</Text>
              </T.Data>
              <T.Data />
              <T.Data />
              <T.Data>
                <Text variant="eyebrow">0 kr.</Text>
              </T.Data>
              <T.Data>
                <Text variant="h4" color="blue400">
                  45.000 kr.
                </Text>
              </T.Data>
            </T.Row>
            {isExpanded && data.schedule.length > 6 && (
              <T.Row>
                <T.Data colSpan={5} box={{ background: 'blue100' }}>
                  <Box display="flex" justifyContent="center" marginY={1}>
                    <Button
                      variant="ghost"
                      onClick={handleExpandTable}
                      size="small"
                    >
                      Sjá minna
                    </Button>
                  </Box>
                </T.Data>
              </T.Row>
            )}
          </T.Body>
        </T.Table>
      )}
    </>
  )
}
