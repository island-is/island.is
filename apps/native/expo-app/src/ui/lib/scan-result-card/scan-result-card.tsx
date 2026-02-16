import React from 'react'
import { useIntl } from 'react-intl'
import { ActivityIndicator, ImageSourcePropType } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { GenericLicenseType } from '../../../graphql/types/schema'
import { formatNationalId } from '../../../lib/format-national-id'
import { isIos } from '../../../utils/devices'
import { prefixBase64 } from '../../../utils/prefix-base-64'
import BackgroundADR from '../../assets/card/adr-bg.png'
import LogoCoatOfArms from '../../assets/card/agency-logo.png'
import success from '../../assets/card/checkmark.png'
import danger from '../../assets/card/danger.png'
import CoatOfArms from '../../assets/card/logo-coat-of-arms.png'
import BackgroundDriversLicense from '../../assets/card/okuskirteini.png'
import DisabilityLicenseBg from '../../assets/card/ororka_bg.png'
import BackgroundWeaponLicense from '../../assets/card/skotvopnaleyfi.png'
import DisabilityLicenseLogo from '../../assets/card/tryggingastofnun_logo.png'
import LogoNatureConservationAgency from '../../assets/card/nvs-logo.png'
import LogoAOSH from '../../assets/card/vinnueftirlitid-logo.png'
import BackgroundVinnuvelar from '../../assets/card/vinnuvelar-bg.png'
import BackgroundHuntingCard from '../../assets/card/veidikort-bg.png'
import { font } from '../../utils'

const Host = styled.View<{ backgroundColor: string }>`
  border-radius: 16px;
  margin-bottom: 32px;
  overflow: hidden;
  background-color: ${({ backgroundColor }) => backgroundColor};
`

const Header = styled.View<{ hasNoData?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ hasNoData }) => (hasNoData ? '24px' : '24px 24px 14px 24px')};
`

const Subtitle = styled.View`
  flex-direction: row;
  align-items: center;
`

const SubtitleIcon = styled.View`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  overflow: hidden;
  margin-left: -3px;
`

const SubtitleImage = styled.Image`
  margin-top: -2px;
`

const SubtitleText = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    color: '#000',
  })}
`

const Detail = styled.View`
  flex: 1;
`

const Title = styled.Text`
  margin-bottom: 4px;
  ${font({
    fontWeight: '600',
    color: '#000',
  })}
`

const Logo = styled.Image`
  width: 62px;
  height: 62px;
  margin-top: -8px;
`

const Content = styled.View`
  flex-direction: row;
  padding: 16px 24px;
  padding-top: 0px;
`

const ErrorContent = styled.View`
  flex-direction: row;
  padding: 16px 24px;
  padding-top: 20px;
`

const Splitter = styled.View`
  height: 1px;
  margin-right: 24px;
  margin-left: 24px;
  margin-bottom: 20px;
  background-color: rgba(98, 80, 88, 1);
  opacity: 0.1;
`

const Label = styled.Text`
  ${font({
    fontSize: 12,
    color: '#8D6679',
  })}
  margin-bottom: 8px;
`

const Value = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    color: '#000',
  })}
`

const LabelGroup = styled.View`
  margin-bottom: 16px;
`

const Photo = styled.Image`
  width: 79px;
  height: 109px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme: { border } }) => border.radius.large};
  margin-right: 32px;
`

const Left = styled.View`
  flex-direction: column;
  margin-right: 16px;
  flex: 1;
`

const Placeholder = styled.View`
  background-color: white;
  border-radius: 4px;
  opacity: 0.2;
  height: 16px;
`

const Background = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #e2c4d1;
`

const Normal = styled.Text``

const Copy = styled.Text`
  ${font({
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '300',
    color: '#000',
  })}
  margin-bottom: 8px;
`

interface ScanResultCardProps {
  loading?: boolean
  error?: boolean
  valid?: boolean
  isExpired?: boolean
  errorMessage?: string
  title?: string
  nationalId?: string
  name?: string
  picture?: string | null
  data?: Array<{ key: string; value: string }>
  hasNoData?: boolean
  type: ScanResultCardType
}

export type SupportedGenericLicenseTypes =
  | GenericLicenseType.DriversLicense
  | GenericLicenseType.AdrLicense
  | GenericLicenseType.MachineLicense
  | GenericLicenseType.FirearmLicense
  | GenericLicenseType.DisabilityLicense
  | GenericLicenseType.HuntingLicense
  | 'Unknown'

const ScanResultCardPresets: Record<
  SupportedGenericLicenseTypes,
  {
    title: string
    logo: ImageSourcePropType
    backgroundImage?: ImageSourcePropType
    backgroundColor?: string
  }
