import React, { FC, useState } from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  ProfileCard,
} from '@island.is/island-ui/core'

export interface TeamListProps {
  teamMembers: { title: string; name: string; image: { url: string } }[]
}

export const TeamList: FC<TeamListProps> = ({ teamMembers }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1)

  return (
    <GridRow>
      {teamMembers.map((member, index) => (
        <GridColumn span={['12/12', '6/12', '6/12', '4/12']} key={index}>
          <Box
            paddingBottom={3}
            height="full"
            onClick={() => setSelectedIndex(index)}
            onMouseOver={() => setSelectedIndex(index)}
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
              image={`${
                selectedIndex === index
                  ? member.imageOnSelect?.url ?? member.image.url
                  : member.image.url
              }?w=400`}
              heightFull
            />
          </Box>
        </GridColumn>
      ))}
    </GridRow>
  )
}

export default TeamList
