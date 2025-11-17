import { SQSEvent } from 'aws-lambda';
import { MySQLCountryAppointmentRepository } from '../../infrastructure/repositories/MySQLCountryAppointmentRepository';
import { EventBridgePublisher } from '../../infrastructure/messaging/EventBridgePublisher';
import { ProcessCountryAppointmentUseCase } from '../../application/use-cases/ProcessCountryAppointmentUseCase';

const countryRepository = new MySQLCountryAppointmentRepository('db_pe');
const eventPublisher = new EventBridgePublisher();
const processAppointmentUseCase = new ProcessCountryAppointmentUseCase(
  countryRepository,
  eventPublisher
);

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log('Processing Peru appointments:', event.Records.length);

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      console.log('Processing message:', message);

      await processAppointmentUseCase.execute({
        appointmentId: message.appointmentId,
        insuredId: message.insuredId,
        scheduleId: message.scheduleId,
        countryISO: 'PE',
      });

      console.log(
        `Successfully processed appointment ${message.appointmentId} for Peru`
      );
    } catch (error) {
      console.error('Error processing Peru appointment:', error);
      throw error;
    }
  }
};
