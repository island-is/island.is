import { SampleApp } from './data';

export class Applications {
    /**
     * register
     */
    public async register({ssn}: {ssn: string}) {
      if (ssn && ssn.length === 10) {
        const newApp = await SampleApp.create({ssn})
        return newApp.id;
      } else throw new Error(`SSN missing or invalid length ${ssn}`) 
    }
  }