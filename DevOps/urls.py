from django.conf.urls import include, url
from django.views.generic.base import RedirectView

from django.contrib import admin
admin.autodiscover()

favicon_view = RedirectView.as_view(url='../favicon.ico', permanent=True)

import hello.views

# Examples:
# url(r'^$', 'gettingstarted.views.home', name='home'),
# url(r'^blog/', include('blog.urls')),

urlpatterns = [
    url(r'^$', hello.views.index, name='index'),
    url(r'^PostCredentials/\w{2,30}/\w{2,30}', hello.views.PostCredentials, name='PostCredentials'),
    url(r'^GetCredentials/\w{2,30}/\w{2,30}', hello.views.GetCredentials, name='GetCredentials'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^graphingApp/', hello.views.graphingApp, name='graphingApp'),
    url(r'^usersList/\w{2,30}/', hello.views.userList, name='userList'),
    url(r'allTrialsFromSession/\w{2,30}/\d{2}\W{1}\d{2}\W{1}\d{4}', hello.views.allTrialsFromSession, name='allTrialsFromSession'),
    url(r'^trialApi/\w{2,30}/\d{2}\W{1}\d{2}\W{1}\d{4}', hello.views.get_Total_Trial_Num_For_Test_Date, name='get_Total_Trial_Num_For_Test_Date'),
    url(r'^tableApi/\w{2,30}/\d{2}\W{1}\d{2}\W{1}\d{4}/[0-9]{1,3}', hello.views.get_Table_and_Column, name='column_api'),
]
