import * as messaging from 'messaging';
import { ReactiveState, Subscriber } from '../../core/reactive_state';
import { AppCubit, AppState } from '../app';
import { Uninitialised, WeightState, WeightSubmitted, WeightUpdated } from './weight_state';

export class WeightCubit extends ReactiveState<WeightState> {
  private appCubit: AppCubit;
  private subscriber: Subscriber<AppState>;

  constructor(appCubit: AppCubit) {
    super(new Uninitialised());
    this.appCubit = appCubit;
  }

  public dispose(): void {
    this.appCubit.unsubscribe(this.subscriber);
  }

  init(): void {
    this.set(new WeightUpdated(0.0));

    this.subscriber = this.appCubit.subscribe((state) => {
      if (state.weight != null) {
        this.set(new WeightUpdated(state.weight));
      }
    });
  }

  submit(weight: number): void {
    messaging.peerSocket.send({ weight: weight });
    this.set(new WeightSubmitted());
  }
}
