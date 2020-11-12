export class GrantDto {
  constructor() {
    this.key = "";
    this.type = "";
    this.subjectId = "";
    this.sessionId = "";
    this.clientId = "";
    this.description = null;
    this.creationTime = new Date();
    this.expiration = new Date(
      new Date().setTime(new Date().getTime() + 86400000)
    );
    this.consumedTime = null;
    this.data = "";
  }

  key: string;
  type: string;
  subjectId: string;
  sessionId: string;
  clientId: string;
  description: string | null;
  creationTime: Date;
  expiration: Date;
  consumedTime: Date | null;
  data: string;
}
