import { ReactiveState } from '../../core/reactive_state';
import { AppState } from './app_state';

export class AppCubit extends ReactiveState<AppState> {
  private static instance: AppCubit | null = null;

  constructor() {
    super(new AppState());
  }

  static getInstance(): AppCubit {
    if (!AppCubit.instance) {
      AppCubit.instance = new AppCubit();
    }
    return AppCubit.instance;
  }

  setWeight(weight: number) {
    this.set({
      ...this.get(),
      weight: weight,
    });
  }

  setWater(water: number) {
    this.set({
      ...this.get(),
      water: water,
    });
  }
}
