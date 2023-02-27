import { AppCubit } from '../cubit/app';
import { View, Viewport } from '../core/viewport';
import TumblerView from '../widget/tumbler_view';
import { WeightCubit, WeightSubmitted, WeightUpdated } from '../cubit/weight';

class WeightView extends View {
  render(viewport: Viewport, options?: any) {
    const state = new WeightCubit(AppCubit.getInstance());

    const views = {
      buttonLog: this.getViewById('log-button'),
      tumblerLeft: this.getViewById('tumbler-left'),
      tumblerRight: this.getViewById('tumbler-right'),
    };

    views.buttonLog.addEventListener('click', () => {
      state.submit(tumbler.getCurrentValue());
    });

    const tumbler = new TumblerView({
      views: {
        left: views.tumblerLeft,
        right: views.tumblerRight,
      },
      onSelect: () => {
        views.buttonLog.style.display = 'inline';
      },
      onActive: () => {
        views.buttonLog.style.display = 'none';
      },
    });

    const subscriber = state.subscribe((state) => {
      if (state instanceof WeightUpdated) {
        const [left, right] = state.weight.toString().split('.').map(Number);
        tumbler.resequence({
          left: {
            value: left,
            range: {
              upper: left + 10,
              lower: left - 10,
            },
          },
          right: {
            value: right ?? 0,
            range: {
              upper: 9,
              lower: 0,
            },
          },
        });
      } else if (state instanceof WeightSubmitted) {
        viewport.back();
      }
    });

    state.init();

    return () => {
      state.unsubscribe(subscriber);
      state.dispose();
    };
  }
}

export default function () {
  return new WeightView();
}
