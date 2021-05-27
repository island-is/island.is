import React from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { formatDate } from '@island.is/judicial-system/formatters'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { m } from '../../lib/messages'
import {
  Endorsement,
  EndorsementList,
  EndorsementListOpenTagsEnum,
  TemporaryVoterRegistry,
} from '../../types/schema'

export type UserEndorsement = Pick<
  Endorsement,
  'id' | 'created' | 'endorsementList'
>
export type RegionsEndorsementList = Pick<
  EndorsementList,
  'id' | 'title' | 'description'
> & { tags: EndorsementListOpenTagsEnum[] }

export type UserVoterRegion = Pick<
  TemporaryVoterRegistry,
  'regionNumber' | 'regionName'
>
interface UserEndorsementsResponse {
  endorsementSystemUserEndorsements: UserEndorsement[]
}
interface EndorsementListResponse {
  endorsementSystemFindEndorsementLists: RegionsEndorsementList[]
}
interface EndorseListResponse {
  endorsementSystemEndorseList: UserEndorsement
}
interface UserVoterRegionResponse {
  temporaryVoterRegistryGetVoterRegion: UserVoterRegion
}

const GET_USER_ENDORSEMENTS = gql`
  query endorsementSystemUserEndorsements {
    endorsementSystemUserEndorsements {
      id
      endorser
      endorsementList {
        id
        title
        description
        tags
      }
      meta {
        fullName
        address
      }
      created
      modified
    }
  }
`
const GET_REGION_ENDORSEMENTS = gql`
  query endorsementSystemFindEndorsementLists(
    $input: FindEndorsementListByTagsDto!
  ) {
    endorsementSystemFindEndorsementLists(input: $input) {
      id
      title
      description
      tags
    }
  }
`

const ENDORSE_LIST = gql`
  mutation endorseList($input: FindEndorsementListInput!) {
    endorsementSystemEndorseList(input: $input) {
      id
      endorser
      endorsementList {
        id
        title
        description
        tags
      }
      meta {
        fullName
        address
      }
      created
      modified
    }
  }
`

const UNENDORSE_LIST = gql`
  mutation unendorseList($input: FindEndorsementListInput!) {
    endorsementSystemUnendorseList(input: $input)
  }
`

const USER_VOTER_REGION = gql`
  query getVoterRegion {
    temporaryVoterRegistryGetVoterRegion {
      regionNumber
      regionName
    }
  }
`

const endorsementListTagNameMap = {
  [EndorsementListOpenTagsEnum.PartyLetter2021]: 'Listabókstafur',
  [EndorsementListOpenTagsEnum.PartyApplicationNordausturkjordaemi2021]:
    'Alþingiskosningar 2021 - Norðausturkjördæmi',
  [EndorsementListOpenTagsEnum.PartyApplicationNordvesturkjordaemi2021]:
    'Alþingiskosningar 2021 - Norðvesturkjördæmi',
  [EndorsementListOpenTagsEnum.PartyApplicationReykjavikurkjordaemiNordur2021]:
    'Alþingiskosningar 2021 - Reykjavíkurkjördæmi Norður',
  [EndorsementListOpenTagsEnum.PartyApplicationReykjavikurkjordaemiSudur2021]:
    'Alþingiskosningar 2021 - Reykjavíkurkjördæmi Suður',
  [EndorsementListOpenTagsEnum.PartyApplicationSudurkjordaemi2021]:
    'Alþingiskosningar 2021 - Suðurkjördæmi',
  [EndorsementListOpenTagsEnum.PartyApplicationSudvesturkjordaemi2021]:
    'Alþingiskosningar 2021 - Suðvesturkjördæmi',
}
const getEndorsementListTagNames = (tags: EndorsementListOpenTagsEnum[]) =>
  tags.map((tag) => endorsementListTagNameMap[tag])

const regionNumberEndorsementListTagMap = {
  1: EndorsementListOpenTagsEnum.PartyApplicationReykjavikurkjordaemiSudur2021,
  2: EndorsementListOpenTagsEnum.PartyApplicationReykjavikurkjordaemiNordur2021,
  3: EndorsementListOpenTagsEnum.PartyApplicationSudvesturkjordaemi2021,
  4: EndorsementListOpenTagsEnum.PartyApplicationNordvesturkjordaemi2021,
  5: EndorsementListOpenTagsEnum.PartyApplicationNordausturkjordaemi2021,
  6: EndorsementListOpenTagsEnum.PartyApplicationSudurkjordaemi2021,
}

