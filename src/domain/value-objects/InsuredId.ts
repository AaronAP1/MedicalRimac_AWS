export class InsuredId {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error('Insured ID must be a string');
    }

    if (!/^\d{5}$/.test(value)) {
      throw new Error('Insured ID must be exactly 5 digits');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: InsuredId): boolean {
    return this.value === other.value;
  }
}
