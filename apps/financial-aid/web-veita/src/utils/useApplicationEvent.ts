import { useMutation } from '@apollo/client'
import { ApplicationEventType } from '@island.is/financial-aid/shared/lib'
import { ApplicationEventMutation } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

export const useApplicationEvent = () => {
  const [
    createApplicationEventMutation,
    { loading: isCreatingApplicationEvent },
  ] = useMutation(ApplicationEventMutation)

  const creatApplicationEvent = async (
    applicationId: string,
    eventType: ApplicationEventType,
    staffNationalId?: string,
    staffName?: string,
    staffComment?: string,
  ) => {
    const { data } = await createApplicationEventMutation({
      variables: {
        input: {
          applicationId: applicationId,
          comment: staffComment,
          eventType: eventType,
          staffNationalId: staffNationalId,
          staffName: staffName,
        },
      },
    })

    if (data) {
      return data.createApplicationEvent
    }
  }

  return {
    isCreatingApplicationEvent,
    creatApplicationEvent,
  }
}
