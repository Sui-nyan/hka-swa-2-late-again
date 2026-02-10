import { Plan } from "@/prisma/generated/client";
import { prisma } from "../prisma";
import {BaseRepository} from "@/lib/repositories/base";

class PlanRepository implements BaseRepository<number, Plan> {
  async getAll() {
    throw new Error("Method not implemented.");
    return [];
  }
  async getById(id: number) {
    const plan = await prisma.plan.findUnique({
      where: {
        id,
      },
      include: {
        stops: true,
        station: true,
      },
    });
    return plan;
  }
}

export const planRepository = new PlanRepository();
