export abstract class CacheRepository {
  abstract set(key: string, value: string): Promise<void>
}
