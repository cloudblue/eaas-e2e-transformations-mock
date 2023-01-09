/*
Copyright (c) 2023, CloudBlue LLC
All rights reserved.
*/
import {
  getSettings,
  getTfns,
} from './utils';

import {
  hideComponent,
  prepareSettings,
  prepareTransformations,
  renderSettings,
  renderTransformations,
  showComponent,
} from './components';


export const index = async () => {
  hideComponent('app');
  showComponent('loader');
  const tfns = await getTfns();
  const transformations = prepareTransformations(tfns);
  hideComponent('loader');
  showComponent('app');
  renderTransformations(transformations);
};

export const settings = async (app) => {
  if (!app) return;
  hideComponent('app');
  showComponent('loader');
  const data = await getSettings();
  const dataSettings = prepareSettings(data);
  renderSettings(dataSettings);
  hideComponent('loader');
  showComponent('app');
};

export const tfnMultiplierSettings = () => {
  hideComponent('app');
  showComponent('loader');
  // here you can
  // const columns = [];
  // const transformations = prepareTransformations(tfns);
  hideComponent('loader');
  showComponent('app');
  // renderTransformations(transformations);
};
