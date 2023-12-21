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

import Modal from '../../components/Modal/Modal'
import { airDiscountSchemeNavigation } from '../../lib/navigation'

import {
  CreateSuperExplicitDiscountCodeMutation,
  useCreateSuperExplicitDiscountCodeMutation,
} from './SuperDiscount.generated'
import { Problem, ProblemTypes } from '@island.is/react-spa/shared'

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
    { label: 'Nei', value: false },
    {
      label: 'Já',
      value: true,
    },
  ]

  const possibleFlightLegs = [
    { label: 'Aðra leið', value: 1 },
    { label: 'Báðar leiðir', value: 2 },
  ]

  const [createSuperExplicitDiscountCode] =
    useCreateSuperExplicitDiscountCodeMutation()
  const [nationalId, setNationalId] = useState('')
  const [postalcode, setPostalcode] = useState('')
  const [comment, setComment] = useState('')
  const [length, setLength] = useState(options[0])
  const [flightLegs, setFlightLegs] = useState(possibleFlightLegs[0])
  const [needsConnecting, setNeedsConnecting] = useState(typeOptions[0])
  const [discountCode, setDiscountCode] = useState<
    CreateSuperExplicitDiscountCodeMutation | undefined | null
  >(undefined)
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
                Handvirkir kóðar án skilyrða
              </Text>

              {discountCode ? (
                <>
                  {discountCode?.createAirDiscountSchemeSuperExplicitDiscountCode?.map(
                    (item, i) => {
                      return (
                        <>
                          <Text variant="h2">Leið {i + 1}</Text>
                          <Text variant="h3">
                            Venjulegur kóði: {item.discountCode}
                          </Text>
                          {!!item.connectionDiscountCodes.length &&
                            item.connectionDiscountCodes.map(
                              (connectionCode) => {
                                return (
                                  <Text variant="h3">
                                    Tengiflugs kóði: {connectionCode.code}
                                  </Text>
                                )
                              },
                            )}
                        </>
                      )
                    },
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
                      setFlightLegs(possibleFlightLegs[0])
                    }}
                  >
                    Búa til nýjan kóða
                  </Button>
                </>
              ) : discountCode === null ? (
                <Problem
                  type={ProblemTypes.notFound}
                  title="Villa"
                  message="Kennitala gæti verið röng eða þessi notandi er búinn með sína leggi"
                />
              ) : (
                <>
                  <Text variant="intro">
                    Hér getur þú handvirkt búið til kóða án skilyrða fyrir
                    einstaklinga.
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
                    label="Þarf tengiflug"
                    required
                    onChange={(opt) => {
                      setNeedsConnecting(
                        typeOptions.find((item) => item.value === opt?.value) ??
                          typeOptions[0],
                      )
                    }}
                    value={needsConnecting}
                    options={typeOptions}
                  />
                  <Select
                    name="flightLegs"
                    label="Leið"
                    required
                    onChange={(opt) => {
                      setFlightLegs(
                        possibleFlightLegs.find(
                          (item) => item.value === opt?.value,
                        ) ?? possibleFlightLegs[0],
                      )
                    }}
                    value={flightLegs}
                    options={possibleFlightLegs}
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
          setDiscountCode(undefined)
          setShowModal(false)

          createSuperExplicitDiscountCode({
            variables: {
              input: {
                nationalId: nationalId.replace('-', ''),
                postalcode: Number.parseInt(postalcode, 10),
                comment,
                numberOfDaysUntilExpiration: Number.parseInt(length.value, 10),
                isExplicit: true,
                flightLegs: flightLegs.value,
                needsConnectionFlight: needsConnecting.value,
              },
            },
          })
            .then((data) => {
              setDiscountCode(data.data ?? null)
            })
            .catch(() => setDiscountCode(null))
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
