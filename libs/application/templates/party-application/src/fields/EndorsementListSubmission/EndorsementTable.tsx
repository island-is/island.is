import React, { FC, useState, useEffect } from 'react'
import { Application } from '@island.is/application/core'
import { Box, Table as T, Tooltip, Checkbox } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import {
  PartyApplicationAnswers,
  Endorsement,
} from '../../lib/PartyApplicationTemplate'
import format from 'date-fns/format'
import { format as formatKennitala } from 'kennitala'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

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
  const answers = (application as any).answers as PartyApplicationAnswers
  const [selectedEndorsements, setSelectedEndorsements] = useState<
    Endorsement[]
  >(answers.endorsements ?? [])
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const updateApplicationWithEndorsements = async () => {
    const updatedAnswers = {
      ...answers,
      endorsements: selectedEndorsements,
    }
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...updatedAnswers,
          },
        },
        locale,
      },
    })
  }

  useEffect(() => {
    updateApplicationWithEndorsements()
  }, [selectedEndorsements])

  const renderRow = (endorsement: Endorsement) => {
    return (
      <T.Row key={endorsement.id}>
        <T.Data>{formatDate(endorsement.date)}</T.Data>
        <T.Data>{endorsement.name}</T.Data>
        <T.Data
          box={{
            background: endorsement.hasWarning ? 'yellow200' : 'white',
          }}
        >
          {formatKennitala(endorsement.nationalId)}
        </T.Data>
        <T.Data
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
                  text={'Invalid blabala'} // todo bæta við réttum texta hér
                />
              </Box>
            </Box>
          ) : (
            endorsement.address
          )}
        </T.Data>
        <T.Data
          box={{
            background: endorsement.hasWarning ? 'yellow200' : 'white',
          }}
        >
          <Checkbox
            checked={selectedEndorsements?.some((e) => e.id === endorsement.id)}
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
