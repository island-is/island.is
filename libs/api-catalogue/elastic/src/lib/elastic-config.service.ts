import { Injectable } from '@nestjs/common'
import { environment } from '../environments/environments'

@Injectable()
export class ElasticConfigService {
  private aliasName: string
  private elasticNode: string

  constructor() {
    this.aliasName = environment.elastic.aliasName
    this.elasticNode = environment.elastic.node
  }

  getAliasName() {
    return this.aliasName
  }

  getElasticNode() {
    return this.elasticNode
  }
}
