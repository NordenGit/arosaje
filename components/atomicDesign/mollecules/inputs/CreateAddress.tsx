import { Button } from '@nextui-org/button'
import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
const jwt = require("jsonwebtoken")


type Props = {}

function CreateAddress({ }: Props) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [number, setNumber] = useState<number | undefined>()
    const [street, setStreet] = useState<string | undefined>()
    const [postalCode, setPostalCode] = useState<number | undefined>()
    const [city, setCity] = useState<string | undefined>()


    const fetchLatLngFromGvt = async (addressObj: { number: number, street: string, postalCode: number, city: string }) => {

        // exemple string address needed -> 1020+chemin+de+la+montagne+38690+le+grand+lemps
        const valeurs = Object.values(addressObj).map(value => String(value).replace(/ /g, "+"));
        const queryString = valeurs.join("+")


        try {
            const reponse = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${queryString}`, { method: "GET" });
            const data = await reponse.json()
            const latLng = data.features[0].geometry.coordinates

            return latLng

        } catch (error: any) {
            console.error(`Erreur lors du téléchargement : ${error}`);
        }
    }

    const createAddress = async (address: { number: number, street: string, postalCode: number, city: string }) => {

        const latLng = await fetchLatLngFromGvt({
            number: number as number,
            street: street as string,
            postalCode: postalCode as number,
            city: city as string,
        })

        try {
            const token = localStorage.getItem("token")
            const decodedToken = await jwt.decode(token, { complete: true });

            const userId = await decodedToken.payload.userId

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/address/${userId}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ ...address, lat: latLng[0], lng: latLng[1], country: "france" }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de la plante');
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error(error);
            throw new Error("Une erreur est survenue lors de la création de l'adresse");
        }

    };   




    return (
        <>
            <Button onPress={onOpen} fullWidth color='primary'> <span className='font-bold text-xl'>+</span>Ajouter une nouvelle adresse</Button>
            <Modal placement={"center"} isOpen={isOpen} onOpenChange={onOpenChange} className={`max-h-[80%] overflow-y-auto ${isOpen ? 'z-[1000]' : '-z-10'}`}>

                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Ajouter une nouvelle adresse 📍</ModalHeader>

                            <ModalBody className="flex flex-col items-center w-full justify-center">


                                <>
                                    <Input type='number' placeholder='Numéro' value={number?.toString()} onChange={(e) => { setNumber(parseInt(e.target.value)) }} />
                                    <Input type='text' placeholder='Rue' value={street} onChange={(e) => { setStreet(e.target.value) }} />
                                    <Input type='number' placeholder='Code postal' value={postalCode?.toString()} onChange={(e) => { setPostalCode(parseInt(e.target.value)) }} />
                                    <Input type='city' placeholder='Ville' value={city} onChange={(e) => { setCity(e.target.value) }} />
                                </>

                            </ModalBody>
                            <ModalFooter className="w-full flex items-center justify-between">
                                <Button color="danger" variant="light" onPress={onClose} className="">
                                    Fermer
                                </Button>
                                <Button onClick={() => {
                                    createAddress(
                                        {
                                            number: number as number,
                                            street: street as string,
                                            postalCode: postalCode as number,
                                            city: city as string,
                                        }),
                                    onClose()

                                }}>
                                        Ajouter
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>


    )
}

export default CreateAddress