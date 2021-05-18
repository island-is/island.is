import React, { FC, useState, useEffect } from 'react'
import { Application } from '@island.is/application/core'
import { Box, Table as T, Tooltip, Checkbox } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { Endorsement } from '../../lib/PartyApplicationTemplate'

interface EndorsementTableProps {
  application: Application
  signatures?: Endorsement[]
  selectedSignatures: Array<Endorsement>
}

const EndorsementTable: FC<EndorsementTableProps> = ({
  application,
  signatures,
  selectedSignatures,
}) => {
  const { lang: locale, formatMessage } = useLocale()
  const [selectedEndorsements, setSelectedEndorsements] = useState<
    Endorsement[]
  >([]) //todo initalize with answers.endorsements
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const dummyEndorsements: Endorsement[] = [
  {
    id: 1,
    date: '18 maí',
    name: 'Sigga',
    nationalId: '123',
    address: 'Bla',
    hasWarning: false,
  },
  {
    id: 2,
    date: '19 maí',
    name: 'Albína',
    nationalId: '234',
    address: 'Bla',
    hasWarning: false,
  },
]
  // sama hér :D
  async function updateApplicationWithEndorsements() {
    console.log("be doing the update!", selectedEndorsements)
    const LASTHOPE = selectedEndorsements
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            endorsements: LASTHOPE, // milljónth time is the charm
            ...application.answers,
          },
        },
        locale,
      },
    }).then((response) => {
      //já það prentast data og endorsements [] bara tómt array
      console.log(response) //prentast eitthvað hér? eða feilar hann áður en hann kemst hingað?
      application.answers = response.data?.updateApplication?.answers
    })
  }

  useEffect(() => {
    console.log("do we have endorsements?", selectedEndorsements)
    updateApplicationWithEndorsements()
  }, [selectedEndorsements])

  const renderRow = (endorsement: Endorsement) => {
    return (
      <T.Row key={endorsement.id}>
        <T.Data key={endorsement.id + endorsement.date}>
          {'formatDate(endorsement.date)'}
        </T.Data>
        <T.Data key={endorsement.id + endorsement.name}>
          {endorsement.name}
        </T.Data>
        <T.Data key={endorsement.id + endorsement.nationalId}>
          {'formatKennitala(endorsement.nationalId)'}
        </T.Data>
        <T.Data
          key={endorsement.id}
          box={{
            background: endorsement.hasWarning ? 'yellow200' : 'white',
            textAlign: 'right',
          }}
        >
          {endorsement.hasWarning ? (
            <Box display="flex" alignItems="center" justifyContent="flexEnd">
              {endorsement.address}
              <Box marginLeft={2}>
                <Tooltip
                  color="blue400"
                  iconSize="medium"
                  text={'Invalid blabala'}
                />
              </Box>
            </Box>
          ) : (
            endorsement.address
          )}
        </T.Data>
        <T.Data key={endorsement.id + 'something'}>
          <Checkbox
            checked={false} // bera saman með contains id
            onChange={() =>
              setSelectedEndorsements((currEndorsements) => [
                ...currEndorsements,
                endorsement,
              ])
            }
          />
        </T.Data>
      </T.Row>
    )
  }

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>{formatMessage(m.endorsementList.thDate)}</T.HeadData>
          <T.HeadData>{formatMessage(m.endorsementList.thName)}</T.HeadData>
          <T.HeadData>
            {formatMessage(m.endorsementList.thNationalNumber)}
          </T.HeadData>
          <T.HeadData box={{ textAlign: 'right' }}>
            {formatMessage(m.endorsementList.thAddress)}
          </T.HeadData>
          <T.HeadData></T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {signatures &&
          signatures.length &&
          signatures.map((signature, index) => renderRow(signature))}
      </T.Body>
    </T.Table>
  )
}

export default EndorsementTable
