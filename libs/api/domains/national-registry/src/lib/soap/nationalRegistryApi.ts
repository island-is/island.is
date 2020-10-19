import Soap from 'soap'
import { GetViewThjodskraDto } from './dto/getViewThjodskraDto';

export class NationalRegistryApi {
  private readonly client: Soap.Client
  private readonly clientUser: string
  private readonly clientPassword: string

  constructor(private soapClient: Soap.Client,
    clientPassword: string, clientUser: string) {
    this.client = soapClient
    this.clientUser = clientUser
    this.clientPassword = clientPassword
  }

  public getMyInfo(nationalId: string): Promise<GetViewThjodskraDto | null> {
    return new Promise((resolve, _reject) => {
      this.client.GetViewThjodskra({
        ":SortColumn": 1,
        ":SortAscending": true,
        ":S5Username": this.clientUser,
        ":S5Password": this.clientPassword,
        ":Kennitala": nationalId,
      }, (err: any, { GetViewThjodskraResult: result }: { GetViewThjodskraResult: GetViewThjodskraDto }) => {
        if (err) {
          _reject(err);
        }
        console.log(JSON.stringify(result));
        resolve(result);
      });
    });
  }
}
