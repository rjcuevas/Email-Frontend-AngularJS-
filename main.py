"""from modules.account.AccountController import AccountController
from modules.gcloud_samples.gcloud_samples_controller import GCloudSamplesController
from modules.home.homeController import HomeController
from tg import TGController
from tg import expose


class MainController(TGController):

    home = HomeController()
    account = AccountController()
    gcloud_samples = GCloudSamplesController()

    @expose()
    def index(self):

        # go to http://localhost:8080, you should see this message
        return "it works! "
"""
from tg import TGController, expose
from google.appengine.api import users
import codecs

class MainController(TGController):

    @expose()
    def index(self):
        user = users.get_current_user()
        nickname = user.nickname()
        logout_url = users.create_logout_url('/')
        head = '<div class="pull-right">Welcome {} - <a href="{}">Logout</a></div>'.format(nickname, logout_url)
        page = codecs.open("index.html", 'r', 'utf-8')
        return page.read().replace('userauthentication',head)

