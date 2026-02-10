import { Station } from "@/prisma/generated/client";
import { prisma } from "../prisma";
import {BaseRepository} from "@/lib/repositories/base";

class StationRepository implements BaseRepository<number, Station> {
  async getAll(): Promise<Station[]> {
    return await prisma.station.findMany();
  }
  async getById(eva: number) {
    const station = await prisma.station.findUnique({
      where: {
        eva,
      }
    });
    return station;
  }
}

export const stationRepository = new StationRepository();
