import * as messaging from 'messaging';
import menuView from './views/menu';
import weightView from './views/weight';
import waterView from './views/water';
import viewport from './core/viewport';
import { AppCubit } from './cubit/app';

messaging.peerSocket.onmessage = (event) => {
  if (event.data.type == 'weight') {
    AppCubit.getInstance().setWeight(event.data.value);
  } else if (event.data.type == 'water') {
    AppCubit.getInstance().setWater(event.data.value);
  }
};

viewport.initialize({
  menu: menuView,
  weight: weightView,
  water: waterView,
});

setTimeout(() => {
  viewport.replace('menu');
}, 250);
