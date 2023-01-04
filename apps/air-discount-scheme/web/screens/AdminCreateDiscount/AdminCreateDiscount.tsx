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
  const [postalcode, setPostalcode] = useState('')
  const [comment, setComment] = useState('')

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
                  Umsýsluviðmótið geymir þessa kóða ekki. Þeir munu birtast í
                  viðmóti viðkomandi kennitöluhafa.
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

                <Button
                  disabled={[nationalId, postalcode, comment].some(
                    (val) => !val.length,
                  )}
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
                postalcode: parseInt(postalcode, 10),
                comment,
              },
            },
          }).then((data) => {
            setDiscountCode(data.data.createExplicitDiscountCode.discountCode)
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

AdminCreateDiscount.getInitialProps = () => ({})

export default AdminCreateDiscount
