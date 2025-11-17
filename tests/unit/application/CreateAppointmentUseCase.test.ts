import { CreateAppointmentUseCase } from '../../../src/application/use-cases/CreateAppointmentUseCase';
import { IAppointmentRepository } from '../../../src/domain/repositories/IAppointmentRepository';
import { IMessagePublisher } from '../../../src/domain/repositories/IMessagePublisher';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}));

describe('CreateAppointmentUseCase', () => {
  let useCase: CreateAppointmentUseCase;
  let mockRepository: jest.Mocked<IAppointmentRepository>;
  let mockPublisher: jest.Mocked<IMessagePublisher>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByInsuredId: jest.fn(),
      update: jest.fn(),
    };

    mockPublisher = {
      publish: jest.fn(),
    };

    useCase = new CreateAppointmentUseCase(mockRepository, mockPublisher);
  });

  describe('execute', () => {
    const validDto = {
      insuredId: '00123',
      scheduleId: 100,
      countryISO: 'PE' as const,
    };

    it('should create appointment successfully', async () => {
      mockRepository.save.mockResolvedValue();
      mockPublisher.publish.mockResolvedValue();

      const result = await useCase.execute(validDto);

      expect(result.message).toBe('El agendamiento está en proceso');
      expect(result.appointmentId).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockPublisher.publish).toHaveBeenCalledTimes(1);
    });

    it('should publish message to SNS with country filter', async () => {
      mockRepository.save.mockResolvedValue();
      mockPublisher.publish.mockResolvedValue();

      await useCase.execute(validDto);

      expect(mockPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          insuredId: validDto.insuredId,
          scheduleId: validDto.scheduleId,
          countryISO: validDto.countryISO,
        }),
        { countryISO: validDto.countryISO }
      );
    });

    it('should throw error if insuredId is invalid', async () => {
      const invalidDto = { ...validDto, insuredId: '123' };

      await expect(useCase.execute(invalidDto)).rejects.toThrow(
        'Insured ID must be exactly 5 digits'
      );
    });

    it('should throw error if countryISO is invalid', async () => {
      const invalidDto = { ...validDto, countryISO: 'US' as any };

      await expect(useCase.execute(invalidDto)).rejects.toThrow(
        'Country ISO must be PE or CL'
      );
    });

    it('should throw error if scheduleId is not positive', async () => {
      const invalidDto = { ...validDto, scheduleId: -1 };

      await expect(useCase.execute(invalidDto)).rejects.toThrow(
        'Schedule ID must be a positive number'
      );
    });
  });
});
