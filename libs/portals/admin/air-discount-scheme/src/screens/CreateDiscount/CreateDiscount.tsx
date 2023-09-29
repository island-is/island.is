import React, { useState } from 'react'

import {
  GridRow,
  GridColumn,
  GridContainer,
  Button,
  Input,
  Stack,
  Box,
  Text,
  Select,
} from '@island.is/island-ui/core'
import { PortalNavigation } from '@island.is/portals/core'
import {
  CreateExplicitDiscountCodeMutation,
  useCreateExplicitDiscountCodeMutation,
} from './CreateDiscount.generated'
import Modal from '../../components/Modal/Modal'
import { airDiscountSchemeNavigation } from '../../lib/navigation'

enum TypeOptionsValue {
  Normal,
  Connecting,
}

const AdminCreateDiscount = () => {
  const options = [
    {
      label: '24 tímar',
      value: '1',
    },
    {
      label: '14 dagar',
      value: '14',
    },
  ]

  const typeOptions = [
    { label: 'Venjulegt flug', value: TypeOptionsValue.Normal },
    {
      label: 'Tengiflug',
      value: TypeOptionsValue.Connecting,
    },
  ]

  const [createExplicitDiscountCode] = useCreateExplicitDiscountCodeMutation()
  const [nationalId, setNationalId] = useState('')
  const [postalcode, setPostalcode] = useState('')
  const [comment, setComment] = useState('')
  const [length, setLength] = useState(options[0])
  const [typeOfFlight, setTypeOfFlight] = useState(typeOptions[0])
  const [discountCode, setDiscountCode] = useState<
    CreateExplicitDiscountCodeMutation | undefined | null
  >(null)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '4/12', '3/12']}>
            <Box paddingBottom={4}>
              <PortalNavigation navigation={airDiscountSchemeNavigation} />
            </Box>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '8/12']}
            offset={['0', '0', '0', '0', '1/12']}
          >
            <Stack space={3}>
              <Text variant="h1" as="h1">
                Handvirkir kóðar
              </Text>

              {discountCode ? (
                <>
                  {typeOfFlight.value === TypeOptionsValue.Connecting ? (
                    <>
                      <Text variant="h2" marginBottom={1}>
                        Tengiflugs kóðar
                      </Text>
                      {discountCode?.createAirDiscountSchemeExplicitDiscountCode.connectionDiscountCodes.map(
                        (item) => (
                          <>
                            <Text variant="h3">Tengiflug - kóði</Text>
                            <Text>
                              Kóði: <strong>{item.code}</strong>
                            </Text>
                            <Text>Flug: {item.flightDesc}</Text>
                          </>
                        ),
                      )}
                      {discountCode.createAirDiscountSchemeExplicitDiscountCode
                        .connectionDiscountCodes.length === 0 && (
                        <Text>
                          Engir kóðar fundust, athugaðu að fyrst þarf að nota
                          venjulegan kóða áður en tengiflugskóðinn birtist.
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text variant="h2">
                      Venjulegur kóði:{' '}
                      {
                        discountCode
                          ?.createAirDiscountSchemeExplicitDiscountCode
                          .discountCode
                      }
                    </Text>
                  )}
                  <Text>
                    Umsýsluviðmótið geymir þessa kóða ekki. Þeir munu birtast í
                    viðmóti viðkomandi kennitöluhafa.
                  </Text>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setNationalId('')
                      setPostalcode('')
                      setComment('')
                      setDiscountCode(null)
                    }}
                  >
                    Búa til nýjan kóða
                  </Button>
                </>
              ) : (
                <>
                  <Text variant="intro">
                    Hér getur þú handvirkt búið til kóða fyrir einstaklinga.
                  </Text>
                  <Input
                    name="nationalid"
                    label="Kennitala"
                    required
                    onChange={(e) => {
                      setNationalId(e.target.value)
                    }}
                  />

                  <Input
                    name="postalcode"
                    label="Póstnúmer"
                    type="number"
                    required
                    onChange={(e) => {
                      setPostalcode(e.target.value)
                    }}
                  />

                  <Input
                    name="comment"
                    label="Athugasemd"
                    required
                    onChange={(e) => {
                      setComment(e.target.value)
                    }}
                  />
                  <Select
                    name="length"
                    label="Tegund kóða"
                    required
                    onChange={(opt) => {
                      setTypeOfFlight(
                        typeOptions.find((item) => item.value === opt?.value) ??
                          typeOptions[0],
                      )
                    }}
                    value={typeOfFlight}
                    options={typeOptions}
                  />
                  <Select
                    name="length"
                    label="Tímalengd"
                    required
                    onChange={(opt) => {
                      setLength(
                        options.find((item) => item.value === opt?.value) ??
                          options[0],
                      )
                    }}
                    value={length}
                    options={options}
                  />

                  <Button
                    disabled={[nationalId, postalcode, comment].some(
                      (val) => !val.length,
                    )}
                    onClick={() => setShowModal(true)}
                  >
                    Búa til kóða
                  </Button>
                </>
              )}
            </Stack>
          </GridColumn>
        </GridRow>
      </GridContainer>
      <Modal
        show={showModal}
        onCancel={() => setShowModal(false)}
        onContinue={() => {
          setDiscountCode(null)
          setShowModal(false)
          createExplicitDiscountCode({
            variables: {
              input: {
                nationalId: nationalId.replace('-', ''),
                postalcode: parseInt(postalcode, 10),
                comment,
                numberOfDaysUntilExpiration: parseInt(length.value, 10),
              },
            },
          }).then((data) => {
            setDiscountCode(data.data ?? undefined)
          })
        }}
        t={{
          title: 'Búa til kóða handvirkt',
          info: 'MIKILVÆGT: Sjáið til að allar upplýsingar séu réttar.',
          buttons: {
            cancel: 'Hætta við',
            continue: 'Halda áfram',
          },
        }}
      />
    </>
  )
}

export default AdminCreateDiscount
