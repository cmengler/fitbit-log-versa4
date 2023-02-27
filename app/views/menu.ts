import { AppCubit } from '../cubit/app';
import { View, Viewport } from '../core/viewport';

class MenuView extends View {
  render(viewport: Viewport, options?: any): void | Function {
    const views = {
      weightPanel: this.getViewById('panel-weight'),
      weightLabel: this.getViewWithinById('panel-weight', 'label'),
      waterPanel: this.getViewById('panel-water'),
      waterLabel: this.getViewWithinById('panel-water', 'label'),
    };

    views.weightPanel.addEventListener('click', () => {
      viewport.push('weight');
    });

    views.waterPanel.addEventListener('click', () => {
      viewport.push('water');
    });

    const subscriber = AppCubit.getInstance().subscribe((state) => {
      if (state.weight != null) {
        views.weightLabel.text = state.weight?.toString();
      }
      if (state.water != null) {
        views.waterLabel.text = state.water?.toString();
      }
    });

    return () => {
      AppCubit.getInstance().unsubscribe(subscriber);
    };
  }
}

export default function () {
  return new MenuView();
}
