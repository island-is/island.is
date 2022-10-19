import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import { NotFound } from '@island.is/air-discount-scheme-web/screens'
import { UserContext } from '@island.is/air-discount-scheme-web/context'
import {
  GridRow,
  GridColumn,
  GridContainer,
  ButtonDeprecated as Button,
  Input,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { Screen } from '../../types'
import { Modal } from './components'

const CreateExplicitDiscountCodeMutation = gql`
  mutation CreateExplicitDiscountCodeMutation(
    $input: CreateExplicitDiscountCodeInput!
  ) {
    createExplicitDiscountCode(input: $input) {
      discountCode
    }
  }
`

const AdminCreateDiscount: Screen = () => {
  const { user } = useContext(UserContext)
  const [
    createExplicitDiscountCode,
    { loading: _createExplicitDiscountCodeLoading },
  ] = useMutation(CreateExplicitDiscountCodeMutation)

  const [nationalId, setNationalId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [postalcode, setPostalcode] = useState('')
  const [city, setCity] = useState('')

  const [discountCode, setDiscountCode] = useState('')

  const [showModal, setShowModal] = useState(false)

  if (!user || !['admin', 'developer'].includes(user?.role)) {
    return <NotFound />
  }

  return (
    <>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '7/12', '8/12', '9/12']}>
            {discountCode.length ? (
              <>
                <h1>{discountCode}</h1>
                <p>
                  Látið viðkomandi hafa kóðann hér að ofan. Takið skjáskot eða
                  skrifið niður. Umsýsluviðmótið geymir þessa kóða ekki.
                </p>
              </>
            ) : (
              <Stack space={'gutter'}>
                <Input
                  name="nationalid"
                  label="Kennitala"
                  required
                  onChange={(e) => {
                    setNationalId(e.target.value)
                  }}
                />

                <Input
                  name="firstname"
                  label="Fornafn"
                  required
                  onChange={(e) => {
                    setFirstName(e.target.value)
                  }}
                />
                <Input
                  name="middlename"
                  label="Millinafn"
                  onChange={(e) => {
                    setMiddleName(e.target.value)
                  }}
                />

                <Input
                  name="lastname"
                  label="Eftirnafn"
                  required
                  onChange={(e) => {
                    setLastName(e.target.value)
                  }}
                />

                <Select
                  name="gender"
                  label="Kyn"
                  options={[
                    {
                      label: 'Karlkyn',
                      value: 'kk',
                    },
                    {
                      label: 'Kvenkyn',
                      value: 'kvk',
                    },
                    {
                      label: 'Kynsegin',
                      value: 'hvk',
                    },
                  ]}
                  required
                  onChange={(e: { value: string; label: string }) => {
                    setGender(e.value)
                  }}
                />

                <Input
                  name="address"
                  label="Heimilisfang"
                  required
                  onChange={(e) => {
                    setAddress(e.target.value)
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
                  name="city"
                  label="Bæjarfélag"
                  required
                  onChange={(e) => {
                    setCity(e.target.value)
                  }}
                />

                <Button
                  disabled={[
                    nationalId,
                    firstName,
                    lastName,
                    gender,
                    address,
                    postalcode,
                    city,
                  ].some((val) => !val.length)}
                  onClick={() => setShowModal(true)}
                >
                  Búa til kóða
                </Button>
              </Stack>
            )}
          </GridColumn>
        </GridRow>
      </GridContainer>
      <Modal
        show={showModal}
        onCancel={() => setShowModal(false)}
        onContinue={() => {
          setDiscountCode('...bíðið andartak')
          setShowModal(false)
          createExplicitDiscountCode({
            variables: {
              input: {
                nationalId,
                firstName,
                middleName,
                lastName,
                gender,
                address,
                postalcode: parseInt(postalcode, 10),
                city,
              },
            },
          }).then((data) => {
            setDiscountCode(data.data.createExplicitDiscountCode.discountCode)
          })
        }}
        t={{
          title: 'Búa til kóða handvirkt',
          info:
            'MIKILVÆGT: nótið niður kóða, og notanda ,því ekki er hægt að nálgast kóðann seinna. Sjáið til að allar upplýsingar séu réttar.',
          buttons: {
            cancel: 'Hætta við',
            continue: 'Halda áfram',
          },
        }}
      />
    </>
  )
}

AdminCreateDiscount.getInitialProps = () => ({})

export default AdminCreateDiscount
