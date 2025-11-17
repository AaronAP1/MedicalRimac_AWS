export interface CountryAppointmentData {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  centerId?: number;
  specialtyId?: number;
  medicId?: number;
  appointmentDate?: string;
}

export interface ICountryAppointmentRepository {
  save(data: CountryAppointmentData, countryISO: string): Promise<void>;
  findById(appointmentId: string, countryISO: string): Promise<CountryAppointmentData | null>;
}
