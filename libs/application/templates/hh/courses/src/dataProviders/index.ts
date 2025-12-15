// Populate this file with the data providers you need
import { defineTemplateApi } from '@island.is/application/types'

export const CoursesApi = defineTemplateApi({
  action: 'getCourses',
  externalDataId: 'courseList',
})
