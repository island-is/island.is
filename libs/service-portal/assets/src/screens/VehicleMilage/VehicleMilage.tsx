import { useParams } from 'react-router-dom'
import { InputController } from '@island.is/shared/form-fields'
import { Controller, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  FootNote,
  SAMGONGUSTOFA_ID,
  IntroHeader,
} from '@island.is/service-portal/core'

import { vehicleMessage as messages } from '../../lib/messages'

type UseParams = {
  id: string
}

interface FormOutput {
  date: Date
  odometerStatus: number
}

const VehicleMilage = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage, lang } = useLocale()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormOutput>()

  const handleSubmitForm = async (submitData: FormOutput) => {
    console.log({ submitData })
  }

  const { id } = useParams() as UseParams
  return (
    <>
      <Box marginBottom={[2, 2, 6]}>
        <IntroHeader
          title={m.vehicleMilage}
          intro={messages.vehicleMilageIntro}
          serviceProviderID={SAMGONGUSTOFA_ID}
          serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
        />
        <Stack space={6}>
          {/* {!loading && !error && vehicles.length > 0 && ( */}
          {id && (
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <GridContainer>
                <GridRow marginBottom={2}>
                  <GridColumn span="1/1">
                    <Text as="h3" variant="h5">
                      {formatMessage(messages.vehicleMilageInputTitle)}
                    </Text>
                  </GridColumn>
                </GridRow>
                <GridRow rowGap={[1, 1, 2, 2, 'smallGutter']}>
                  <GridColumn span={['1/1', '7/9', '6/9', '5/9', '3/9']}>
                    <InputController
                      control={control}
                      id="odometerStatus"
                      name="odometerStatus"
                      required
                      type="number"
                      suffix=" km"
                      thousandSeparator
                      backgroundColor="blue"
                      size="xs"
                      maxLength={13}
                      label={formatMessage(messages.vehicleMilageInputLabel)}
                      placeholder={formatMessage(
                        messages.vehicleMilageInputPlaceholder,
                      )}
                    />
                  </GridColumn>
                  <GridColumn
                    span={['1/1', '7/9', '6/9', '5/9', '4/9']}
                    paddingTop={[1, 1, 2, 0, 0]}
                  >
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          selected={value}
                          locale={lang}
                          label={formatMessage(messages.date)}
                          placeholderText={formatMessage(m.chooseDate)}
                          handleChange={onChange}
                          required
                          backgroundColor="blue"
                          id="date"
                          size="xs"
                        />
                      )}
                    />
                  </GridColumn>
                  <GridColumn
                    span={['1/1', '7/9', '6/9', '5/9', '2/9']}
                    offset={['0', '0', '0', '0', '0']}
                    paddingBottom={[1, 1, 2, 0, 0]}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      textAlign="center"
                      height="full"
                      paddingTop={'p5'}
                    >
                      <Button
                        variant="primary"
                        size="small"
                        fluid
                        type="submit"
                        // loading={loading}
                      >
                        {formatMessage(m.save)}
                      </Button>
                    </Box>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </form>
          )}
          <GridContainer>
            <GridRow marginBottom={2}>
              <GridColumn span="1/1">
                <Text as="h3" variant="h5">
                  {formatMessage(m.overview)}
                </Text>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="1/1">
                <Table.Table width="100%">
                  <Table.Head>
                    <Table.Row>
                      <Table.HeadData>{formatMessage(m.date)}</Table.HeadData>
                      <Table.HeadData align="center">
                        {formatMessage(messages.vehicleMilageRegistration)}
                      </Table.HeadData>
                      <Table.HeadData align="right">
                        {formatMessage(messages.odometer)}
                      </Table.HeadData>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row key="1">
                      <Table.Data>1</Table.Data>
                      <Table.Data align="center">2</Table.Data>
                      <Table.Data align="right">3</Table.Data>
                    </Table.Row>
                  </Table.Body>
                </Table.Table>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Stack>
      </Box>

      <FootNote
        serviceProviderID={SAMGONGUSTOFA_ID}
        notes={[{ text: formatMessage(messages.infoNote) }]}
      />
    </>
  )
}

export default VehicleMilage
