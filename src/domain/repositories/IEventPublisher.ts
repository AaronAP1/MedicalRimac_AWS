export interface IEventPublisher {
  publishEvent(
    eventType: string,
    detail: Record<string, unknown>
  ): Promise<void>;
}