> = {
  DriversLicense: {
    title: 'Ökuskírteini (IS)',
    logo: LogoCoatOfArms,
    backgroundImage: BackgroundDriversLicense,
    backgroundColor: '#F5E4EC',
  },
  AdrLicense: {
    title: 'ADR skírteini',
    logo: LogoAOSH,
    backgroundImage: BackgroundADR,
    backgroundColor: '#F2FAEC',
  },
  MachineLicense: {
    title: 'Vinnuvélaskírteini',
    logo: LogoAOSH,
    backgroundImage: BackgroundVinnuvelar,
    backgroundColor: '#C5E6AF',
  },
  FirearmLicense: {
    title: 'Skotvopnaskírteini',
    logo: CoatOfArms,
    backgroundImage: BackgroundWeaponLicense,
    backgroundColor: '#EBEBF2',
  },
  DisabilityLicense: {
    title: 'Örorkuskírteini',
    logo: DisabilityLicenseLogo,
    backgroundImage: DisabilityLicenseBg,
    backgroundColor: '#C5D5C8',
  },
  HuntingLicense: {
    title: 'Veiðikort',
    logo: LogoNatureConservationAgency,
    backgroundImage: BackgroundHuntingCard,
    backgroundColor: '#E2EDFF',
  },
  Unknown: {
    title: 'Ekki þekkt',
    logo: LogoCoatOfArms,
  },
}

export type ScanResultCardType = keyof typeof ScanResultCardPresets

export function ScanResultCard({
  error,
  errorMessage,
  title,
  isExpired,
  loading,
  nationalId,
  name,
  picture,
  data,
  hasNoData = false,
  type,
}: ScanResultCardProps) {
  const intl = useIntl()
  const theme = useTheme()

  const preset = type
    ? ScanResultCardPresets[type]
    : ScanResultCardPresets.Unknown
  const cardTitle = title ?? preset?.title
  const backgroundImage = preset?.backgroundImage
  const backgroundColor = preset?.backgroundColor ?? theme.color.blue100
  const logo = preset?.logo

  return (
    <Host backgroundColor={backgroundColor}>
      {backgroundImage && (
        <Background source={backgroundImage} resizeMode="stretch" />
      )}
      <Header hasNoData={hasNoData}>
        <Detail>
          <Title>{cardTitle}</Title>
          <Subtitle>
            <SubtitleIcon>
              {loading ? (
                <ActivityIndicator
                  color="#0061FF"
                  animating
                  size="small"
                  style={{ transform: [{ scale: 0.8 }] }}
                />
              ) : error ? (
                <SubtitleImage source={danger} resizeMode="contain" />
              ) : (
                <SubtitleImage source={success} resizeMode="contain" />
              )}
            </SubtitleIcon>
            <SubtitleText>
              {loading
                ? intl.formatMessage({ id: 'licenseScannerResult.loading' })
                : error
                ? intl.formatMessage({ id: 'licenseScannerResult.error' })
                : intl.formatMessage({ id: 'licenseScannerResult.valid' })}
            </SubtitleText>
          </Subtitle>
        </Detail>
        <Logo source={logo} resizeMode="contain" />
      </Header>
      {error ? (
        <ErrorContent>
          <Left>
            <LabelGroup>
              <Label>
                {intl.formatMessage({
                  id: 'licenseScannerResult.errorMessage',
                })}
              </Label>
              {isExpired ? (
                <>
                  <Value style={{ marginBottom: 16 }}>{errorMessage}</Value>
                  <Copy>
                    <Normal>
                      {intl.formatMessage({
                        id: `licenseScannerResult.${
                          isIos ? 'ios' : 'android'
                        }Help`,
                      })}
                    </Normal>
                  </Copy>
                </>
              ) : (
                <Value>{errorMessage}</Value>
              )}
            </LabelGroup>
          </Left>
        </ErrorContent>
      ) : !hasNoData ? (
        <>
          <Splitter />

          <Content>
            {loading ? (
              <Placeholder
                style={{ width: 79, height: 109, marginRight: 32 }}
              />
            ) : (
              picture && <Photo source={{ uri: prefixBase64(picture) }} />
            )}
            <Left>
              <LabelGroup>
                <Label>
                  {intl.formatMessage({ id: 'licenseScannerResult.name' })}
                </Label>
                {loading ? (
                  <Placeholder style={{ width: 120 }} />
                ) : (
                  <Value>{name}</Value>
                )}
              </LabelGroup>
              <LabelGroup>
                <Label>
                  {intl.formatMessage({
                    id: 'licenseScannerResult.nationalId',
                  })}
                </Label>
                {loading ? (
                  <Placeholder style={{ width: 120 }} />
                ) : (
                  <Value>{formatNationalId(nationalId)}</Value>
                )}
              </LabelGroup>
              {data?.map(({ key, value }) => (
                <LabelGroup key={key}>
                  <Label>{key}</Label>
                  {loading ? (
                    <Placeholder style={{ width: 120 }} />
                  ) : (
                    <Value>{value}</Value>
                  )}
                </LabelGroup>
              ))}
            </Left>
          </Content>
        </>
      ) : null}
    </Host>
  )
}
