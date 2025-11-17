import { Appointment } from '../../../src/domain/entities/Appointment';

describe('Appointment Entity', () => {
  const validData = {
    appointmentId: '123e4567-e89b-12d3-a456-426614174000',
    insuredId: '00123',
    scheduleId: 100,
    countryISO: 'PE' as const,
    status: 'pending' as const,
    createdAt: '2024-11-17T10:00:00Z',
    updatedAt: '2024-11-17T10:00:00Z',
  };

  describe('constructor', () => {
    it('should create appointment with valid data', () => {
      const appointment = new Appointment(
        validData.appointmentId,
        validData.insuredId,
        validData.scheduleId,
        validData.countryISO,
        validData.status,
        validData.createdAt,
        validData.updatedAt
      );

      expect(appointment.appointmentId).toBe(validData.appointmentId);
      expect(appointment.insuredId).toBe(validData.insuredId);
      expect(appointment.scheduleId).toBe(validData.scheduleId);
      expect(appointment.countryISO).toBe(validData.countryISO);
      expect(appointment.status).toBe(validData.status);
    });

    it('should throw error if insuredId is not 5 digits', () => {
      expect(() => {
        new Appointment(
          validData.appointmentId,
          '123',
          validData.scheduleId,
          validData.countryISO,
          validData.status,
          validData.createdAt,
          validData.updatedAt
        );
      }).toThrow('Insured ID must be exactly 5 digits');
    });

    it('should throw error if countryISO is invalid', () => {
      expect(() => {
        new Appointment(
          validData.appointmentId,
          validData.insuredId,
          validData.scheduleId,
          'US' as any,
          validData.status,
          validData.createdAt,
          validData.updatedAt
        );
      }).toThrow('Country ISO must be PE or CL');
    });

    it('should throw error if scheduleId is not positive', () => {
      expect(() => {
        new Appointment(
          validData.appointmentId,
          validData.insuredId,
          -1,
          validData.countryISO,
          validData.status,
          validData.createdAt,
          validData.updatedAt
        );
      }).toThrow('Schedule ID must be a positive number');
    });
  });

  describe('markAsCompleted', () => {
    it('should update status to completed', () => {
      const appointment = new Appointment(
        validData.appointmentId,
        validData.insuredId,
        validData.scheduleId,
        validData.countryISO,
        validData.status,
        validData.createdAt,
        validData.updatedAt
      );

      appointment.markAsCompleted();

      expect(appointment.status).toBe('completed');
    });
  });

  describe('create', () => {
    it('should create appointment with pending status', () => {
      const appointment = Appointment.create(
        validData.appointmentId,
        validData.insuredId,
        validData.scheduleId,
        validData.countryISO
      );

      expect(appointment.status).toBe('pending');
      expect(appointment.appointmentId).toBe(validData.appointmentId);
    });
  });
});
