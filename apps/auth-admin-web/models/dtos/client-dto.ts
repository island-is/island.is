import { ClientBaseDTO } from "./base/client-base-dto";

class ClientDTO extends ClientBaseDTO {
  constructor() {
    super();
    this.clientId = "";
  }

  clientId: string;
}

export default ClientDTO;
