type FormWithZendeskSettings = {
  submissionServiceUrl?: string | null
  organizationZendeskInstance?: {
    zendeskBrandId?: string | null
    zendeskInstance?: string | null
  } | null
}

export const hasZendeskSettingsForPublish = (
  form: FormWithZendeskSettings,
): boolean => {
  if (form.submissionServiceUrl !== 'zendesk') {
    return true
  }

  const zendeskBrandId =
    form.organizationZendeskInstance?.zendeskBrandId?.trim()
  const zendeskInstance =
    form.organizationZendeskInstance?.zendeskInstance?.trim()

  return Boolean(zendeskBrandId && zendeskInstance)
}
