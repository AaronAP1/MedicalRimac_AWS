import { v4 as uuidv4 } from 'uuid';
import { Appointment } from '../../domain/entities/Appointment';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { IMessagePublisher } from '../../domain/repositories/IMessagePublisher';
import {
  CreateAppointmentDTO,
  AppointmentResponseDTO,
} from '../dtos/AppointmentDTOs';
import { InsuredId } from '../../domain/value-objects/InsuredId';
import { CountryISO } from '../../domain/value-objects/CountryISO';

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly messagePublisher: IMessagePublisher
  ) {}

  async execute(dto: CreateAppointmentDTO): Promise<AppointmentResponseDTO> {
    new InsuredId(dto.insuredId);
    new CountryISO(dto.countryISO);

    if (!dto.scheduleId || dto.scheduleId <= 0) {
      throw new Error('Schedule ID must be a positive number');
    }

    const appointmentId = uuidv4();

    const appointment = Appointment.create(
      appointmentId,
      dto.insuredId,
      dto.scheduleId,
      dto.countryISO
    );

    await this.appointmentRepository.save(appointment);

    await this.messagePublisher.publish(
      {
        insuredId: dto.insuredId,
        scheduleId: dto.scheduleId,
        countryISO: dto.countryISO,
        appointmentId,
      },
      {
        countryISO: dto.countryISO,
      }
    );

    return {
      message: 'El agendamiento está en proceso',
      appointmentId,
    };
  }
}
