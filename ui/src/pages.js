/*
Copyright (c) 2023, CloudBlue LLC
All rights reserved.
*/
import {
  addListItems,
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

export const tfnMultiplierSettings = (app) => {
  const multiplierData = {
    input: {},
    output: {},
  };

  hideComponent('app');
  showComponent('loader');

  app.listen('config', cfg => {
    multiplierData.input = cfg;
    addListItems(cfg);
    hideComponent('loader');
    showComponent('app');
  });

  app.listen('save', () => {
    const form = document.querySelector('#my_form');
    const data = new FormData(form);

    const selectedKeys = [...data.keys()];
    let inputcolumns = [];

    multiplierData.input.context.available_columns.forEach(element => {
      if (selectedKeys.includes(element.name)) {
        inputcolumns.push(element);
      }
    });

    inputcolumns = [multiplierData.input.context.available_columns[1]];

    const result = {
      settings: {
        args: [
          {
            from: 'COL-00000-000',
            to: 'B',
          },
          {
            from: 'COL-00000-000',
            to: 'C',
          },
        ],
      },
      overview: '',
      columns: {
        input: inputcolumns,
        output: [
          {
            name: 'B',
            type: 'string',
            description: 'colum B',
          },
          {
            name: 'C',
            type: 'integer',
            description: 'column C',
          },
        ],
      },
    };
    app.emit('save', { data: result, status: 'ok' });
  });
};
