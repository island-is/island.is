import React, { FC } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface Props {
  onClose: () => void
}

export const FormSubmittedStep: FC<Props> = ({ onClose }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <GridRow>
        <GridColumn order={[2, 2, 1]} span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" as="h1" marginBottom={2}>
            {formatMessage({
              id: 'sp.settings:good-job',
              defaultMessage: 'Vel gert!',
            })}
          </Text>
          <Text marginBottom={2}>
            {formatMessage({
              id: 'sp.settings:form-submitted-paragraph-one',
              defaultMessage: `
                Takk fyrir að fylla út allar upplýsingarnar.
                Þú getur alltaf breytt þessum upplýsingum með því að fara í stillingar.
              `,
            })}
          </Text>
          <Text>
            {formatMessage({
              id: 'sp.settings:form-submitted-paragraph-two',
              defaultMessage: `
                Nú getur gert allar þær margvíslegu aðgerðir
                sem mínar síður island.is bíður upp á.
              `,
            })}
          </Text>
        </GridColumn>
        <GridColumn order={[1, 1, 2]} span={['0', '0', '3/7']}>
          <Box display="flex" justifyContent="flexEnd" marginBottom={[2, 3, 0]}>
            <img src="assets/images/coffee.svg" alt="Skrautmynd" />
          </Box>
        </GridColumn>
      </GridRow>
      <Box marginTop={[4, 8]}>
        <Button onClick={onClose}>
          {formatMessage({
            id: 'sp.settings:close-window',
            defaultMessage: 'Loka glugga',
          })}
        </Button>
      </Box>
    </>
  )
}
