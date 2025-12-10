import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ExternalData,
  FormValue,
  KeyValueItem,
  UserProfile,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { LGBaseEntity } from './types'

export const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

export const getWeekendDates = (startDate: Date, endDate: Date) => {
  const weekendDates: Date[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    if (!isWeekday(currentDate)) {
      weekendDates.push(new Date(currentDate))
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return weekendDates
}

export const didSubmitSuccessfully = (context: ApplicationContext) => {
  const success = getValueViaPath(
    context.application.externalData,
    'successfullyPosted.data.success',
  )

  return success === true
}

export const getApplicationName = (application: Application) => {
  const caption = getValueViaPath(
    application.answers,
    'application.caption',
    '',
  )

  return `Lögbirtingarblaðið${caption ? ` - ${caption}` : ''}`
}

export const getUserInfo = (externalData: ExternalData) => {
  const userProfile = getValueViaPath<UserProfile>(
    externalData,
    'userProfile.data',
  )

  if (userProfile?.email && userProfile?.mobilePhoneNumber) {
    return {
      email: userProfile.email,
      phone: userProfile.mobilePhoneNumber,
    }
  }

  return null
}

export const getConfirmationOverview = (
  answers: FormValue,
  externalData: ExternalData,
): KeyValueItem[] => {
  const items: KeyValueItem[] = []
  const categories = getValueViaPath<LGBaseEntity[]>(
    externalData,
    'categories.data',
    [],
  )

  const categoryId = getValueViaPath<string>(
    answers,
    'application.categoryId',
    '',
  )

  const category = categories?.find((cat) => cat.id === categoryId)

  const dates = getValueViaPath<{ date: string }[]>(answers, 'publishing.dates')
  const channels = getValueViaPath<{ email: string; phone?: string }[]>(
    answers,
    'communication.channels',
  )

  const publishingDates = Array.isArray(dates)
    ? dates.map(({ date }) => date)
    : []

  if (category) {
    items.push({
      width: 'full',
      keyText: m.draft.sections.confirmation.category,
      valueText: category.title,
    })
  }

  const mappedDates: KeyValueItem[] = publishingDates.map((date, i) => ({
    width: 'full',
    keyText: `Útgáfudagur${i > 0 ? ` ${i + 1}` : ''}`,
    valueText: date,
  }))

  const mappedChannels: KeyValueItem[] =
    channels?.map((channel, i) => ({
      width: 'full',
      keyText: `Samskiptaleið${i > 0 ? ` ${i + 1}` : ''}`,
      valueText: `${channel.email}${channel.phone ? `, ${channel.phone}` : ''}`,
    })) ?? []

  if (mappedDates.length > 0) {
    mappedDates.forEach((item) => {
      items.push(item)
    })
  }

  if (mappedChannels.length > 0) {
    mappedChannels.forEach((item) => {
      items.push(item)
    })
  }

  return items
}
