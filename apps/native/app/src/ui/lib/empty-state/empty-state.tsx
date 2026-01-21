import React from 'react'
import { Image } from 'react-native'

import styled from 'styled-components/native'
import infoBubbleIcon from '../../../assets/icons/info-bubble.png'
import { Typography } from '../typography/typography'

interface EmptyStateProps {
  title: React.ReactNode
  description: React.ReactNode
}

const Host = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.blue200};
  border-radius: ${({ theme }) => theme.border.radius.large};
  padding-vertical: ${({ theme }) => theme.spacing[8]}px;
  padding-top: ${({ theme }) => theme.spacing[8]}px;
  display: flex;
  flex: 1;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
  align-items: center;
`

const ImageWrapper = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[3]}px;
`

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
}) => {
  return (
    <Host>
      <ImageWrapper>
        <Image source={infoBubbleIcon} />
      </ImageWrapper>
      <Typography variant="heading3">{title}</Typography>
      <Typography variant="body2">{description}</Typography>
    </Host>
  )
}
