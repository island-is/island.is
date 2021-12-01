import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(id: string): number {
    console.log('id', id)
    const val = parseInt(id, 10)

    if (isNaN(val)) {
      throw new BadRequestException('Validation failed: "id" must be a number.')
    }

    return val
  }
}
