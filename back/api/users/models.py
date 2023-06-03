from mongoengine import Document, StringField,EmailField

class User(Document):
    username = StringField(required=True, unique=True, max_length=100)
    email = EmailField(required=True, unique=True, max_length=100)
    password = StringField(required=True)

    def to_json(self):
        return {
            "id": str(self.id),
            "username": self.username,
            #"password": self.password,
        }