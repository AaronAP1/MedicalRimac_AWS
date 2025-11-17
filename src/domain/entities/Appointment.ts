import { CountryISO, AppointmentStatus } from '../../shared/types';

export class Appointment {
  constructor(
    public readonly appointmentId: string,
    public readonly insuredId: string,
    public readonly scheduleId: number,
    public readonly countryISO: CountryISO,
    public status: AppointmentStatus,
    public readonly centerId?: number,
    public readonly specialtyId?: number,
    public readonly medicId?: number,
    public readonly appointmentDate?: string,
    public readonly createdAt?: string,
    public updatedAt?: string
  ) {
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
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

    if (this.centerId !== undefined && this.centerId <= 0) {
      throw new Error('Center ID must be a positive number');
    }

    if (this.specialtyId !== undefined && this.specialtyId <= 0) {
      throw new Error('Specialty ID must be a positive number');
    }

    if (this.medicId !== undefined && this.medicId <= 0) {
      throw new Error('Medic ID must be a positive number');
    }

    if (this.appointmentDate && isNaN(Date.parse(this.appointmentDate))) {
      throw new Error('Appointment date must be a valid ISO date string');
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
    countryISO: CountryISO,
    centerId?: number,
    specialtyId?: number,
    medicId?: number,
    appointmentDate?: string
  ): Appointment {
    return new Appointment(
      appointmentId,
      insuredId,
      scheduleId,
      countryISO,
      'pending',
      centerId,
      specialtyId,
      medicId,
      appointmentDate
    );
  }
}
