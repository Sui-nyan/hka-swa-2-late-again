import {Station, Stop} from ".prisma/client";
import {TimedStationDataRepository} from "@/lib/repositories/base";
import {StopSummary} from "@/lib/type";
import {stopRepository} from "@/lib/repositories/stopRepository";
import {stopChangeRepository} from "@/lib/repositories/stopChangeRepository";

class UcStopSummary implements TimedStationDataRepository<Stop["id"], StopSummary> {

    getAll(): Promise<StopSummary[]> {
        throw new Error("Not implemented");
    }

    async getAllForStationAndDate(station: Station["eva"], yymmdd: string): Promise<StopSummary[]> {
        const stops = await stopRepository.getAllForStationAndDate(station, yymmdd);
        const stopChanges = await stopChangeRepository.getAllForStationAndDate(station, yymmdd);

        return stops.map(function summarizeStop(s) {
            const relevantChanges = stopChanges.filter(sc => sc.referenceId === s.id);
            return combineStopAndChanges(s, relevantChanges);
        })
    }

    async getById(identifier: Stop["id"]): Promise<StopSummary | null> {
        throw new Error("Not implemented");
    }
}

function combineStopAndChanges(
    s: Awaited<ReturnType<typeof stopRepository.getAllForStationAndDate>>[0],
    relevantChanges: Awaited<ReturnType<typeof stopChangeRepository.getAllForStationAndDate>>) {
    const arChanges = relevantChanges
        .map(sc => sc.arrival)
        .filter(x => !!x);
    const dpChanges = relevantChanges
        .map(sc => sc.departure)
        .filter(x => !!x);

    const ar = !s.ar ? undefined : {
        pt: s.ar.pt,
        clt: arChanges
            .filter(ac => !!ac.clt)
            .sort((a, b) => new Date(b.clt!).getTime() - new Date(a.clt!).getTime())[0]?.clt,
        ct: arChanges
            .filter(ac => !!ac.ct)
            .sort((a, b) => new Date(b.ct!).getTime() - new Date(a.ct!).getTime())[0]?.ct
    }

    const dp = !s.dp ? undefined : {
        pt: s.dp.pt,
        clt: dpChanges
            .filter(x => !!x.clt)
            .sort((a, b) => new Date(b.clt!).getTime() - new Date(a.clt!).getTime())[0]?.clt,
        ct: dpChanges
            .filter(ac => !!ac.ct)
            .sort((a, b) => new Date(b.ct!).getTime() - new Date(a.ct!).getTime())[0]?.ct
    }

    return {
        stopId: s.id,
        arrival: ar,
        departure: dp,

    }
}

export const ucStopSummary = new UcStopSummary();