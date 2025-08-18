import React from 'react'
import { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'
import { useDateTimeFormatter } from '../../../hooks/use-date-time-formatter'
import { Spacing, theme } from '../../utils'
import { dynamicColor } from '../../utils/dynamic-color'
import { Label } from '../label/label'
import { Skeleton } from '../skeleton/skeleton'
import { Typography } from '../typography/typography'

const Host = styled.View`
  display: flex;
  row-gap: ${({ theme }) => theme.spacing[2]}px;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
`

const LogoBackground = styled.View`
  background-color: ${dynamicColor(
    (props) => ({
      dark: props.theme.color.white,
      light: props.theme.color.blue100,
    }),
    true,
  )};
  height: 42px;
  width: 42px;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.border.radius.full};
`

const Logo = styled.Image`
  width: 24px;
  height: 24px;
`

const Col = styled.View<{ columnGap?: Spacing; spaceBetween?: boolean }>`
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  ${({ spaceBetween }) => spaceBetween && `justify-content: space-between;`}
  ${({ columnGap, theme }) =>
    columnGap && `column-gap: ${theme.spacing[columnGap]}px`}
`

const Row = styled.View<{ rowGap?: Spacing }>`
  flex-direction: column;
  ${({ rowGap, theme }) => rowGap && `row-gap: ${theme.spacing[rowGap]}px`}
`

interface HeaderProps {
  title?: string
  logo?: ImageSourcePropType
  category?: string
  date?: string
  message?: string
  isLoading?: boolean
  hasBorder?: boolean
  label?: string
}

export function Header({
  title,
  logo,
  category,
  date,
  message,
  isLoading,
  label,
}: HeaderProps) {
  const formatDate = useDateTimeFormatter()

  const renderSkeleton = ({
    height,
    width,
    borderRadius = 4,
  }: {
    height: number
    width?: number
    borderRadius?: number
  }) => {
    return (
      <Skeleton
        active
        style={{ borderRadius, ...(width && { width }) }}
        height={height}
      />
    )
  }

  if (isLoading) {
    return (
      <Host>
        <Row rowGap={1}>
          {renderSkeleton({
            height: 20,
            width: 200,
          })}
          <Col columnGap={2}>
            {renderSkeleton({
              height: 42,
              width: 42,
              borderRadius: 100,
            })}
            <Row rowGap="smallGutter">
              {renderSkeleton({
                height: 16,
                width: 100,
              })}
              {renderSkeleton({
                height: 16,
                width: 150,
              })}
            </Row>
          </Col>
        </Row>
      </Host>
    )
  }

  return (
    <Host>
      <Row rowGap={1}>
        {message && (
          <Typography variant="heading5" numberOfLines={1} ellipsizeMode="tail">
            {message}
          </Typography>
        )}

        <Col columnGap={2}>
          {logo && (
            <LogoBackground>
              <Logo source={logo} />
            </LogoBackground>
          )}
          <Col spaceBetween>
            <Row rowGap="smallGutter">
              {title && (
                <Typography
                  variant="eyebrow"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title}
                </Typography>
              )}
              <Col columnGap={1}>
                {date && (
                  <Typography variant="body3">{formatDate(date)}</Typography>
                )}
                {category && (
                  <>
                    <Typography variant="body3" color={theme.color.blue200}>
                      |
                    </Typography>
                    <Typography variant="body3">{category}</Typography>
                  </>
                )}
              </Col>
            </Row>
            {label && (
              <Label color="urgent" icon>
                {label}
              </Label>
            )}
          </Col>
        </Col>
      </Row>
    </Host>
  )
}
