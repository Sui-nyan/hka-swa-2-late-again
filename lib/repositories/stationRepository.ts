import { Station } from "@/prisma/generated/client";
import { prisma } from "../prisma";

class StationRepository implements Repository<number, Station> {
  async getAll(): Promise<Station[]> {
    throw new Error("Method not implemented.");
  }
  async getOne(eva: number) {
    const station = await prisma.station.findUnique({
      where: {
        eva,
      },
    });
    return station;
  }
}

export const stationRepository = new StationRepository();
