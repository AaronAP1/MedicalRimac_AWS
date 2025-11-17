import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import {
  AppointmentDTO,
  GetAppointmentsResponseDTO,
} from '../dtos/AppointmentDTOs';
import { InsuredId } from '../../domain/value-objects/InsuredId';

export class GetAppointmentsByInsuredUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(insuredId: string): Promise<GetAppointmentsResponseDTO> {
    new InsuredId(insuredId);

    const appointments =
      await this.appointmentRepository.findByInsuredId(insuredId);

    const appointmentDTOs: AppointmentDTO[] = appointments.map((apt) => ({
      appointmentId: apt.appointmentId,
      insuredId: apt.insuredId,
      scheduleId: apt.scheduleId,
      countryISO: apt.countryISO,
      status: apt.status,
      createdAt: apt.createdAt,
      updatedAt: apt.updatedAt,
    }));

    return {
      appointments: appointmentDTOs,
    };
  }
}
