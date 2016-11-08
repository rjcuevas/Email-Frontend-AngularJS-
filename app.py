# fix imports for appengine environments
import fix_imports
(fix_imports)

from tg import AppConfig
from tg import redirect
from google.appengine.api import users
from main import MainController


# def controller_wrapper(next_caller):
#     def call(*args, **kw):
#         user = users.get_current_user()
#         if not user:
#             login_url = users.create_login_url('/')
#             redirect(login_url)
#
#         return next_caller(*args, **kw)
#
#     return call


config = AppConfig(minimal=True, root_controller=MainController())
#config.register_controller_wrapper(controller_wrapper)
app = config.make_wsgi_app()