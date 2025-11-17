import { CountryISO, AppointmentStatus } from '../../shared/types';

export class Appointment {
  constructor(
    public readonly appointmentId: string,
    public readonly insuredId: string,
    public readonly scheduleId: number,
    public readonly countryISO: CountryISO,
    public status: AppointmentStatus,
    public readonly createdAt: string,
    public updatedAt: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.appointmentId || this.appointmentId.trim() === '') {
      throw new Error('Appointment ID is required');
    }

    if (!this.insuredId || !/^\d{5}$/.test(this.insuredId)) {
      throw new Error('Insured ID must be exactly 5 digits');
    }

    if (!this.scheduleId || this.scheduleId <= 0) {
      throw new Error('Schedule ID must be a positive number');
    }

    if (!['PE', 'CL'].includes(this.countryISO)) {
      throw new Error('Country ISO must be PE or CL');
    }

    if (!['pending', 'completed'].includes(this.status)) {
      throw new Error('Status must be pending or completed');
    }
  }

  markAsCompleted(): void {
    this.status = 'completed';
    this.updatedAt = new Date().toISOString();
  }

  static create(
    appointmentId: string,
    insuredId: string,
    scheduleId: number,
    countryISO: CountryISO
  ): Appointment {
    const now = new Date().toISOString();
    return new Appointment(
      appointmentId,
      insuredId,
      scheduleId,
      countryISO,
      'pending',
      now,
      now
    );
  }
}
