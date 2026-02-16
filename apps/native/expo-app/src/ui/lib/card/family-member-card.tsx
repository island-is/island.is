import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import chevronForward from '../../assets/icons/chevron-forward.png'
import { dynamicColor } from '../../utils'
import { Avatar } from '../avatar/avatar'
import { Typography } from '../typography/typography'

const Host = styled.View`
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
  align-items: center;
  justify-content: space-between;
`

const Content = styled.View`
  flex: 1;
`

const ImageWrap = styled.View`
  margin-right: ${({ theme }) => theme.spacing[2]}px;
`

const Title = styled(Typography)`
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const Text = styled(Typography)`
  padding-right: ${({ theme }) => theme.spacing[2]}px;
`

const Icon = styled.View`
  margin-left: auto;
`

interface FamilyMemberCardProps {
  name: string
  nationalId: string
}

export function FamilyMemberCard({ name, nationalId }: FamilyMemberCardProps) {
  return (
    <Host>
      {name.length ? (
        <ImageWrap>
          <Avatar name={name} isSmall />
        </ImageWrap>
      ) : null}
      <Content>
        <Title variant="heading5">{name}</Title>
        <Text>{nationalId}</Text>
      </Content>
      <Icon>
        <Image source={chevronForward} style={{ width: 24, height: 24 }} />
      </Icon>
    </Host>
  )
}
