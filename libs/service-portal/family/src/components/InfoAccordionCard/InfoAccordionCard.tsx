import React, { FC } from 'react'
import {
  AccordionCard,
  Box,
  Stack,
  Columns,
  Column,
  Typography,
} from '@island.is/island-ui/core'

interface Props {
  id: string
  label: string
  description: string
  rows: {
    columns: {
      content?: string
      render?: () => JSX.Element
    }[]
  }[]
}

const InfoAccordionCard: FC<Props> = ({ id, label, description, rows }) => {
  return (
    <AccordionCard
      id={id}
      label={label}
      visibleContent={description ? description : null}
    >
      <Stack space={2}>
        {rows.map((row, index) => (
          <Box
            key={`row-${index}`}
            paddingY={2}
            paddingX={3}
            border="standard"
            borderRadius="large"
          >
            <Columns space={1} collapseBelow="sm" alignY="center">
              {row.columns.map((column, index) => (
                <Column
                  key={`column-${index}`}
                  width={index === 0 ? '5/12' : index === 1 ? '4/12' : '3/12'}
                >
                  <Box overflow="hidden">
                    {column.render ? (
                      column.render()
                    ) : index === 0 ? (
                      <Typography variant="h5">{column.content}</Typography>
                    ) : (
                      column.content
                    )}
                  </Box>
                </Column>
              ))}
            </Columns>
          </Box>
        ))}
      </Stack>
    </AccordionCard>
  )
}

export default InfoAccordionCard
