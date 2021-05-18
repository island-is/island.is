import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, RadioButton } from '@island.is/island-ui/core'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { constituencyMapper } from './../../constants'
import { Constituencies } from '../../types'
import { Endorsement } from '../../../src/lib/PartyApplicationTemplate'

const SIGNATURES: Endorsement[] = [
  {
    id: 1,
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalId: '1991921335',
    address: 'Baugholt 15',
    hasWarning: false,
  },
  {
    id: 2,
    date: '21.01.2021',
    name: 'Þórhildur Tyrfingsdóttir',
    nationalId: '1991921335',
    address: 'Miðskógar 17',
    hasWarning: false,
  },
  {
    id: 3,
    date: '21.01.2021',
    name: 'Stefán Haukdal',
    nationalId: '1991921335',
    address: 'Skúr hjá mömmu',
    hasWarning: false,
  },
  {
    id: 4,
    date: '21.01.2021',
    name: 'Brian Johannesen',
    nationalId: '1991921335',
    address: 'Reykjavík',
    hasWarning: false,
  },
  {
    id: 5,
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalId: '1991921335',
    address: 'Baugholt 15',
    hasWarning: false,
  },
  {
    id: 6,
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalId: '1991921335',
    address: 'Baugholt 15',
    hasWarning: true,
  },
]

const EndorsementListSubmission: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const [signatures, setSignatures] = useState(SIGNATURES)
  let [autoSelect, setAutoSelect] = useState(false)
  let [chooseManually, setChooseManually] = useState(false)

  const [selectedSignatures, setSelectedSignatures] = useState(
    [] as Array<Endorsement>,
  )

  const maxEndorsements =
    constituencyMapper[application.answers.constituency as Constituencies].high
  const autoSelectRadioLabel = 'Senda inn fyrstu ' + maxEndorsements

  /*useEffect(() => {
    console.log(selectedSignatures.length)
    if(selectedSignatures.length < maxEndorsements && selectedSignatures.length !== 0) {
      setAutoSelect(autoSelect = false)
      setChooseManually(chooseManually = true)
      console.log('hæ')
    }
  }, [selectedSignatures])*/

  return (
    <Box marginBottom={8}>
      <Text>{formatMessage(m.endorsementListSubmission.description)}</Text>

      {signatures && signatures.length > 0 && (
        <Box>
          <Box
            marginTop={3}
            marginBottom={3}
            display="flex"
            alignItems="center"
            justifyContent="flexStart"
          >
            <RadioButton
              id="autoSelect"
              label={autoSelectRadioLabel}
              checked={!!autoSelect}
              onChange={() => {
                setAutoSelect((autoSelect = true))
                setChooseManually((chooseManually = false))
                signatures.map((s, i) => {
                  const signatureExists = selectedSignatures.some(
                    (sig: any) => sig.id === s.id,
                  )

                  if (i <= maxEndorsements) {
                    //s.selectedForSubmission = true // svo er spurning hvort það sé ekki þægilegra ða þetta sé bara einn component.. eða amk að þessi haldi utanum state-ið allt og taflan bara töfluna og ekkert annað.. er bara dumb UI
                    if (!signatureExists) {
                      selectedSignatures.push(s)
                    }
                  }
                })
                setSelectedSignatures(selectedSignatures)
              }}
            />
            <Box marginLeft={5}>
              <RadioButton
                id="chooseManually"
                label="Valið af handahófi"
                checked={!!chooseManually}
                onChange={() => {
                  setAutoSelect((autoSelect = false))
                  setChooseManually((chooseManually = true))
                  signatures.map((s) => {
                    // s.selectedForSubmission = false
                    setSelectedSignatures([])
                  })
                }}
              />
            </Box>
          </Box>

          <EndorsementTable
            application={application}
            signatures={signatures}
            selectedSignatures={selectedSignatures}
          />
        </Box>
      )}
    </Box>
  )
}

export default EndorsementListSubmission
