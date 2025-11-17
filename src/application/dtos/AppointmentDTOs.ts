import { CountryISO } from '../../shared/types';

export interface CreateAppointmentDTO {
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
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
  createdAt: string;
  updatedAt: string;
}

export interface GetAppointmentsResponseDTO {
  appointments: AppointmentDTO[];
}
