# -*- coding: utf-8 -*-
#
# Copyright (c) 2022, CloudBlue LLC
# All rights reserved.
#
from connect_ext.webapp import E2EWebApplication


def test_retrieve_settings_empty(test_client_factory):
    installation = {
        'id': 'EIN-000',
        'settings': {},
    }

    client = test_client_factory(E2EWebApplication)

    response = client.get('/api/settings', installation=installation)
    assert response.status_code == 200

    data = response.json()
    assert data == {}


def test_retrieve_settings(test_client_factory):
    marketplaces = [
        {
            'id': 'MP-000',
            'name': 'MP 000',
            'description': 'MP 000 description',
            'icon': 'mp_000.png',
        },
    ]

    installation = {
        'id': 'EIN-000',
        'settings': {
            'marketplaces': marketplaces,
        },
    }

    client = test_client_factory(E2EWebApplication)

    response = client.get('/api/settings', installation=installation)
    assert response.status_code == 200

    data = response.json()
    assert data == {
        'marketplaces': marketplaces,
    }


def test_list_transformations(test_client_factory, client_mocker_factory):
    installation = {
        'id': 'EIN-000',
        'environment': {
            'extension': {
                'id': 'SRV-001',
            },
        },
    }

    transformations = [
        {
            'id': 'TRF-001',
            'class_fqn': 'package.path.TransformationClass',
            'status': 'active',
            'name': 'Transformation',
            'description': 'description',

        },
    ]

    client_mocker = client_mocker_factory()

    client_mocker('devops').services['SRV-001'].get(
        return_value={'package_id': 'com.cloudblue'},
    )
    client_mocker('devops').transformations.filter(
        environment__extension__package='com.cloudblue',
    ).mock(
        return_value=transformations,
    )

    client = test_client_factory(E2EWebApplication)
    response = client.get('/api/transformations', installation=installation)

    assert response.status_code == 200

    data = response.json()

    assert data == transformations


def test_list_transformations_api_error(test_client_factory, client_mocker_factory):
    installation = {
        'id': 'EIN-000',
        'environment': {
            'extension': {
                'id': 'SRV-001',
            },
        },
    }

    client_mocker = client_mocker_factory()

    error_data = {
        'error_code': 'AUTH_001',
        'errors': [
            'API request is unauthorized.',
        ],
    }

    client_mocker('devops').services['SRV-001'].get(
        status_code=401,
        return_value=error_data,
    )

    client = test_client_factory(E2EWebApplication)
    response = client.get('/api/transformations', installation=installation)

    assert response.status_code == 401
    assert response.json() == error_data
