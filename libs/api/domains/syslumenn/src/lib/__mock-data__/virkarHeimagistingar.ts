import { IHomestay } from "../client/models/homestay"

export const VHSUCCESS = [
    {
      skraningarnumer: "string",
      heitiHeimagistingar: "string",
      heimilisfang: "string",
      abyrgdarmadur: "string",
      umsoknarAr: 0,
      sveitarfelag: "string",
      gestafjoldi: 0,
      fjoldiHerbergja: 0,
      fastanumer: "string",
      ibudanumer: "string"
    } 
  ] as IHomestay[]

  export const VHFAIL = {
    type: "string",
    title: "string",
    status: 0,
    detail: "string",
    instance: "string"
  }