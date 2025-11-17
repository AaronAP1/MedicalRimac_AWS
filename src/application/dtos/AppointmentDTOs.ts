import { CountryISO } from '../../shared/types';

export interface CreateAppointmentDTO {
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
  centerId?: number;
  specialtyId?: number;
  medicId?: number;
  appointmentDate?: string;
}

export interface AppointmentResponseDTO {
  message: string;
  appointmentId: string;
}

export interface AppointmentDTO {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
  status: string;
  centerId?: number;
  specialtyId?: number;
  medicId?: number;
  appointmentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAppointmentsResponseDTO {
  appointments: AppointmentDTO[];
}
