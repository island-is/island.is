import {getServices} from './service-repository'


describe('ServiceRepository', ()=>{

  describe('getAllServices', ()=>{
    it('Should get some services', async ()=> {
      const ret = await getServices(null, null, null, null);
      expect(ret.result[0].id).toBe(0);
      expect(ret.result[1].id).toBe(1);
    })
  });
});
  