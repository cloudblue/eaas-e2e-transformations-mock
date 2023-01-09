from pydantic import BaseModel


class Tfn(BaseModel):
    id: str
    status: str
    class_fqn: str
    name: str
    description: str
