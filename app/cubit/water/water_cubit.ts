import * as messaging from 'messaging';
import { ReactiveState } from '../../core/reactive_state';
import { Uninitialised } from '../weight';
import { WaterState, WaterSubmitted, WaterUpdated } from './water_state';

export class WaterCubit extends ReactiveState<WaterState> {
  private _water: number = 0;

  constructor() {
    super(new Uninitialised());
  }

  init(): void {
    this.set(new WaterUpdated(this._water));
  }

  submit(): void {
    messaging.peerSocket.send({ water: this._water });
    this.set(new WaterSubmitted());
  }

  increment() {
    this._water += 50;
    this.set(new WaterUpdated(this._water));
  }

  decrement() {
    this._water -= 50;
    this.set(new WaterUpdated(this._water));
  }
}
