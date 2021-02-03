import { ReferenceTemplateModule } from './reference-template/reference-template.module'
import { ParentalLeaveModule } from './parental-leave/parental-leave.module'

export const modules = [ReferenceTemplateModule, ParentalLeaveModule]

export { ReferenceTemplateService } from './reference-template/reference-template.service'
export { ParentalLeaveService } from './parental-leave/parental-leave.service'
