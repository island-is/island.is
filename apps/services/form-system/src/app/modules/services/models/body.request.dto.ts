import { DataFromUrlReqDto } from '../../applications/models/dto/dataFromUrl.request.dto'
import { NotificationDto } from '../../applications/models/dto/notification.dto'

export class BodyRequestDto {
  dataRequest?: DataFromUrlReqDto
  notification?: NotificationDto
  audkenni?: string
}
