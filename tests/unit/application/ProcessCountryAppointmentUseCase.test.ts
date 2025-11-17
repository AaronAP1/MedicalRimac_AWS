import { ProcessCountryAppointmentUseCase } from '../../../src/application/use-cases/ProcessCountryAppointmentUseCase';
import { ICountryAppointmentRepository } from '../../../src/domain/repositories/ICountryAppointmentRepository';
import { IEventPublisher } from '../../../src/domain/repositories/IEventPublisher';

describe('ProcessCountryAppointmentUseCase', () => {
  let useCase: ProcessCountryAppointmentUseCase;
  let mockRepository: jest.Mocked<ICountryAppointmentRepository>;
  let mockEventPublisher: jest.Mocked<IEventPublisher>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };

    mockEventPublisher = {
      publishEvent: jest.fn(),
    };

    useCase = new ProcessCountryAppointmentUseCase(
      mockRepository,
      mockEventPublisher
    );
  });

  describe('execute', () => {
    const validDto = {
      appointmentId: '123e4567-e89b-12d3-a456-426614174000',
      insuredId: '00123',
      scheduleId: 100,
      countryISO: 'PE',
    };

    it('should save appointment to country repository', async () => {
      mockRepository.save.mockResolvedValue();
      mockEventPublisher.publishEvent.mockResolvedValue();

      await useCase.execute(validDto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(
        {
          appointmentId: validDto.appointmentId,
          insuredId: validDto.insuredId,
          scheduleId: validDto.scheduleId,
        },
        validDto.countryISO
      );
    });

    it('should publish event to EventBridge', async () => {
      mockRepository.save.mockResolvedValue();
      mockEventPublisher.publishEvent.mockResolvedValue();

      await useCase.execute(validDto);

      expect(mockEventPublisher.publishEvent).toHaveBeenCalledTimes(1);
      expect(mockEventPublisher.publishEvent).toHaveBeenCalledWith(
        'AppointmentProcessed',
        expect.objectContaining({
          appointmentId: validDto.appointmentId,
          insuredId: validDto.insuredId,
          countryISO: validDto.countryISO,
          status: 'processed',
        })
      );
    });

    it('should execute save and publish in sequence', async () => {
      mockRepository.save.mockResolvedValue();
      mockEventPublisher.publishEvent.mockResolvedValue();

      await useCase.execute(validDto);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockEventPublisher.publishEvent).toHaveBeenCalled();
    });

    it('should throw error if repository save fails', async () => {
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(validDto)).rejects.toThrow(
        'Database error'
      );
    });

    it('should throw error if event publishing fails', async () => {
      mockRepository.save.mockResolvedValue();
      mockEventPublisher.publishEvent.mockRejectedValue(
        new Error('EventBridge error')
      );

      await expect(useCase.execute(validDto)).rejects.toThrow(
        'EventBridge error'
      );
    });
  });
});
