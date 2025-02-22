export class Stake {
  constructor(
    public readonly delegatorAddress: string,
    public readonly amount: string,
  ) {}

  validate() {
    if (!this.delegatorAddress || !this.amount) {
      throw new Error('Invalid stake request.');
    }
  }
}
export class Balance {
  constructor(public readonly delegatorAddress: string) {}

  validate() {
    if (!this.delegatorAddress) {
      throw new Error('Invalid balance request.');
    }
  }
}
