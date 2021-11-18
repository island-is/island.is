import React from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
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
import { getSlugFromType } from '@island.is/application/core'

export type UserEndorsement = Pick<
  Endorsement,
  'id' | 'created' | 'endorsementList'
>
export type RegionsEndorsementList = Pick<
  EndorsementList,
  'id' | 'title' | 'description' | 'meta' | 'closedDate'
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
        closedDate
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
      meta
      closedDate
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
  [EndorsementListOpenTagsEnum.GeneralPetition]: 'General Petition',
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

const isLocalhost = window.location.origin.includes('localhost')
const isDev = window.location.origin.includes('beta.dev01.devland.is')
const isStaging = window.location.origin.includes('beta.staging01.devland.is')

const baseUrlForm = isLocalhost
  ? 'http://localhost:4242/umsoknir'
  : isDev
  ? 'https://beta.dev01.devland.is/umsoknir'
  : isStaging
  ? 'https://beta.staging01.devland.is/umsoknir'
  : 'https://island.is/umsoknir'

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
      pollInterval: 20000,
    },
  )

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

  // all endorsement lists that are not signed and still open
  const endorsementLists = allEndorsementLists.filter(
    ({ id, closedDate }) => !signedLists.includes(id) && closedDate === null,
  )

  // party-application lists
  const applicationLists = endorsementLists.filter(
    (list) =>
      getEndorsementListTagNames(list.tags).join(' ') !==
      getEndorsementListTagNames([
        EndorsementListOpenTagsEnum.PartyLetter2021,
      ]).join(' '),
  )

  // party-letter application lists
  const partyLetterLists = endorsementLists.filter(
    (list) =>
      getEndorsementListTagNames(list.tags).join(' ') ===
      getEndorsementListTagNames([
        EndorsementListOpenTagsEnum.PartyLetter2021,
      ]).join(' '),
  )

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h3" as="h1">
          {formatMessage(m.endorsement.introTitle)}
        </Text>

        <Text as="p" variant="default">
          {formatMessage(m.endorsement.intro)}
        </Text>
      </Stack>
      {endorsements && endorsements.length > 0 && (
        <>
          <Text variant="h4" as="h3" marginTop={4} marginBottom={2}>
            {formatMessage(m.endorsement.myEndorsements)}
          </Text>
          <Stack space={4}>
            {endorsements.map((endorsement) => {
              const tagLabel = getEndorsementListTagNames(
                endorsement.endorsementList?.tags ?? [],
              ).join(' ')
              return (
                <ActionCard
                  key={endorsement.id}
                  backgroundColor="blue"
                  eyebrow={formatDate(endorsement.created, 'dd.MM.yyyy')}
                  heading={`${endorsement.endorsementList?.title} (${endorsement.endorsementList?.description})`}
                  tag={{
                    label: tagLabel,
                    variant: 'darkerBlue',
                    outlined: false,
                  }}
                  text={
                    tagLabel !==
                    getEndorsementListTagNames([
                      EndorsementListOpenTagsEnum.PartyLetter2021,
                    ]).join(' ')
                      ? userVoterRegion?.regionName ?? ''
                      : ''
                  }
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
                    disabled: endorsement.endorsementList?.closedDate !== null,
                  }}
                />
              )
            })}
          </Stack>
        </>
      )}
      {applicationLists && applicationLists.length > 0 && (
        <>
          <Text variant="h3" marginTop={8} marginBottom={2}>
            {formatMessage(m.endorsement.availablePartyApplicationEndorsements)}
          </Text>
          <Stack space={4}>
            {applicationLists.map((endorsementList) => (
              <ActionCard
                key={endorsementList.id}
                heading={endorsementList.title}
                eyebrow={getEndorsementListTagNames(endorsementList.tags).join(
                  ' ',
                )}
                tag={{
                  label: getEndorsementListTagNames(endorsementList.tags).join(
                    ' ',
                  ),
                  variant: 'blue',
                  outlined: false,
                }}
                text={endorsementList.description ?? ''}
                cta={{
                  label: formatMessage(m.endorsement.actionCardButtonEndorse),
                  variant: 'text',
                  icon: undefined,
                  onClick: () => {
                    window.open(
                      `${baseUrlForm}/${
                        getSlugFromType(
                          endorsementList.meta.applicationTypeId,
                        ) as string
                      }/${endorsementList.meta.applicationId}`,
                    )
                  },
                }}
              />
            ))}
          </Stack>
        </>
      )}
      {partyLetterLists && partyLetterLists.length > 0 && (
        <>
          <Text variant="h3" marginTop={8} marginBottom={2}>
            {formatMessage(m.endorsement.availablePartyLetterEndorsements)}
          </Text>
          <Stack space={4}>
            {partyLetterLists.map((endorsementList) => (
              <ActionCard
                key={endorsementList.id}
                heading={endorsementList.title}
                eyebrow={getEndorsementListTagNames(endorsementList.tags).join(
                  ' ',
                )}
                tag={{
                  label: getEndorsementListTagNames(endorsementList.tags).join(
                    ' ',
                  ),
                  variant: 'blue',
                  outlined: false,
                }}
                text={endorsementList.description ?? ''}
                cta={{
                  label: formatMessage(m.endorsement.actionCardButtonEndorse),
                  variant: 'text',
                  icon: undefined,
                  onClick: () => {
                    window.open(
                      `${baseUrlForm}/${
                        getSlugFromType(
                          endorsementList.meta.applicationTypeId,
                        ) as string
                      }/${endorsementList.meta.applicationId}`,
                    )
                  },
                }}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  )
}

export default Endorsements
