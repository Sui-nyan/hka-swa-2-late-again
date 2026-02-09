import { Plan } from "@/prisma/generated/client";
import { prisma } from "../prisma";

class PlanRepository implements Repository<number, Plan> {
  async getAll() {
    throw new Error("Method not implemented.");
    return [];
  }
  async getOne(id: number) {
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
