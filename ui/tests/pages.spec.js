/*
Copyright (c) 2023, CloudBlue LLC
All rights reserved.
*/
import {
  index,
  settings,
  tfnMultiplierSettings,
} from '@/pages';
import {
  getSettings,
  getTfns,
} from '@/utils';
import {
  hideComponent,
  prepareSettings,
  prepareTransformations,
  renderSettings,
  renderTransformations,
  showComponent,
} from '@/components';
import { addListItems } from '../src/utils';


jest.mock('@/utils', () => ({
  getSettings: jest.fn(() => Promise.resolve({ })),
  getTfns: jest.fn(() => Promise.resolve({})),
  addListItems: jest.fn(),
}));

jest.mock('@/components', () => ({
  prepareSettings: jest.fn(() => 'settings'),
  prepareTransformations: jest.fn(() => 'transformations'),
  renderSettings: jest.fn(),
  renderTransformations: jest.fn(),
  showComponent: jest.fn(),
  hideComponent: jest.fn(),
}));

const app = {
  emit: jest.fn(),
};



const context = {};

describe('pages.js', () => {
  describe('index', () => {
    beforeAll(() => {
      document.body.innerHTML = `<div id="app">
        <main-card title="List of transformations for current extension">
          <div class="main-container">
            <div>
              <div class="list-wrapper">
                <ul id="transformations" class="list">
                  </ul>
              </div>
            </div>
          </div>
        </main-card>
    </div>`;
    });
    beforeEach(async () => {
      await index(app);
    });

    test('calls hide app', () => {
      expect(hideComponent).toHaveBeenCalledWith('app');
    });
    test('calls showLoader', () => {
      expect(showComponent).toHaveBeenCalledWith('loader');
    });
    test('calls getTfns', () => {
      expect(getTfns).toHaveBeenCalled();
    });
    test('calls prepareTransformations', () => {
      expect(prepareTransformations).toHaveBeenCalled();
    });
    test('calls hideLoader', () => {
      expect(hideComponent).toHaveBeenCalledWith('loader');
    });
    test('calls showApp', () => {
      expect(showComponent).toHaveBeenCalledWith('app');
    });
    test('calls renderTransformations', () => {
      expect(renderTransformations).toHaveBeenCalled();
    });
  });

  describe('settings', () => {
    beforeAll(() => {
      document.body.innerHTML = `<div id="app">
        <settings-card title="Example of settings page">
            <div class="list-wrapper">
                <p id="settings">
                </p>
            </div>
        </settings-card>
    </div>`;
    });
    beforeEach(async () => {
      await settings(app);
    });

    test('calls showLoader', () => {
      expect(showComponent).toHaveBeenCalledWith('loader');
    });
    test('calls hideApp', () => {
      expect(hideComponent).toHaveBeenCalledWith('app');
    });
    test('calls getSettings', () => {
      expect(getSettings).toHaveBeenCalled();
    });
    test('calls prepareSettings', () => {
      expect(prepareSettings).toHaveBeenCalled();
    });
    test('calls renderSettings', () => {
      expect(renderSettings).toHaveBeenCalled();
    });
    test('calls showApp', () => {
      expect(showComponent).toHaveBeenCalledWith('app');
    });
    test('calls hideLoader', () => {
      expect(hideComponent).toHaveBeenCalledWith('loader');
    });
  });

  describe('tfnMultiplierSettings', () => {
    const cfg = { context: { available_columns: [] } };
    let event;
    let cb;

    beforeEach(() => {
      app.listen = jest.fn();
      app.emit = jest.fn();
      tfnMultiplierSettings(app);
      // eslint-disable-next-line prefer-destructuring
      [event, cb] = app.listen.mock.calls[0];

      cb.call(context, cfg);
    });

    test('calls hide app', () => {
      expect(hideComponent).toHaveBeenCalledWith('app');
    });

    test('calls showLoader', () => {
      expect(showComponent).toHaveBeenCalledWith('loader');
    });

    it('should place config listener', () => {
      expect(event).toBe('config');
    });

    describe('config listener', () => {
      test('calls hideLoader', () => {
        expect(hideComponent).toHaveBeenCalledWith('loader');
      });
      test('calls showApp', () => {
        expect(showComponent).toHaveBeenCalledWith('app');
      });

      test('calls addListItems', () => {
        expect(addListItems).toHaveBeenCalledWith(cfg);
      });
    });

    describe('save listener', () => {
      beforeEach(() => {
        document.body.innerHTML = `<div id="app">
          <main-card title="List of transformations for current extension">
            <div class="main-container">
              <div>
                <div class="list-wrapper">
                  <form id="my_form">
                    <ul id="transformations" class="list">
                    </ul>
                  </form>
                </div>
              </div>
            </div>
          </main-card>
      </div>`;

        // eslint-disable-next-line prefer-destructuring
        [event, cb] = app.listen.mock.calls[1];
      });

      it('should place save listener', () => {
        expect(event).toBe('save');
      });

      it('calls emit', () => {
        cb.call();
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
            input: [],
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

        expect(app.emit).toHaveBeenCalledWith('save', { data: result, status: 'ok' });
      });
    });
  });
});
