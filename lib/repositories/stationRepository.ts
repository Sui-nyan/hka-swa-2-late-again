import { Station } from "@/prisma/generated/client";
import { prisma } from "../prisma";

class StationRepository implements Repository<number, Station> {
  async getAll(): Promise<Station[]> {
    return await prisma.station.findMany();
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
