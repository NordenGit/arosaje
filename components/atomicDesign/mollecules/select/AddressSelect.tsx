import { Select, SelectItem } from '@nextui-org/react'
import React, { useState } from 'react'

type Props = { setAddressSelected:Function}

function AddressSelect({setAddressSelected}: Props) {

    const [stringAdress, setstringAdress] = useState('')
    //setstringAdress(Object.values(addresses[parseInt(e.target.value)]).join(" ").replace(/ /g, "+"))

    const addresses = [
        {id:'uuid', number: '1020', street: 'chemin de la montagne', postCode: '38690', city: 'le grand lemps', lat: '' , lng: '' },
        {id:'uuid', number: '1020', street: 'chemin de la montagne', postCode: '38690', city: 'le grand lemps', lat: '' , lng: '' },
        {id:'uuid', number: '1020', street: 'chemin de la montagne', postCode: '38690', city: 'le grand lemps', lat: '' , lng: '' }
      ]

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
    <Select
      label="Select an adress"
      className=""
      onChange={(e) => setAddressSelected(addresses[parseInt(e.target.value)])}
    >
      {addresses.map((address, i) => (
        <SelectItem key={i} value={address.number + "+" + address.street + "+" + address.postCode + "+" + address.city}>
          {address.number + " " + address.street + " " + address.postCode + " " + address.city}
        </SelectItem>
      ))}
    </Select>
  </div>
)
}

export default AddressSelect