import {Card, CardBody, CardFooter, Divider, Chip} from "@heroui/react";
import {Button} from "@heroui/button";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@heroui/modal";

type Station = {
    name: string;
    expectedArrival: string;
    actualArrival: string;
}

type ConnectionCardProps = {
    startStation: Station;
    endStation: Station;
    isCanceled?: boolean;
    onClick?: () => void;
}

export default function ConnectionCard({startStation, endStation, isCanceled}: ConnectionCardProps) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const isDelayed = startStation.actualArrival > startStation.expectedArrival ||
        endStation.actualArrival > endStation.expectedArrival;

    const formatHHMM = (iso: string) => {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        const hh = d.getHours().toString().padStart(2, '0');
        const mm = d.getMinutes().toString().padStart(2, '0');
        return `${hh}:${mm}`;
    };

    for (const station of [startStation, endStation]) {
        station.expectedArrival = formatHHMM(station.expectedArrival);
        station.actualArrival = formatHHMM(station.actualArrival);
    }

    return (
        <div>
            <Card className="w-full mb-4">
                <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                    <div className="flex flex-col items-center justify-between p-4">
                        <div className="font-bold">{startStation.name} {startStation.expectedArrival}</div>
                        <Chip className="text-sm self-end" color={isDelayed ? "warning" : "success"} variant="bordered">{startStation.actualArrival}</Chip>
                    </div>
                    <div className="flex flex-col items-center justify-between p-4">
                        <div className="font-bold">{endStation.name} {endStation.expectedArrival}</div>
                        <Chip className="text-sm self-end" color={isDelayed ? "warning" : "success"} variant="bordered">{endStation.actualArrival}</Chip>
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-row justify-between p-4">
                    {isCanceled ? (<Chip color="warning">Ausgefallen</Chip>) : isDelayed ? (<Chip color="danger">Verspätet</Chip>) : (<Chip color="success">Pünktlich</Chip>)}
                    <Button onPress={onOpen} variant="bordered">Details</Button>
                </CardFooter>
            </Card>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Verbindung Details</ModalHeader>
                            <ModalBody>
                                <p>Karlsruhe Hbf Gleis 7</p>
                                <p>Mannheim Hbf Gleis 6</p>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>


    );
}
