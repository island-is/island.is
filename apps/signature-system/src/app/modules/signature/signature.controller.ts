import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Signature } from './signature.model'
import { SignatureService } from './signature.service'
import { FindSignatureDto } from './dto/findSignatureDto'
import { SignatureDto } from './dto/SignatureDto'

@ApiTags('signature')
@Controller('signature')
export class SignatureController {
  constructor (private readonly signatureService: SignatureService) {}

  @Get()
  @ApiOkResponse({ type: [Signature] })
  async findOne (@Body() { listId }: FindSignatureDto): Promise<Signature[]> {
    // TODO: Add auth here
    const signature = await this.signatureService.findSignaturesByNationalId({
      nationalId: '0000000000', // TODO: Replace this with requesting user
      listId,
    })

    if (!signature) {
      throw new NotFoundException("This signature doesn't exist")
    }

    return signature
  }

  @Post()
  @ApiCreatedResponse({ type: Signature })
  async create (@Body() { listId }: SignatureDto): Promise<Signature> {
    // TODO: Add auth here
    // TODO: Validate rules here
    return await this.signatureService.createSignatureOnList({
      nationalId: '0000000000', // TODO: Replace this with requesting user
      listId,
    })
  }

  @Delete()
  @ApiOkResponse({ type: Boolean })
  async delete (@Body() { listId }: SignatureDto): Promise<boolean> {
    // TODO: Add auth here
    const signature = await this.signatureService.deleteFromListByNationalId({
      nationalId: '0000000000', // TODO: Replace this with requesting user
      listId,
    })

    if (signature === 0) {
      throw new NotFoundException("This signature doesn't exist")
    }

    return signature > 0
  }
}
