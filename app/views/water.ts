import { View, Viewport } from '../core/viewport';
import { WaterCubit, WaterSubmitted, WaterUpdated } from '../cubit/water';

class WaterView extends View {
  render(viewport: Viewport, options?: any) {
    const state = new WaterCubit();

    const views = {
      label: this.getViewById('label'),
      buttonLog: this.getViewById('log-button'),
      buttonIncrement: this.getViewById('btn-increment'),
      buttonDecrement: this.getViewById('btn-decrement'),
    };

    views.buttonLog.addEventListener('click', () => {
      state.submit();
    });

    views.buttonIncrement.addEventListener('click', () => {
      state.increment();
    });

    views.buttonDecrement.addEventListener('click', () => {
      state.decrement();
    });

    const subscriber = state.subscribe((state) => {
      if (state instanceof WaterUpdated) {
        views.label.text = state.water.toString();
      } else if (state instanceof WaterSubmitted) {
        viewport.back();
      }
    });

    state.init();

    return () => {
      state.unsubscribe(subscriber);
    };
  }
}

export default function () {
  return new WaterView();
}
