import Event from './model'

export const createEvent = (
  state: string,
  title: string,
  authorSSN: string,
  applicationId: string,
  data: object = {},
) => Event.create({ state, title, authorSSN, applicationId, data })
