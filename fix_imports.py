import os
import site
import sys

sys.path.insert(0, 'packages')
site.addsitedir(os.path.join(os.path.dirname(__file__), 'packages'))