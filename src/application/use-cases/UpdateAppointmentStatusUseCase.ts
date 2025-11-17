import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { UpdateAppointmentStatusDTO } from '../dtos/UpdateAppointmentStatusDTO';

export class UpdateAppointmentStatusUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(dto: UpdateAppointmentStatusDTO): Promise<void> {
    const appointment = await this.appointmentRepository.findById(
      dto.appointmentId
    );

    if (!appointment) {
      throw new Error(
        `Appointment not found: ${dto.appointmentId}`
      );
    }

    appointment.markAsCompleted();

    await this.appointmentRepository.update(appointment);
  }
}
