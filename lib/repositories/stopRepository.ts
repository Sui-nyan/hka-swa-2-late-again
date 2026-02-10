import {Station, Stop} from ".prisma/client";
import {TimedStationDataRepository} from "@/lib/repositories/base";
import {prisma} from "@/lib/prisma";

class StopRepository implements TimedStationDataRepository<Stop["id"], Stop> {

    getAll(): Promise<Stop[]> {
        return prisma.stop.findMany();
    }

    async getAllForStationAndDate(station: Station["eva"], yymmdd: string) {
        if (yymmdd.length != 6) {
            throw new Error("Expected timeformat of yymmdd, got something longer");
        }
        console.log("Query stops for eva=", station, "yymmdd=", yymmdd);
        const stops = await prisma.stop.findMany({
            where: {
                plan: {
                    eva: station,
                    targetDatetime: yymmdd,
                }
            }, include: {
                plan: true,
                tl: true,
                ar: true,
                dp: true,
            }
        })
        return stops;
    }

    getById(identifier: Stop["id"]): Promise<Stop | null> {
        return prisma.stop.findUniqueOrThrow({where: {id: identifier}});
    }
}

function dateToYymmdd(date: Date): string {
    date.toLocaleDateString()
    const padStart = (value: number): string => value.toString().padStart(2, '0');
    return date.getFullYear().toString().substring(2) + padStart(date.getMonth() + 1) + padStart(date.getDate());
}

export const stopRepository = new StopRepository();