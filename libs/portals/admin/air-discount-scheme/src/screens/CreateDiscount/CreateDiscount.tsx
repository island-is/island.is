import React, { useState } from 'react'

import {
  GridRow,
  GridColumn,
  GridContainer,
  ButtonDeprecated as Button,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import Modal from './components/Modal/Modal'
import { useCreateExplicitDiscountCodeMutation } from './CreateDiscount.generated'

const AdminCreateDiscount = () => {
  const [createExplicitDiscountCode] = useCreateExplicitDiscountCodeMutation()

  const [nationalId, setNationalId] = useState('')
  const [postalcode, setPostalcode] = useState('')
  const [comment, setComment] = useState('')

  const [discountCode, setDiscountCode] = useState('')

  const [showModal, setShowModal] = useState(false)

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
                nationalId: nationalId.replace('-', ''),
                postalcode: parseInt(postalcode, 10),
                comment,
              },
            },
          }).then((data) => {
            setDiscountCode(
              data.data?.createAirDiscountSchemeExplicitDiscountCode
                .discountCode ?? '',
            )
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
