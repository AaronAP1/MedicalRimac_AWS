export interface ProcessAppointmentDTO {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: string;
  centerId?: number;
  specialtyId?: number;
  medicId?: number;
  appointmentDate?: string;
}
