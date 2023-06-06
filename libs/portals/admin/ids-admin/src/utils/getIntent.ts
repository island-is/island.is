export const SYNC_SUFFIX = '-sync'

export const getIntentSync = <Intent extends string>(intent: Intent) => {
  let sync = false

  if (intent.endsWith(SYNC_SUFFIX)) {
    intent = intent.substring(0, intent.indexOf(SYNC_SUFFIX)) as Intent
    sync = true
  }

  return {
    intent,
    sync,
  }
}

export function getIntent<EnumValue extends string, EnumKey extends string>(
  formData: FormData,
  formTypeEnum: { [key in EnumKey]: EnumValue },
) {
  const intent = formData.get('intent') as keyof typeof formTypeEnum | null

  if (!intent) {
    throw new Error('No intent found')
  }

  const intentSyncObj = getIntentSync(intent)

  if (
    !Object.values(formTypeEnum).some((type) => type === intentSyncObj.intent)
  ) {
    throw new Error('wrong intent string')
  }

  return intentSyncObj
}
