import React, { FC, useState } from 'react'
import { Box, Pagination, Stack } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  Table,
  Head,
  Row,
  HeadData,
  Data,
  Body,
} from '@island.is/skilavottord-web/components/Table/Table'

const CarsTable: FC = () => {
  const [page, setPage] = useState(1)
  const totalPages = 47

  const {
    t: { deregisterOverview: t },
  } = useI18n()

  return (
    <Stack space={5}>
      <Table>
        <Head>
          <Row>
            {t.table.map((name, index) => (
              <HeadData key={index} textVariant="small">
                {name}
              </HeadData>
            ))}
          </Row>
        </Head>
        <Body>
          {mock.map((car) => (
            <Row key={car.id}>
              <Data textVariant="h5">{car.id}</Data>
              <Data>{car.brand}</Data>
              <Data>{car.model}</Data>
              <Data>{car.year}</Data>
              <Data>{car.user}</Data>
              <Data>{car.date}</Data>
            </Row>
          ))}
        </Body>
      </Table>
      <Box paddingX={[0, 0, 7, 7]}>
        <Pagination
          page={page}
          totalPages={totalPages}
          renderLink={(page, className, children) => (
            <Box
              cursor="pointer"
              className={className}
              onClick={() => setPage(page)}
            >
              {children}
            </Box>
          )}
        />
      </Box>
    </Stack>
  )
}

export default CarsTable

const mock = [
  {
    id: 'XK4314',
    brand: 'Volvo',
    model: 'V70',
    year: '2001',
    user: 'Theresa Webb',
    date: '2020-02-02',
  },
  {
    id: 'KR0329',
    brand: 'Ford',
    model: 'Focus',
    year: '1998',
    user: 'Jenny Wilson',
    date: '2019-02-02',
  },
  {
    id: 'BJK632',
    brand: 'Mercedes',
    model: 'C-Klass',
    year: '2003',
    user: 'Leslie Alexander',
    date: '2018-02-02',
  },
]
