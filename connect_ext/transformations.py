from connect.eaas.core.decorators import transformation
from connect.eaas.core.extension import TransformationBase


@transformation(
    name='Multiplier transformation',
    description='The transformation function that multiplies selected columns',
    edit_dialog_ui='/static/transformations/multiplier_settings.html',
)
class MultiplierTransformation(TransformationBase):
    multiplier = 1.25

    def process_row(self, row):
        row.value = row.value * self.multiplier

        return row

    def initialize(self, input_columns, stream):
        self.input_columns = input_columns
        self.stream = stream


@transformation(
    name='Fake transformation',
    description='The transformation function that do nothihg',
    edit_dialog_ui='/static/transformations/simple_settings.html',
)
class SecondTransformation(TransformationBase):

    def process_row(self, row):
        pass

    def initialize(self):
        pass
