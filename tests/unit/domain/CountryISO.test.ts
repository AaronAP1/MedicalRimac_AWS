import { CountryISO } from '../../../src/domain/value-objects/CountryISO';

describe('CountryISO Value Object', () => {
  describe('constructor', () => {
    it('should create CountryISO with PE', () => {
      const country = new CountryISO('PE');
      expect(country.getValue()).toBe('PE');
    });

    it('should create CountryISO with CL', () => {
      const country = new CountryISO('CL');
      expect(country.getValue()).toBe('CL');
    });

    it('should throw error for invalid country', () => {
      expect(() => new CountryISO('US')).toThrow(
        'Country ISO must be PE or CL'
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal CountryISOs', () => {
      const country1 = new CountryISO('PE');
      const country2 = new CountryISO('PE');
      expect(country1.equals(country2)).toBe(true);
    });

    it('should return false for different CountryISOs', () => {
      const country1 = new CountryISO('PE');
      const country2 = new CountryISO('CL');
      expect(country1.equals(country2)).toBe(false);
    });
  });
});
