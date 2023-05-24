from flask_wtf import FlaskForm
from wtforms import TextField, TextAreaField, DateTimeField, PasswordField
from wtforms.validators import Required


class ExampleForm(FlaskForm):
    title = TextField(u'Título', validators=[Required()])
    content = TextAreaField(u'Conteúdo')
    date = DateTimeField(u'Data', format='%d/%m/%Y %H:%M')
# recaptcha = RecaptchaField(u'Recaptcha')


class LoginForm(FlaskForm):
    user = TextField(u'Users', validators=[Required()])
    password = PasswordField(u'Pass', validators=[Required()])
