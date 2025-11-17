import { SQSEvent } from 'aws-lambda';
import { MockCountryAppointmentRepository } from '../../infrastructure/repositories/MockCountryAppointmentRepository';
import { EventBridgePublisher } from '../../infrastructure/messaging/EventBridgePublisher';
import { ProcessCountryAppointmentUseCase } from '../../application/use-cases/ProcessCountryAppointmentUseCase';

const countryRepository = new MockCountryAppointmentRepository();
const eventPublisher = new EventBridgePublisher();
const processAppointmentUseCase = new ProcessCountryAppointmentUseCase(
  countryRepository,
  eventPublisher
);

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log('Processing Chile appointments:', event.Records.length);

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      console.log('Processing message:', message);

      await processAppointmentUseCase.execute({
        appointmentId: message.appointmentId,
        insuredId: message.insuredId,
        scheduleId: message.scheduleId,
        countryISO: 'CL',
      });

      console.log(
        `Successfully processed appointment ${message.appointmentId} for Chile`
      );
    } catch (error) {
      console.error('Error processing Chile appointment:', error);
      throw error;
    }
  }
};
