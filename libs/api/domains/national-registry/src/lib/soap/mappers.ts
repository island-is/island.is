import { MyInfo } from '../myInfo.model';
import { GetViewThjodskraDto } from './dto/getViewThjodskraDto';

export class RegistryMappers {
  toMyInfoDto(soapResult: GetViewThjodskraDto): MyInfo {
    return new MyInfo()
  }
}
