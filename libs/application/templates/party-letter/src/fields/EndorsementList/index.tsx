import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client'
import { Endorsement } from '../../types'

const GET_ENDORSEMENT_LIST = gql`
  query endorsementSystemGetEndorsements($input: FindEndorsementListInput!) {
    endorsementSystemGetEndorsements(input: $input) {
      id
      endorser
      meta {
        fullName
        address
      }
      created
      modified
    }
  }
`

const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const { formatMessage } = useLocale()

  const [searchTerm, setSearchTerm] = useState('')
  const [endorsements, setEndorsements] = useState<Endorsement[]>()
  const [showWarning, setShowWarning] = useState(false)

  const [getEndorsementList, { loading, error }] = useLazyQuery(
    GET_ENDORSEMENT_LIST,
    {
      pollInterval: 2000,
      onCompleted: async ({ endorsementSystemGetEndorsements }) => {
        if (!loading && endorsementSystemGetEndorsements) {
          const hasEndorsements =
            !error && !loading && endorsementSystemGetEndorsements?.length
              ? endorsementSystemGetEndorsements.length > 0
              : false
          const mapToEndorsementList: Endorsement[] = hasEndorsements
            ? endorsementSystemGetEndorsements.map((x: any) => ({
                date: x.created,
                name: x.meta.fullName,
                nationalId: x.endorser,
                address: x.meta.address ? x.meta.address : '',
                hasWarning: false,
                id: x.id,
              }))
            : undefined
          setEndorsements(mapToEndorsementList)
        }
      },
    },
  )

  useEffect(() => {
    getEndorsementList({
      variables: {
        input: {
          listId: endorsementListId,
        },
      },
    })
  }, [])

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
        {endorsements && endorsements.length > 0 && (
          <EndorsementTable
            application={application}
            endorsements={endorsements}
          />
        )}
      </Box>
    </Box>
  )
}

export default EndorsementList
