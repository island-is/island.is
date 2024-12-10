import { Injectable } from '@nestjs/common'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import { ScreenDto } from '../screens/models/dto/screen.dto'

@Injectable()
export class ValidationService {
  async validateScreen(
    screenDto: ScreenDto,
  ): Promise<ScreenValidationResponse> {
    const screenValidationResponse: ScreenValidationResponse =
      new ScreenValidationResponse()

    return screenValidationResponse
  }
}
