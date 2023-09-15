import React, { FC, useState } from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  ProfileCard,
} from '@island.is/island-ui/core'

const imagePostfix = '?w=400'

export interface TeamListProps {
  teamMembers: {
    title: string
    name: string
    image: { url: string }
    imageOnSelect: { url: string }
  }[]
}

export const TeamList: FC<React.PropsWithChildren<TeamListProps>> = ({
  teamMembers,
}) => {
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
        let image = `${member.image.url}${imagePostfix}`

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

export default TeamList
