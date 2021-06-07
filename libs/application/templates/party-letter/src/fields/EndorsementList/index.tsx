import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useMutation } from '@apollo/client'
import { Endorsement, PartyLetter } from '../../lib/dataSchema'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import { useEndorsements } from '../../hooks/useFetchEndorsements'
import BulkUpload from '../BulkUpload'

const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const { lang: locale, formatMessage } = useLocale()
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const answers = application.answers as PartyLetter
  const [searchTerm, setSearchTerm] = useState('')
  const [endorsements, setEndorsements] = useState<Endorsement[] | undefined>()
  const [updateOnBulkImport, setUpdateOnBulkImport] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const endorsementsHook = useEndorsements(endorsementListId, true)
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const updateApplicationWithEndorsements = async (
    newEndorsements: Endorsement[],
  ) => {
    const updatedAnswers = {
      ...answers,
      endorsements: cloneDeep(newEndorsements),
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
    }).then(() => {
      set(answers, 'endorsements', cloneDeep(newEndorsements))
    })
  }

  useEffect(() => {
    const mapToEndorsementList: Endorsement[] | undefined =
      endorsementsHook && endorsementsHook.length > 0
        ? endorsementsHook.map((x: any) => ({
            date: x.created,
            name: x.meta.fullName,
            nationalId: x.endorser,
            address: x.meta.address ? x.meta.address.streetAddress : '',
            hasWarning: x.meta.invalidated ?? false,
            id: x.id,
            bulkImported: x.meta?.bulkEndorsement ?? false,
          }))
        : undefined
    setEndorsements((_) => {
      if (mapToEndorsementList && mapToEndorsementList.length > 0)
        updateApplicationWithEndorsements(mapToEndorsementList)
      return mapToEndorsementList
    })
  }, [endorsementsHook, updateOnBulkImport])

  const namesCountString = formatMessage(
    endorsements && endorsements.length > 1
      ? m.endorsementList.namesCount
      : m.endorsementList.nameCount,
    { endorsementCount: endorsements?.length ?? 0 },
  )

  return (
    <Box marginBottom={8}>
      <Text marginBottom={3}>
        {formatMessage(m.endorsementList.linkDescription)}
      </Text>
      <CopyLink
        linkUrl={window.location.href}
        buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
      />
      <Text variant="h3" marginBottom={2} marginTop={5}>
        {`${namesCountString}`}
      </Text>
      <Box marginTop={2}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={3}
        >
          <Checkbox
            label={formatMessage(m.endorsementList.invalidEndorsements)}
            checked={showWarning}
            onChange={() => {
              setShowWarning(!showWarning)
              setSearchTerm('')
              showWarning
                ? setEndorsements(endorsements)
                : setEndorsements(
                    endorsements
                      ? endorsements.filter((x) => x.hasWarning)
                      : endorsements,
                  )
            }}
          />
          <Input
            name="searchbar"
            placeholder={formatMessage(m.endorsementList.searchbar)}
            icon="search"
            backgroundColor="blue"
            size="sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setEndorsements(
                endorsements
                  ? endorsements.filter((x) =>
                      x.name.startsWith(e.target.value),
                    )
                  : endorsements,
              )
            }}
          />
        </Box>
        <EndorsementTable
          application={application}
          endorsements={endorsements}
        />
        <Box marginY={5}>
          <BulkUpload
            application={application}
            onSuccess={() => {
              setUpdateOnBulkImport(true)
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default EndorsementList
