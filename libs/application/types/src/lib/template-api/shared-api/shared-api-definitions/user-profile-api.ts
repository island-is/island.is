import { defineTemplateApi } from '../../TemplateApi'

export const UserProfileApi = defineTemplateApi({
  action: 'userProfile',
  namespace: 'UserProfile',
})

export interface UserProfileParameters {
  catchMock?: boolean
}
