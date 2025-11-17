import { CountryISO as CountryISOType } from '../../shared/types';

export class CountryISO {
  private readonly value: CountryISOType;

  constructor(value: string) {
    this.validate(value);
    this.value = value as CountryISOType;
  }

  private validate(value: string): void {
    if (!['PE', 'CL'].includes(value)) {
      throw new Error('Country ISO must be PE or CL');
    }
  }

  getValue(): CountryISOType {
    return this.value;
  }

  equals(other: CountryISO): boolean {
    return this.value === other.value;
  }
}
