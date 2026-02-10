import {Station} from ".prisma/client";

export interface BaseRepository<K, T> {
  getAll(): Promise<T[]>;
  getById(identifier: K): Promise<T | null>;
}

export interface TimedStationDataRepository<K, T> extends BaseRepository<K, T> {
  getAll(): Promise<T[]>;
  getById(identifier: K): Promise<T | null>;
  getAllForStationAndDate(station: Station["eva"], yymmdd: string): Promise<T[]>;
}
