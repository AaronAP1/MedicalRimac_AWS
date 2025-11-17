/**
 * Shared types for the application
 */

export type CountryISO = 'PE' | 'CL';

export type AppointmentStatus = 'pending' | 'completed';

export interface AppointmentRequest {
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
}

export interface AppointmentResponse {
  message: string;
  appointmentId: string;
}

export interface AppointmentRecord {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}
