import {Station, StopChange} from ".prisma/client";
import {TimedStationDataRepository} from "@/lib/repositories/base";
import {prisma} from "@/lib/prisma";
import {stopRepository} from "@/lib/repositories/stopRepository";

class StopChangeRepository implements TimedStationDataRepository<StopChange["id"], StopChange> {

    async getAll(): Promise<StopChange[]> {
        return prisma.stopChange.findMany();
    }

    async getAllForStationAndDate(station: Station["eva"], yymmdd: string){
        const stops = await stopRepository.getAllForStationAndDate(station, yymmdd);
        const stopIds = stops.map(s => s.id);

        return prisma.stopChange.findMany({
            where: {
                referenceId: {
                    in: stopIds
                }
            }, include: {
                arrival: true, departure: true,
            }
        });
    }

    async getById(identifier: StopChange["id"]): Promise<StopChange | null> {
        return prisma.stopChange.findUniqueOrThrow({where: {id: identifier}});
    }
}

export const stopChangeRepository = new StopChangeRepository();