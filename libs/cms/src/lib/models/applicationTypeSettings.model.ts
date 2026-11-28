import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IApplicationSettingsType } from '../generated/contentfulTypes'
import { AlertBanner, mapAlertBanner } from './alertBanner.model'

export const APPLICATION_TYPE_SETTINGS_CONTENT_TYPE = 'applicationSettingsType'
export const APPLICATION_TYPE_SETTINGS_GLOBAL_TYPE = '*'

export const getApplicationTypeSettingsQueryParams = (
  applicationType: string,
) => ({
  ['content_type']: APPLICATION_TYPE_SETTINGS_CONTENT_TYPE,
  'fields.applicationType[in]': [
    APPLICATION_TYPE_SETTINGS_GLOBAL_TYPE,
    applicationType,
  ].join(','),
})

/** Puts the global ('*') settings first so type specific settings can take precedence */
export const sortApplicationTypeSettings = (
  settings: ApplicationTypeSettings[],
): ApplicationTypeSettings[] =>
  [...settings].sort(
    (a, b) =>
      Number(b.applicationType === APPLICATION_TYPE_SETTINGS_GLOBAL_TYPE) -
      Number(a.applicationType === APPLICATION_TYPE_SETTINGS_GLOBAL_TYPE),
  )

@ObjectType()
export class ApplicationTypeSettings {
  @Field(() => ID)
  id!: string

  @Field()
  applicationType!: string

  @CacheField(() => AlertBanner, { nullable: true })
  alertBanner?: AlertBanner | null
}

export const mapApplicationTypeSettings = ({
  fields,
  sys,
}: IApplicationSettingsType): ApplicationTypeSettings => ({
  id: sys.id,
  applicationType: fields.applicationType ?? '',
  alertBanner: fields.alertBanner ? mapAlertBanner(fields.alertBanner) : null,
})
