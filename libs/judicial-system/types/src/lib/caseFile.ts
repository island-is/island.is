// MD5 was used as file hashing algorithm until (TODO: add date) but was updated to SHA256 to avoid the probability 
// of hash collision between files in our system. Since we still store MD5 alg types with each file hash 
// in the db for historical purposes, we support both types here. 
export enum HashAlgorithm {
  MD5 = 'MD5',
  SHA256 = 'SHA256',
}
