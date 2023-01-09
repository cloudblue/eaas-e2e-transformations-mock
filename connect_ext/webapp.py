from typing import List

from connect.client import ConnectClient
from connect.eaas.core.decorators import account_settings_page, module_pages, router, web_app
from connect.eaas.core.extension import WebApplicationBase
from connect.eaas.core.inject.synchronous import get_installation, get_installation_client
from fastapi import Depends
from connect_ext.schemas import Tfn


@web_app(router)
@account_settings_page('E2E Sample Settings', '/static/settings.html')
@module_pages('Home Sample page', '/static/index.html')
class E2EWebApplication(WebApplicationBase):
    @router.get(
        '/settings',
        summary='Retrieve settings',
    )
    def retrieve_settings(
        self,
        installation: dict = Depends(get_installation),
    ):
        return installation['settings']

    @router.get(
        '/transformations',
        summary='List available transformations',
        response_model=List[Tfn],
    )
    def list_transformations(
        self,
        client: ConnectClient = Depends(get_installation_client),
        installation: dict = Depends(get_installation),
    ):
        extension_id = installation['environment']['extension']['id']
        package_id = client('devops').services[extension_id].get()['package_id']
        return [
            Tfn(**tfn)
            for tfn in client('devops').transformations.filter(
                environment__extension__package=package_id,
            ).values_list(
                'id', 'status', 'name', 'description', 'class_fqn',
            )
        ]

    @router.post('/validate/transformations')
    def validate_second_tfn(
        self,
        client: ConnectClient = Depends(get_installation_client),
    ):
        # implement here validation for corresponding tfn
        pass
