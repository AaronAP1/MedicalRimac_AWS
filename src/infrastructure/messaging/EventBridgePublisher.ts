import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { IEventPublisher } from '../../domain/repositories/IEventPublisher';

export class EventBridgePublisher implements IEventPublisher {
  private readonly client: EventBridgeClient;
  private readonly eventBusName: string;

  constructor(eventBusName?: string) {
    this.client = new EventBridgeClient({
      region: process.env.REGION || 'us-east-1',
    });
    this.eventBusName = eventBusName || process.env.EVENT_BUS_NAME || '';
  }

  async publishEvent(
    eventType: string,
    detail: Record<string, unknown>
  ): Promise<void> {
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: 'medical.appointments',
          DetailType: eventType,
          Detail: JSON.stringify(detail),
          EventBusName: this.eventBusName,
        },
      ],
    });

    await this.client.send(command);
  }
}