const Endorsements = () => {
  const { formatMessage } = useLocale()

  // get user voter region
  const { data: userVoterRegionResponse } = useQuery<UserVoterRegionResponse>(
    USER_VOTER_REGION,
  )
  const userVoterRegion =
    userVoterRegionResponse?.temporaryVoterRegistryGetVoterRegion

  const endorsementListTags = [EndorsementListOpenTagsEnum.PartyLetter2021]

  if (userVoterRegion && userVoterRegion.regionNumber > 0) {
    endorsementListTags.push(
      regionNumberEndorsementListTagMap[
        userVoterRegion.regionNumber as keyof typeof regionNumberEndorsementListTagMap
      ],
    )
  }

  // get all endorsement lists this user should see
  const {
    data: endorsementResponse,
    refetch: refetchUserEndorsements,
  } = useQuery<UserEndorsementsResponse>(GET_USER_ENDORSEMENTS)
  const { data: endorsementListsResponse } = useQuery<EndorsementListResponse>(
    GET_REGION_ENDORSEMENTS,
    {
      variables: {
        input: {
          tags: endorsementListTags,
        },
      },
    },
  )

  const [endorseList] = useMutation<EndorseListResponse>(ENDORSE_LIST, {
    onCompleted: () => {
      refetchUserEndorsements()
    },
  })
  const [unendorseList] = useMutation<boolean>(UNENDORSE_LIST, {
    onCompleted: () => {
      refetchUserEndorsements()
    },
  })

  const allEndorsementLists =
    endorsementListsResponse?.endorsementSystemFindEndorsementLists ?? []
  const endorsements =
    endorsementResponse?.endorsementSystemUserEndorsements ?? []
  const signedLists = endorsements.map(
    ({ endorsementList }) => endorsementList?.id,
  )
  const endorsementLists = allEndorsementLists.filter(
    ({ id }) => !signedLists.includes(id),
  )

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.endorsement.introTitle}
        intro={m.endorsement.intro}
      />
      {endorsements && endorsements.length > 0 && (
        <>
          <Text variant="h3" marginTop={4} marginBottom={2}>
            {formatMessage(m.endorsement.myEndorsements)}
          </Text>
          <Stack space={4}>
            {endorsements.map((endorsement) => {
              return (
                <ActionCard
                  key={endorsement.id}
                  backgroundColor="blue"
                  eyebrow={formatDate(endorsement.created, 'dd.MM.yyyy')}
                  heading={`${endorsement.endorsementList?.title} (${endorsement.endorsementList?.description})`}
                  tag={{
                    label: getEndorsementListTagNames(
                      endorsement.endorsementList?.tags ?? [],
                    ).join(' '),
                    variant: 'darkerBlue',
                    outlined: false,
                  }}
                  text="Kjördæmi"
                  cta={{
                    label: formatMessage(
                      m.endorsement.actionCardButtonUnendorse,
                    ),
                    variant: 'text',
                    icon: undefined,
                    onClick: () =>
                      unendorseList({
                        variables: {
                          input: { listId: endorsement.endorsementList?.id },
                        },
                      }),
                  }}
                />
              )
            })}
          </Stack>
        </>
      )}
      <Text variant="h3" marginTop={8} marginBottom={2}>
        {formatMessage(m.endorsement.availableEndorsements)}
      </Text>
      <Stack space={4}>
        {endorsementLists.map((endorsementList) => (
          <ActionCard
            key={endorsementList.id}
            heading={endorsementList.title}
            eyebrow={getEndorsementListTagNames(endorsementList.tags).join(' ')}
            tag={{
              label: getEndorsementListTagNames(endorsementList.tags).join(' '),
              variant: 'blue',
              outlined: false,
            }}
            text={endorsementList.description ?? ''}
            cta={{
              label: formatMessage(m.endorsement.actionCardButtonEndorse),
              variant: 'text',
              icon: undefined,
              onClick: () =>
                endorseList({
                  variables: {
                    input: { listId: endorsementList.id },
                  },
                }),
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default Endorsements
