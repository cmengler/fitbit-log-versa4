export abstract class WeightState {}

export class Uninitialised extends WeightState {}

export class WeightUpdated extends WeightState {
  public readonly weight: number;

  constructor(weight: number) {
    super();
    this.weight = weight;
  }
}

export class WeightSubmitted extends WeightState {}
