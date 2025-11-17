import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { Appointment } from '../../domain/entities/Appointment';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

export class DynamoDBAppointmentRepository implements IAppointmentRepository {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(tableName?: string) {
    const client = new DynamoDBClient({
      region: process.env.REGION || 'us-east-1',
    });
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName || process.env.APPOINTMENTS_TABLE || '';
  }

  async save(appointment: Appointment): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        appointmentId: appointment.appointmentId,
        insuredId: appointment.insuredId,
        scheduleId: appointment.scheduleId,
        countryISO: appointment.countryISO,
        status: appointment.status,
        centerId: appointment.centerId,
        specialtyId: appointment.specialtyId,
        medicId: appointment.medicId,
        appointmentDate: appointment.appointmentDate,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      },
    });

    await this.docClient.send(command);
  }

  async findById(appointmentId: string): Promise<Appointment | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { appointmentId },
    });

    const result = await this.docClient.send(command);

    if (!result.Item) {
      return null;
    }

    return new Appointment(
      result.Item.appointmentId,
      result.Item.insuredId,
      result.Item.scheduleId,
      result.Item.countryISO,
      result.Item.status,
      result.Item.centerId,
      result.Item.specialtyId,
      result.Item.medicId,
      result.Item.appointmentDate,
      result.Item.createdAt,
      result.Item.updatedAt
    );
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'insuredId-index',
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId,
      },
    });

    const result = await this.docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map(
      (item) =>
        new Appointment(
          item.appointmentId,
          item.insuredId,
          item.scheduleId,
          item.countryISO,
          item.status,
          item.centerId,
          item.specialtyId,
          item.medicId,
          item.appointmentDate,
          item.createdAt,
          item.updatedAt
        )
    );
  }

  async update(appointment: Appointment): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { appointmentId: appointment.appointmentId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': appointment.status,
        ':updatedAt': appointment.updatedAt,
      },
    });

    await this.docClient.send(command);
  }
}
