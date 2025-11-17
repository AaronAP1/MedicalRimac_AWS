import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { IMessagePublisher } from '../../domain/repositories/IMessagePublisher';

export class SNSPublisher implements IMessagePublisher {
  private readonly client: SNSClient;
  private readonly topicArn: string;

  constructor(topicArn?: string) {
    this.client = new SNSClient({
      region: process.env.REGION || 'us-east-1',
    });
    this.topicArn = topicArn || process.env.SNS_TOPIC_ARN || '';
  }

  async publish(
    message: Record<string, unknown>,
    attributes: Record<string, string>
  ): Promise<void> {
    const messageAttributes: Record<
      string,
      { DataType: string; StringValue: string }
    > = {};

    for (const [key, value] of Object.entries(attributes)) {
      messageAttributes[key] = {
        DataType: 'String',
        StringValue: value,
      };
    }

    const command = new PublishCommand({
      TopicArn: this.topicArn,
      Message: JSON.stringify(message),
      MessageAttributes: messageAttributes,
    });

    await this.client.send(command);
  }
}
