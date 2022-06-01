import React, { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  delimitation,
  externalData,
  info,
  overview,
  section,
} from '../../lib/messages'
import { DataProtectionComplaint } from '../../lib/dataSchema'
import {
  SectionHeading,
  ValueLine,
  yesNoValueLabelMapper,
  onBehalfValueLabelMapper,
} from './Shared'
import {
  Applicant,
  Commissions,
  Complainees,
  Complaint,
  OrganizationOrInstitution,
} from './Sections'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { getBullets } from './messagesUtils'

export type Bullet = {
  bullet: string
  link: string
  linkText: string
}

export const ComplaintOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { fields, append } = useFieldArray<Bullet>({
    name: 'informationMessage.bullets',
  })
  const answers = (application as any).answers as DataProtectionComplaint
  console.log(answers, fields)
  useEffect(() => {
    if (fields.length === 0) {
      getBullets(formatMessage).forEach((bullet, index) => {
        append({
          bullet: bullet.bullet,
          link: bullet.link,
          linkText: bullet.linkText,
        })
      })
    }
  }, [fields])
  useEffect(() => {
    console.log('hello')
    // setValue(`${id}.externalData`, getExternalData(formatMessage))
    setValue(
      `externalDataMessage.title`,
      formatMessage(externalData.general.pageTitle),
    )
    setValue(
      `externalDataMessage.subtitle`,
      formatMessage(externalData.general.subTitle),
    )
    setValue(
      `externalDataMessage.description`,
      formatMessage(externalData.general.description),
    )
    setValue(
      `externalDataMessage.nationalRegistryTitle`,
      formatMessage(externalData.labels.nationalRegistryTitle),
    )
    setValue(
      `externalDataMessage.nationalRegistryDescription`,
      formatMessage(externalData.labels.nationalRegistrySubTitle),
    )
    setValue(
      `externalDataMessage.userProfileTitle`,
      formatMessage(externalData.labels.userProfileTitle),
    )
    setValue(
      `externalDataMessage.userProfileDescription`,
      formatMessage(externalData.labels.userProfileSubTitle),
    )
    setValue(
      `externalDataMessage.checkboxText`,
      formatMessage(externalData.general.checkboxLabel),
    )
    setValue(`informationMessage.title`, formatMessage(section.agreement))
    console.log(fields)
    /* getBullets(formatMessage).forEach((bullet, index) => {
      setValue(`informationMessage.bullets[${index}].bullet`, bullet.bullet)
      setValue(`informationMessage.bullets[${index}].link`, bullet.link)
      setValue(`informationMessage.bullets[${index}].linkText`, bullet.linkText)
    }) */
    // setValue(`${id}.information.bullets`, getBullets(formatMessage))
  }, [setValue])

  return (
    <Box>
      <Text marginTop={2} marginBottom={2}>
        {formatMessage(overview.general.pageDescription)}
      </Text>
      <SectionHeading title={section.info} />
      <ValueLine
        label={info.general.pageTitle}
        value={onBehalfValueLabelMapper[answers.info.onBehalf]}
      />
      <ValueLine
        label={delimitation.labels.inCourtProceedings}
        value={yesNoValueLabelMapper[answers.inCourtProceedings]}
      />
      <ValueLine
        label={delimitation.labels.concernsMediaCoverage}
        value={yesNoValueLabelMapper[answers.concernsMediaCoverage]}
      />
      <ValueLine
        label={delimitation.labels.concernsBanMarking}
        value={yesNoValueLabelMapper[answers.concernsBanMarking]}
      />
      <ValueLine
        label={delimitation.labels.concernsLibel}
        value={yesNoValueLabelMapper[answers.concernsLibel]}
      />
      {answers.applicant && <Applicant answers={answers} />}
      {answers.organizationOrInstitution && (
        <OrganizationOrInstitution answers={answers} />
      )}
      {answers.commissions && <Commissions answers={answers} />}
      <Complainees answers={answers} />
      <Complaint answers={answers} />
    </Box>
  )
}
