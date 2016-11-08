angular.module( 'ngBoilerplate.email', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider, $httpProvider ) {
  $stateProvider.state( 'email', {
    url: '/email',
    views: {
      "main": {
        controller: 'EmailCtrl',
        templateUrl: 'email/email.tpl.html'
      }
    },
    data:{ pageTitle: 'Email' }
  });

})

.controller( 'EmailCtrl', function ModuleCtrl( $scope, $http, $window, backend, $compile) {
  $scope.recipients = [];
  $scope.drafts = false;
  $scope.errorEmail = false;
  $scope.hideList = false;
  $scope.hideDelete = false;
  $scope.selectionDelete = {};
  $scope.emailFormat = /^[a-zA-Z]+[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z.]{2,5}$/;
  $scope.users = [{'userid':'1','username':'User 1','isOpen':'false'},{'userid':'2','username':'User 2','isOpen':'false'},{'userid':'3','username':'User 3','isOpen':'false'}];

  $scope.addRecipient = function(recipient,isNotEmail){
    $scope.errorEmail=isNotEmail;
    if(recipient !== undefined && recipient != null){
      if(!(isNotEmail)){
        $scope.recipients.push(recipient);
        $scope.recipient = null;
      }
    }
  };

  $scope.setNullView = function(){
    $scope.singleRecipients = [];
    $scope.singleSubject = null;
    $scope.emailMessage = null;
    $scope.urlSafe = null;
  };

  $scope.cancelDelete = function(){
    $scope.hideDelete = false;
    $scope.selectAll = undefined;
    $scope.selectionDelete = {};
  };


  $scope.viewList = function(tablehead) {
    $scope.tablehead= tablehead;
    $scope.setNullView();
    $scope.cancelDelete();
    $http.get(backend+"/api/emails/list").then(function(response) {
        $scope.drafts = false;
        $scope.emailArray = response.data.data;
        $scope.noEmail = ($scope.emailArray.length === 0);
    });

  };

  $scope.countInbox = function() {
    $http.get(backend+"/api/emails/list").then(function(response) {
        $scope.drafts = false;
        var emailArray = response.data.data;
        $scope.cInbox = emailArray.length;
    });
  };

  $scope.countInbox();

  $scope.viewListDraft = function(tablehead) {
    $scope.tablehead= tablehead;
    $scope.setNullView();
    $scope.cancelDelete();
    $http.get(backend+"/api/emails/list_draft").then(function(response) {
      $scope.drafts = true;
      $scope.emailArray = response.data.data;
      $scope.noEmail = ($scope.emailArray.length === 0);
    });

  };

  $scope.countDrafts = function() {
    $http.get(backend+"/api/emails/list_draft").then(function(response) {
        $scope.drafts = false;
        var emailArray = response.data.data;
        $scope.cDraft = emailArray.length;
    });
  };

  $scope.countDrafts();

  $scope.viewList('Inbox');

  $scope.createEmail = function(tablehead){
    $scope.tablehead= tablehead;
    $scope.val = null;
    $scope.recipients = [];
    $scope.urlSafe = null;
    $scope.hideList = true;
  };

  $scope.enableDelete = function(){
    $scope.hideDelete = true;
    $scope.selectionDelete = {};
  };

  $scope.sendMsg = function(val){
    if($scope.recipients.length > 0) {
      $http.post(backend+"/api/emails/create",
          data = {
            "recipients": $scope.recipients,
            "subject": val === undefined ? "" : val.subject,
            "body": val === undefined ? "" : val.body
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          }).success(function (response) {
            $window.location.reload();
          })
          .error(function (data, status, header, config) {
            console.log("do nothing");
          });
    }
  };

  $scope.saveMsgDraft = function(val){
    if($scope.recipients.length > 0) {
      $http.post(backend+"/api/emails/create_draft",
          data = {
            "recipients": $scope.recipients,
            "subject": val.subject === undefined ? "" : val.subject,
            "body": val.body === undefined ? "" : val.body
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          }).success(function (response) {
            $window.location.reload();
            $scope.hideList = false;
          })
          .error(function (data, status, header, config) {
            console.log("do nothing");
          });
    }
  };

  $scope.cancelMsg = function(val){
    if($scope.recipients.length > 0){
      if (confirm("would you like to save it in drafts?")){
        $scope.saveMsgDraft(val);
      }
    }
    $scope.setNullView();
    $scope.hideList = false;
    $scope.errorEmail = false;
    $scope.val = null;
    $scope.recipient = [];
    $scope.tablehead= 'Inbox';
  };

  $scope.showMessage = function(recipients, subject, msg, urlsafe){
    $scope.singleRecipients = recipients;
    $scope.singleSubject = subject;
    $scope.emailMessage = msg;
    $scope.urlSafe = urlsafe;
  };

  $scope.showMessageDbl = function(recipients, subject, msg, urlsafe){
    $scope.singleRecipientsM = recipients;
    $scope.singleSubjectM = subject;
    $scope.emailMessageM = msg;
    $scope.urlSafeM = urlsafe;
    $('#myModal').modal('show');
  };


  $scope.deleteEmail = function(selectedDelete) {
    var dataArray, key;
    dataArray = [];
    for (key in selectedDelete) {
      if (selectedDelete[key]){
        dataArray.push(key);
      }
    }
    if(dataArray.length > 0){
      if (confirm("Are you sure you want to delete?")){
        $http.post(backend+"/api/emails/delete",
          data = dataArray, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          }).success(function (response) {
            //window.location.reload();
            $scope.viewList('Inbox');
          })
          .error(function (data, status, header, config) {
            console.log("do nothing");
          });
      }
    }
  };

  $scope.deleteAll = function(list){
    var dataArrayAll = [], data;
    for (data in list){
      dataArrayAll.push(list[data]['urlsafe']);
    }
    if (confirm("Are you sure you want to delete all?")){
        $scope.selectAll = 'checked';
        $http.post(backend+"/api/emails/delete",
          data = dataArrayAll, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          }).success(function (response) {
            //window.location.reload();
            $scope.viewList('Inbox');
          })
          .error(function (data, status, header, config) {
            console.log("do nothing");
          });
    }
  };

  $scope.editEmail = function(recipient, subject, body, urlsafe, tablehead){
    $scope.tablehead= tablehead;
    if((recipient === undefined && subject === undefined && body === undefined) || (recipient.length === 0 && subject === null && body === null)){
      alert("Select email in the draft");
    } else{
      $scope.hideList = true;
      $scope.val = {
        "subject" : subject,
        "body" : body
      };
      $scope.recipients = recipient;
      dataArray = [urlsafe];
      $http.post(backend+"/api/emails/delete_draft",
          data = dataArray, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          }).success(function (response) {
            //success
          })
          .error(function (data, status, header, config) {
            console.log("do nothing");
          });
    }
  };



  $scope.openMessage = function(user){
    console.log(user);
    console.log(user.isOpen==='false');
    if(user.isOpen==='false'){
      var btnhtml = '<chat-box userid="'+user.userid+'" username="'+user.username+'" classid="message'+user.userid+'"' +
          'countid="chat-message-counter'+user.userid+'" chatid="chat'+user.userid+'"></chat-box>';
      /*var btnhtml = '<div id="live-chat" class="message'+user.userid+'">' +
        '<header class="clearfix" ng-click="messageHide('+user.userid+')">' +
        '<a ng-click="messageClose(\'message'+user.userid+'\',\''+user.userid+'\')" class="chat-close">x</a>' +
        '<h4>'+user.username+'</h4>' +
        '<span class="chat-message-counter'+user.userid+'">2</span>' +
        '</header>' +
        '<div class="chat'+user.userid+'">' +
        '<div class="chat-history">' +
        '<hr>' +
        '<div class="chat-message clearfix">' +
        '<div class="chat-message-content clearfix">' +
        '<span class="chat-time">13:37</span>' +
        '<h5>sample</h5>' +
        '<p>Sample Message</p>' +
        '</div>' +
        '</div>' +
        '<hr>' +
        '<div class="chat-message clearfix">' +
        '<div class="chat-message-content clearfix">' +
        '<span class="chat-time">13:38</span>' +
        '<h5>sample</h5>' +
        '<p>Sample</p>' +
        '</div>' +
        '</div>' +
        '<hr>' +
        '</div>' +
        '<p class="chat-feedback">Your partner is typing…</p>' +
        '<form action="#" method="post">' +
        '<fieldset>' +
        '<input type="text" placeholder="Type your message…" autofocus>' +
        '<input type="hidden">' +
        '</fieldset>' +
        '</form>' +
        '</div>' +
        '</div>';*/
      var temp = $compile(btnhtml)($scope);
      angular.element(document.getElementById('messages')).append(temp);
      user.isOpen=true;
    }
  };

  $scope.messageHide = function(userId) {
    $('.chat'+userId).slideToggle(300, 'swing');
    $('.chat-message-counter'+userId).fadeToggle(300, 'swing');
  };

  $scope.messageClose =  function(divName,userID) {
      $( "."+divName ).remove();
      for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.users[i].userid === userID) {
              $scope.users[i].isOpen = 'false';
              break;
          }
      }
  };

})

