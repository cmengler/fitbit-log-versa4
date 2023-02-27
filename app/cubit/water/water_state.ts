export abstract class WaterState {}

export class Uninitialised extends WaterState {}

export class WaterUpdated extends WaterState {
  public readonly water: number;

  constructor(water: number) {
    super();
    this.water = water;
  }
}

export class WaterSubmitted extends WaterState {}
