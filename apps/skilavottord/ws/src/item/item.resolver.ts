import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'

@Resolver()
export class ItemResolver {
  carsArray = [
    {
      owner: 'Runar',
      vehicleDesc: 'Volvo supercar',
      permNo: 'HXR-4532',
      outOfUse: 'No',
    },
    {
      owner: 'Tommi',
      vehicleDesc: 'Benz supercar',
      permNo: 'ABC-22234',
      outOfUse: 'No',
    },
    {
      owner: 'Siggi',
      vehicleDesc: 'Kia supercar',
      permNo: 'ACC-25534',
      outOfUse: 'No',
    },
  ]

  itemArray = [
    { id: 1, msg: 'item no1' },
    { id: 2, msg: 'item no2' },
    { id: 3, msg: 'item no3' },
  ]

  //query a {items{id, msg}}
  @Query('items')
  echo() {
    return this.itemArray
  }

  //query b {getItem(id: 1){id, msg}}
  @Query('getItem')
  getItem(@Args('id') id: number) {
    console.log('getItem...id=' + id)
    return this.itemArray.find((c) => c.id === id)
  }

  //query c {getAllVehicles(personalId: 1){owner, vehicleDesc, permNo, outOfUse}}
  @Query('getAllVehicles')
  getAllVehicles(@Args('personalId') personalId: string) {
    return this.carsArray
  }

  // mutation c {
  //   createItem(msg: "new item ") {
  //    id, msg
  //   }
  // }
  @Mutation('createItem')
  createNewMessage(@Args('msg') msg: string) {
    const id = this.itemArray.length
    const newMessage = { id, msg }
    this.itemArray.push(newMessage)
    return newMessage
  }
}