.directive("chatBox", function(){
	return {
		restrict: 'E',
        controller: 'EmailCtrl',
        scope: {username: '@username', userid: '@userid', classid: '@classid',countid: '@countid', chatid: '@chatid'},
		template: '<div id="live-chat" class="{{classid}}">' +
                  '<header class="clearfix" ng-click="messageHide(\''+scope.userid()+'\')">' +
                  '<a ng-click="messageClose(\''+scope.classid()+'\',\''+scope.userid()+'\')" class="chat-close">x</a>' +
                  '<h4>{{username}}</h4>' +
                  '<span class="{{countid}}">2</span>' +
                  '</header>' +
                  '<div class="{{chatid}}">' +
                  '<div class="chat-history">' +
                  '<hr>' +
                  '<div class="chat-message clearfix">' +
                  '<div class="chat-message-content clearfix">' +
                  '<span class="chat-time">13:37</span>' +
                  '<h5>sample</h5>' +
                  '<p>Sample Message</p>' +
                  '</div>' +
                  '</div>' +
                  '<hr>' +
                  '<div class="chat-message clearfix">' +
                  '<div class="chat-message-content clearfix">' +
                  '<span class="chat-time">13:38</span>' +
                  '<h5>sample</h5>' +
                  '<p>Sample</p>' +
                  '</div>' +
                  '</div>' +
                  '<hr>' +
                  '</div>' +
                  '<p class="chat-feedback">Your partner is typing…</p>' +
                  '<form action="#" method="post">' +
                  '<fieldset>' +
                  '<input type="text" placeholder="Type your message…" autofocus>' +
                  '<input type="hidden">' +
                  '</fieldset>' +
                  '</form>' +
                  '</div>' +
                  '</div>'
	};
})

;
