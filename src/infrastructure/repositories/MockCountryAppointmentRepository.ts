import {
  CountryAppointmentData,
  ICountryAppointmentRepository,
} from '../../domain/repositories/ICountryAppointmentRepository';

export class MockCountryAppointmentRepository
  implements ICountryAppointmentRepository
{
  private appointments: Map<string, CountryAppointmentData> = new Map();

  async save(
    data: CountryAppointmentData,
    countryISO: string
  ): Promise<void> {
    const key = `${countryISO}_${data.appointmentId}`;
    this.appointments.set(key, {
      ...data,
      appointmentDate: data.appointmentDate || new Date().toISOString(),
    });
    console.log(`Saved appointment to mock ${countryISO} DB:`, data);
  }

  async findById(
    appointmentId: string,
    countryISO: string
  ): Promise<CountryAppointmentData | null> {
    const key = `${countryISO}_${appointmentId}`;
    return this.appointments.get(key) || null;
  }

  clear(): void {
    this.appointments.clear();
  }
}
