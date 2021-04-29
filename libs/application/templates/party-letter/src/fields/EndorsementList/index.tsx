import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import gql from 'graphql-tag'
import { useMutation, useLazyQuery } from '@apollo/client'
import { Endorsement } from '../../types'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { PartyLetter } from '../../lib/dataSchema'

const GET_ENDORSEMENT_LIST = gql`
  query endorsementSystemUserEndorsements {
    endorsementSystemUserEndorsements {
      id
      endorser
      endorsementListId
      meta {
        fullName
        address
      }
      created
      modified
    }
  }
`
const CREATE_ENDORSEMENT_LIST = gql`
  mutation endorsementSystemCreateEndorsementList(
    $input: CreateEndorsementListDto!
  ) {
    endorsementSystemCreateEndorsementList(input: $input) {
      id
      title
      description
      closedDate
      endorsementMeta
      tags
      owner
    }
  }
`

const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const { lang: locale, formatMessage } = useLocale()
  const answers = (application as any).answers as PartyLetter

  const [searchTerm, setSearchTerm] = useState('')
  const [endorsements, setEndorsements] = useState<Endorsement[]>()
  const [showWarning, setShowWarning] = useState(false)

  const [createEndorsementList, { loading: creatingLoad }] = useMutation(
    CREATE_ENDORSEMENT_LIST,
  )
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [getEndorsementList, { loading, error }] = useLazyQuery(
    GET_ENDORSEMENT_LIST,
    {
      pollInterval: 2000,
      onCompleted: async ({ endorsementSystemUserEndorsements }) => {
        if (!loading && endorsementSystemUserEndorsements) {
          const hasEndorsements =
            !error && !loading && endorsementSystemUserEndorsements?.length
              ? endorsementSystemUserEndorsements.length > 0
              : false
          const mapToEndorsementList: Endorsement[] = hasEndorsements
            ? endorsementSystemUserEndorsements.map((x: any) => ({
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

  const onCreateEndorsementList = async () => {
    const createEndorsement = await createEndorsementList({
      variables: {
        input: {
          title: answers.party.name,
          description: answers.party.letter,
          endorsementMeta: ['fullName', 'address', 'signedTags'],
          tags: ['partyLetterNordausturkjordaemi2021'],
          validationRules: [],
        },
      },
    })
    if (!creatingLoad && createEndorsement.data) {
      const endorsementId =
        createEndorsement.data?.endorsementSystemCreateEndorsementList?.id ??
        undefined
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              endorsementListId: endorsementId,
              ...application.answers,
            },
          },
          locale,
        },
      }).then((response) => {
        application.answers = response.data?.updateApplication?.answers
        getEndorsementList()
      })
    }
  }

  useEffect(() => {
    if (application.answers.endorsementListId === undefined) {
      onCreateEndorsementList()
    } else {
      getEndorsementList()
    }
  })

  const namesCountString = formatMessage(
    endorsements && endorsements.length > 1
      ? m.endorsementList.namesCount
      : m.endorsementList.nameCount,
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
      <Text variant="h3" marginBottom={2} marginTop={5}>{`${
        endorsements && endorsements.length
      } ${namesCountString}`}</Text>
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
