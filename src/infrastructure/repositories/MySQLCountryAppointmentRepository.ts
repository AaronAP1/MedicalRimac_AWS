import mysql from 'mysql2/promise';
import { Appointment } from '../../domain/entities/Appointment';
import { ICountryAppointmentRepository } from '../../domain/repositories/ICountryAppointmentRepository';

export class MySQLCountryAppointmentRepository implements ICountryAppointmentRepository {
  private pool: mysql.Pool;

  constructor(dbName: string) {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      port: Number(process.env.DB_PORT || 3306),
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async save(appointment: Appointment): Promise<void> {
    const query = `
      INSERT INTO appointments (
        appointment_id, insured_id, schedule_id, country_iso,
        center_id, specialty_id, medic_id, appointment_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.pool.execute(query, [
      appointment.appointmentId,
      appointment.insuredId,
      appointment.scheduleId,
      appointment.countryISO,
      appointment.centerId || null,
      appointment.specialtyId || null,
      appointment.medicId || null,
      appointment.appointmentDate || null,
    ]);
  }

  async findById(appointmentId: string): Promise<Appointment | null> {
    const [rows] = await this.pool.execute(
      'SELECT * FROM appointments WHERE appointment_id = ?',
      [appointmentId]
    );

    const appointments = rows as any[];
    if (appointments.length === 0) {
      return null;
    }

    const row = appointments[0];
    return Appointment.create(
      row.insured_id,
      row.country_iso,
      row.schedule_id,
      row.appointment_id
    );
  }
}
