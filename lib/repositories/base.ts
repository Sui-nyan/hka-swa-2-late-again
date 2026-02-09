interface Repository<K, T> {
  getAll(): Promise<T[]>;
  getOne(identifier: K): Promise<T | null>;
}
