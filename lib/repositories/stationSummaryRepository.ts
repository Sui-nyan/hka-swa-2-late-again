import {StationSummary} from "@/lib/type";
import {Plan, Station} from ".prisma/client";
import {BaseRepository} from "@/lib/repositories/base";

type StationSummaryIdentifier = Pick<Station, "eva"> & {
    date: Date;
}

class StationSummaryRepository implements BaseRepository<StationSummaryIdentifier, StationSummary> {
    async getAll() {
        throw new Error("Method not implemented.");
        return [];
    }

    async getById({date, eva}: StationSummaryIdentifier) {
        return null;
    }
}

export const stationSummaryRepository = new StationSummaryRepository();
