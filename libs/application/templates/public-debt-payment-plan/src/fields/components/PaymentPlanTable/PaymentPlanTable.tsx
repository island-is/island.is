import React, { useState } from 'react'
import { MockPaymentPlan } from '../../PaymentPlan/useMockPaymentPlan'
import {
  Accordion,
  AccordionItem,
  Box,
  Text,
  Table as T,
  LoadingIcon,
  Button,
} from '@island.is/island-ui/core'

interface Props {
  isLoading: boolean
  data: MockPaymentPlan | null
}

const TableRow = ({
  dueDate,
  payment,
  remaining,
}: {
  dueDate: string
  payment: number
  remaining: number
}) => (
  <T.Row>
    <T.Data>{dueDate}</T.Data>
    <T.Data>{payment.toLocaleString('is-IS')} kr.</T.Data>
    <T.Data>{remaining.toLocaleString('is-IS')} kr.</T.Data>
  </T.Row>
)

export const PaymentPlanTable = ({ isLoading, data }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpandTable = () => setIsExpanded(true)

  return (
    <Box marginY={5}>
      <AccordionItem
        id="payment-plan-table"
        label="Greiðsluáætlun skuldar"
        visibleContent={
          <Text>Hér er hægt að sjá heildargreiðsluáætlun skuldar</Text>
        }
        startExpanded
      >
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
                <T.HeadData>Innborgun</T.HeadData>
                <T.HeadData>Eftirstöðvar</T.HeadData>
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
                      <T.Data colSpan={3}>
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
            </T.Body>
          </T.Table>
        )}
      </AccordionItem>
    </Box>
  )
}
