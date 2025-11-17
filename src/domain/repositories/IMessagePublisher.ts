export interface IMessagePublisher {
  publish(
    message: Record<string, unknown>,
    attributes: Record<string, string>
  ): Promise<void>;
}
