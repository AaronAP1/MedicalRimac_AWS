import { ICountryAppointmentRepository } from '../../domain/repositories/ICountryAppointmentRepository';
import { IEventPublisher } from '../../domain/repositories/IEventPublisher';
import { ProcessAppointmentDTO } from '../dtos/ProcessAppointmentDTO';

export class ProcessCountryAppointmentUseCase {
  constructor(
    private readonly countryRepository: ICountryAppointmentRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: ProcessAppointmentDTO): Promise<void> {
    await this.countryRepository.save(
      {
        appointmentId: dto.appointmentId,
        insuredId: dto.insuredId,
        scheduleId: dto.scheduleId,
      },
      dto.countryISO
    );

    await this.eventPublisher.publishEvent('AppointmentProcessed', {
      appointmentId: dto.appointmentId,
      insuredId: dto.insuredId,
      countryISO: dto.countryISO,
      status: 'processed',
      timestamp: new Date().toISOString(),
    });
  }
}
