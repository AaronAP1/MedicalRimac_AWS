import { InsuredId } from '../../../src/domain/value-objects/InsuredId';

describe('InsuredId Value Object', () => {
  describe('constructor', () => {
    it('should create InsuredId with valid 5-digit string', () => {
      const insuredId = new InsuredId('00123');
      expect(insuredId.getValue()).toBe('00123');
    });

    it('should throw error if not 5 digits', () => {
      expect(() => new InsuredId('123')).toThrow(
        'Insured ID must be exactly 5 digits'
      );
    });

    it('should throw error if contains non-digits', () => {
      expect(() => new InsuredId('abc12')).toThrow(
        'Insured ID must be exactly 5 digits'
      );
    });

    it('should throw error if empty', () => {
      expect(() => new InsuredId('')).toThrow('Insured ID must be a string');
    });
  });

  describe('equals', () => {
    it('should return true for equal InsuredIds', () => {
      const id1 = new InsuredId('00123');
      const id2 = new InsuredId('00123');
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different InsuredIds', () => {
      const id1 = new InsuredId('00123');
      const id2 = new InsuredId('00456');
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
