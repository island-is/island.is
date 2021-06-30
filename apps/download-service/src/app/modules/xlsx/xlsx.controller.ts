import { Controller, Post, Header, Res, Body, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ApiOkResponse } from '@nestjs/swagger'
import { XlsxDto } from './dto/xlsxDto'
import * as XLSX from 'xlsx'
import { ReadableStreamBuffer } from 'stream-buffers'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Controller('xlsx')
export class XlsxController {
  @Post()
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @ApiOkResponse({
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {},
    },
    description: 'Create and get a Excel document',
  })
  async getXlsx(@Res() res: Response, @Body() resource: XlsxDto) {
    const indata = {
      headers: ['head1', 'head2', 'head333', resource.serviceId],
      data: [
        ['thh', 'test', 'test2', resource.serviceId],
        ['xl', '123', 'test line 2', resource.serviceId],
      ],
    }

    const data = [indata.headers, ...indata.data]

    const dateString = new Date().toISOString().split('T')[0]
    const fileName = `Yfirlit - ${dateString}`

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data)
    const workbook: XLSX.WorkBook = {
      Sheets: { [fileName]: worksheet },
      SheetNames: [fileName],
    }
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'base64',
    })

    const streamBuffer = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })

    streamBuffer.put(excelBuffer, 'base64')

    res.header('Pragma: no-cache')
    res.header('Cache-Control: no-cache')
    res.header('Cache-Control: nmax-age=0')
    res.header('Content-disposition', 'inline; filename=testfile0101x.xlsx')

    streamBuffer.pipe(res)
    streamBuffer.stop()
    return
  }
}
