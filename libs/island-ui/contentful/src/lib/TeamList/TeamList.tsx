import React, { useState } from 'react'
import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridRow,
  ProfileCard,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type { Slice } from '../richTextRendering'
import { richText } from '../RichTextRC/RichText'

import * as styles from './TeamList.css'

const imagePostfix = '?w=400'

export interface TeamListProps {
  teamMembers: {
    title: string
    name: string
    image?: { url: string }
    imageOnSelect?: { url: string } | null
    intro?: Slice[] | null
  }[]
  variant?: 'card' | 'accordion'
}

export const TeamMemberCardList = ({
  teamMembers,
}: Omit<TeamListProps, 'variant'>) => {
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const [loadedImageUrls, setLoadedImageUrls] = useState<
    Record<string, boolean>
  >({})

  const updateSelectedIndex = (index: number) => {
    setSelectedIndex(index)

    let selectedImageUrl = teamMembers[index]?.imageOnSelect?.url

    if (!selectedImageUrl) {
      return
    }

    selectedImageUrl += imagePostfix

    if (loadedImageUrls[selectedImageUrl] === true) return

    const selectedImage = new Image()

    selectedImage.onload = () => {
      setLoadedImageUrls((prevState) => ({
        ...prevState,
        [selectedImageUrl]: true,
      }))
    }

    selectedImage.src = selectedImageUrl
  }

  return (
    <GridRow>
      {teamMembers.map((member, index) => {
        let image = member.image?.url
          ? `${member.image.url}${imagePostfix}`
          : undefined

        if (selectedIndex === index && member.imageOnSelect?.url) {
          const selectedImageUrl = `${member.imageOnSelect.url}${imagePostfix}`
          const selectedImageHasLoaded = loadedImageUrls[selectedImageUrl]

          if (selectedImageHasLoaded) {
            image = selectedImageUrl
          }
        }

        return (
          <GridColumn
            span={['12/12', '6/12', '12/12', '6/12', '4/12']}
            key={index}
          >
            <Box
              paddingBottom={3}
              height="full"
              onClick={() => updateSelectedIndex(index)}
              onMouseOver={() => updateSelectedIndex(index)}
              onMouseLeave={() => {
                // When the mouse leaves then we set the selected index to -1 if no other index got selected
                setSelectedIndex((prevIndex) => {
                  if (prevIndex !== index) return prevIndex
                  return -1
                })
              }}
            >
              <ProfileCard
                title={member.name}
                description={member.title}
                image={image}
                heightFull
              />
            </Box>
          </GridColumn>
        )
      })}
    </GridRow>
  )
}

const TeamMemberAccordionList = ({
  teamMembers,
}: Omit<TeamListProps, 'variant'>) => {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [loadedImageUrls, setLoadedImageUrls] = useState<
    Record<string, boolean>
  >({})

  const updateSelectedIndex = (index: number) => {
    setSelectedIndex(index)

    let selectedImageUrl = teamMembers[index]?.imageOnSelect?.url

    if (!selectedImageUrl) {
      return
    }

    selectedImageUrl += imagePostfix

    if (loadedImageUrls[selectedImageUrl] === true) return

    const selectedImage = new Image()

    selectedImage.onload = () => {
      setLoadedImageUrls((prevState) => ({
        ...prevState,
        [selectedImageUrl]: true,
      }))
    }

    selectedImage.src = selectedImageUrl
  }

  return (
    <Accordion>
      {teamMembers.map((member, index) => {
        let image = member.image?.url
          ? `${member.image.url}${imagePostfix}`
          : undefined

        if (selectedIndex === index && member.imageOnSelect?.url) {
          const selectedImageUrl = `${member.imageOnSelect.url}${imagePostfix}`
          const selectedImageHasLoaded = loadedImageUrls[selectedImageUrl]

          if (selectedImageHasLoaded) {
            image = selectedImageUrl
          }
        }

        const id = `${member.name}-${member.title}`

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
              <GridColumn span={['1/1', '1/1', '1/1', '1/1', '3/12']}>
                <Box
                  onClick={() => updateSelectedIndex(index)}
                  onMouseOver={() => updateSelectedIndex(index)}
                  onMouseLeave={() => {
                    // When the mouse leaves then we set the selected index to -1 if no other index got selected
                    setSelectedIndex((prevIndex) => {
                      if (prevIndex !== index) return prevIndex
                      return -1
                    })
                  }}
                >
                  <img src={image} alt="" className={styles.teamMemberImage} />
                </Box>
              </GridColumn>
              <GridColumn span={['1/1', '1/1', '1/1', '1/1', '9/12']}>
                <Text as="div">{richText(member.intro ?? [])}</Text>
              </GridColumn>
            </GridRow>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export const TeamList = ({ teamMembers, variant = 'card' }: TeamListProps) => {
  if (variant === 'card') {
    return <TeamMemberCardList teamMembers={teamMembers} />
  }
  return <TeamMemberAccordionList teamMembers={teamMembers} />
}

export default TeamList
