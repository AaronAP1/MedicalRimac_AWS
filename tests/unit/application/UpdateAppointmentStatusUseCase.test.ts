import { UpdateAppointmentStatusUseCase } from '../../../src/application/use-cases/UpdateAppointmentStatusUseCase';
import { IAppointmentRepository } from '../../../src/domain/repositories/IAppointmentRepository';
import { Appointment } from '../../../src/domain/entities/Appointment';

describe('UpdateAppointmentStatusUseCase', () => {
  let useCase: UpdateAppointmentStatusUseCase;
  let mockRepository: jest.Mocked<IAppointmentRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByInsuredId: jest.fn(),
      update: jest.fn(),
    };

    useCase = new UpdateAppointmentStatusUseCase(mockRepository);
  });

  describe('execute', () => {
    const validDto = {
      appointmentId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'completed' as const,
    };

    const mockAppointment = new Appointment(
      '123e4567-e89b-12d3-a456-426614174000',
      '00123',
      100,
      'PE',
      'pending',
      '2024-11-17T10:00:00Z',
      '2024-11-17T10:00:00Z'
    );

    it('should update appointment status to completed', async () => {
      mockRepository.findById.mockResolvedValue(mockAppointment);
      mockRepository.update.mockResolvedValue();

      await useCase.execute(validDto);

      expect(mockRepository.findById).toHaveBeenCalledWith(
        validDto.appointmentId
      );
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentId: validDto.appointmentId,
          status: 'completed',
        })
      );
    });

    it('should throw error if appointment not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(validDto)).rejects.toThrow(
        `Appointment not found: ${validDto.appointmentId}`
      );
    });

    it('should update timestamp when marking as completed', async () => {
      mockRepository.findById.mockResolvedValue(mockAppointment);
      mockRepository.update.mockResolvedValue();

      await useCase.execute(validDto);

      const updatedAppointment = mockRepository.update.mock.calls[0][0];
      expect(updatedAppointment.status).toBe('completed');
      expect(updatedAppointment.updatedAt).toBeDefined();
    });

    it('should throw error if repository update fails', async () => {
      mockRepository.findById.mockResolvedValue(mockAppointment);
      mockRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(useCase.execute(validDto)).rejects.toThrow(
        'Update failed'
      );
    });
  });
});
