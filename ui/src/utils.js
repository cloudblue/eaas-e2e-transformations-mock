
/*
Copyright (c) 2023, CloudBlue LLC
All rights reserved.
*/
// API calls to the backend
/* eslint-disable import/prefer-default-export */
export const getSettings = () => fetch('/api/settings').then((response) => response.json());

export const getTfns = () => fetch('/api/transformations').then((response) => response.json());

const liTemplate = (label, checked) => `
  <label>
    <input type="checkbox" name="${label}" value="1" ${checked && 'checked'}>
    <span>${label}</span>
  </label>`;

export const addListItems = config => {
  const parent = document.getElementById('increase_columns');
  const availableColumns = config.context.available_columns;
  const selectedColumns = config.columns.input;

  availableColumns.forEach(column => {
    const li = document.createElement('li');
    let checked = false;
    if (selectedColumns.find(x => x.name === column.name)) {
      checked = true;
    }

    li.appendChild(document.createTextNode(column.name));
    li.classList.add('list-item');
    li.innerHTML = liTemplate(column.name, checked);
    parent.appendChild(li);
  });
};
