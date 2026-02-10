import {Arrival, ArrivalChange, Departure, DepartureChange, Plan, Station, Stop, TrainInfo} from ".prisma/client";

interface ArrivalSummary extends Pick<Arrival, "pt">, Pick<ArrivalChange, "ct" | "clt"> {}
interface DepartureSummary extends Pick<Departure, "pt">, Pick<DepartureChange, "ct" | "clt"> {

}

interface StopSummary {
    stopId: Stop["id"];
    arrival: ArrivalSummary | undefined;
    departure: DepartureSummary | undefined;
    // trainInfo: TrainInfo;
}

interface StationSummary extends Pick<Station, "eva" | "name"> {
    stopSummaries: StopSummary[];
}
