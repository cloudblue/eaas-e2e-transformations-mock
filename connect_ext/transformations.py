from connect.eaas.core.decorators import transformation
from connect.eaas.core.extension import TransformationsApplicationBase


class E2ETransformationsApplication(TransformationsApplicationBase):

    @transformation(
        name='Multiplier transformation',
        description='The transformation function that multiplies selected columns',
        edit_dialog_ui='/static/transformations/multiplier_settings.html',
    )
    def transform_1(self, row):
        return row

    @transformation(
        name='Fake transformation',
        description='The transformation function that do nothihg',
        edit_dialog_ui='/static/transformations/simple_settings.html',
    )
    def transform_2(self, row):
        return row
