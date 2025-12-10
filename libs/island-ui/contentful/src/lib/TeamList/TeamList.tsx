import React, { useRef, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  Box,
  BoxProps,
  GridColumn,
  GridRow,
  Inline,
  ProfileCard,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { type SliceType, richText } from '../RichTextRC/RichText'

import * as styles from './TeamList.css'

const imagePostfix = '?w=400'

export interface TeamListProps {
  variant?: 'card' | 'accordion'
  prefixes?: {
    email?: string
    phone?: string
  }
  teamMembers: {
    title: string
    name: string
    image?: { url: string }
    imageOnSelect?: { url: string } | null

    /** Fields below are only visible if variant is set to "accordion" */
    intro?: SliceType[] | null
    email?: string
    phone?: string
    tagGroups?: {
      groupLabel: string
      tagLabels: string[]
    }[]
  }[]
}

const loadedImageUrls = new Map<string, boolean>()

const TeamMemberImageUrlProvider = ({
  member,
  consumer,
  boxProps,
}: {
  member: TeamListProps['teamMembers'][number]
  consumer: (imageUrl: string | undefined) => React.ReactNode
  boxProps?: BoxProps
}) => {
  const initialImageUrl = member.image?.url
    ? `${member.image.url}${imagePostfix}`
    : undefined

  const isMouseOver = useRef(false)
  const [imageUrl, setImageUrl] = useState(initialImageUrl)

  const loadHoverImage = () => {
    if (!member.imageOnSelect?.url) {
      return
    }

    const hoverImageUrl = member.imageOnSelect.url
    const imageHasBeenLoaded = loadedImageUrls.has(hoverImageUrl)

    if (imageHasBeenLoaded) {
      setImageUrl(hoverImageUrl)
    } else {
      const image = new Image()
      image.onload = () => {
        loadedImageUrls.set(hoverImageUrl, true)
        if (isMouseOver.current) {
          setImageUrl(hoverImageUrl)
        }
      }
      image.src = member.imageOnSelect.url
    }
  }

  return (
    <Box
      {...boxProps}
      onClick={() => {
        isMouseOver.current = !isMouseOver.current
        if (isMouseOver.current) {
          loadHoverImage()
        } else {
          setImageUrl(initialImageUrl)
        }
      }}
      onMouseOver={() => {
        isMouseOver.current = true
        loadHoverImage()
      }}
      onMouseLeave={() => {
        isMouseOver.current = false
        setImageUrl(initialImageUrl)
      }}
    >
      {consumer(imageUrl)}
    </Box>
  )
}

export const TeamMemberCardList = ({
  teamMembers,
}: Pick<TeamListProps, 'teamMembers'>) => {
  return (
    <GridRow>
      {teamMembers.map((member, index) => {
        return (
          <GridColumn
            span={['12/12', '6/12', '12/12', '6/12', '4/12']}
            key={index}
          >
            <TeamMemberImageUrlProvider
              boxProps={{
                height: 'full',
                paddingBottom: 3,
              }}
              member={member}
              consumer={(imageUrl) => (
                <ProfileCard
                  title={member.name}
                  description={member.title}
                  image={imageUrl}
                  heightFull
                />
              )}
            />
          </GridColumn>
        )
      })}
    </GridRow>
  )
}

const TeamMemberAccordionList = ({
  teamMembers,
  prefixes,
}: Pick<TeamListProps, 'teamMembers' | 'prefixes'>) => {
  return (
    <Accordion singleExpand={false}>
      {teamMembers.map((member, index) => {
        const id = `${member.name}-${member.title}-${index}`
        return (
          <AccordionItem
            key={id}
            id={id}
            label={
              <Stack space={0}>
                <Text variant="h4">{member.name}</Text>
                <Text>{member.title}</Text>
              </Stack>
            }
            labelUse="div"
          >
            <GridRow rowGap={1}>
              {member.image?.url && (
                <GridColumn span={['1/1', '1/1', '1/1', '1/1', '3/12']}>
                  <TeamMemberImageUrlProvider
                    member={member}
                    consumer={(imageUrl) => (
                      <img
                        src={imageUrl}
                        className={styles.teamMemberImage}
                        alt=""
                      />
                    )}
                  />
                </GridColumn>
              )}
              <GridColumn span={['1/1', '1/1', '1/1', '1/1', '9/12']}>
                <Stack space={1}>
                  {member.email && (
                    <Inline space={1} alignY="center">
                      <Text fontWeight="semiBold">
                        {prefixes?.email ?? 'Netfang:'}
                      </Text>
                      <Text>
                        <span className={styles.email}>{member.email}</span>
                      </Text>
                    </Inline>
                  )}
                  {member.phone && (
                    <Inline space={1} alignY="center">
                      <Text fontWeight="semiBold">
                        {prefixes?.phone ?? 'Sími:'}
                      </Text>
                      <Text>{member.phone}</Text>
                    </Inline>
                  )}
                  {member.tagGroups?.map((tagGroup) => (
                    <Inline key={tagGroup.groupLabel} space={1} alignY="center">
                      <Text fontWeight="semiBold">{tagGroup.groupLabel}</Text>
                      <Inline space={1}>
                        <Text>{tagGroup.tagLabels.join(', ')}</Text>
                      </Inline>
                    </Inline>
                  ))}

                  <Text as="div">{richText(member.intro ?? [])}</Text>
                </Stack>
              </GridColumn>
            </GridRow>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export const TeamList = ({
  teamMembers,
  variant = 'card',
  prefixes,
}: TeamListProps) => {
  if (variant === 'accordion') {
    return (
      <TeamMemberAccordionList teamMembers={teamMembers} prefixes={prefixes} />
    )
  }
  return <TeamMemberCardList teamMembers={teamMembers} />
}

export default TeamList
