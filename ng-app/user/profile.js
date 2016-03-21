// Profile Page
app.controller('ProfileCtrl', function($scope, UserStatus, $state, $rootScope){
  var initialize = function (){
    var user_id;
    var subscriptionId;  
    $scope.spinner = false;
    $scope.currentTabIndex = 0;
    $scope.spinner = false;
  };

  $scope.showTab = function(tabIndex){
    $scope.currentTabIndex = tabIndex;
  };
  $scope.changeProfile = function(user){
    $scope.spinner = true;
    console.log(user._id);
    console.log(user.displayName);
   
    console.log(user.email);
    console.log(user.logged);
    var userData = {
      displayName: user.displayName
    };
    
    UserStatus.updateUser(user._id, userData)
    .then(function(res){
      $scope.$apply(function(){
        $scope.spinner = false;
        $scope.user.displayName = res.displayName;
      })

      $scope.successMsg = "사용자명이 변경되었습니다";
      Materialize.toast($scope.successMsg, 2000);
    }, function(err){
      // console.log(err);
      $scope.spinner = false;
      $scope.error = err;
    })
  };

  $scope.cancelSubscription = function(){
    $scope.spinner = true;
    UserStatus.getUser()
    .then(function(res){
      user_id = res.user._id;
      return UserStatus.getSubscriptions(user_id, '');
    }, function(err){
      // console.log(err);
      $scope.error = err;
      $scope.spinner = false;
    })
    .then(function(getSubs){
      // console.log('getSubs', getSubs);
      // console.log('subid', getSubs.data[0].id)
      subscriptionId = getSubs.data[0].id;
      // console.log(user_id);
      // console.log(subscriptionId);
      return UserStatus.unsubscribe(user_id, subscriptionId, {});
    }, function(err){
      $scope.spinner = false;
    })
    .then(function(cancellation){
      // console.log(cancellation);
      $scope.$apply(function(){
        $rootScope.subscriptions = cancellation;
        $rootScope.subscribed = false; 
        UserStatus.updateUser(user_id, {'subscribed': false})
          .then(function(res){
            $scope.successMsg = "Pro 회원권을 안전하게 취소하였습니다"
                Materialize.toast($scope.successMsg, 3000);
            $scope.spinner = false;
            $state.go('home');
          }, function(err){
            // console.log(err);
            $scope.error = err;
            $scope.spinner = false;
          })
      }, function(err){
        $scope.error = err;
        // console.log(err);
        $scope.spinner = false;
      })
    }, function(err){
      $scope.error = err;
      // console.log(err);
      $scope.spinner = false;
    })
  };

  $scope.deleteUser = function(){
    $scope.spinner = true;
    UserStatus.getUser()
    .then(function(res){
      user_id = res.user._id;
      this.user_id = user_id;
      return UserStatus.deleteUser(user_id);
    }, function(err){
      $scope.error = err;
      $scope.spinner = false;
    })
    .then(function(res){
      $scope.spinner = false;
      return UserStatus.logout();
    }, function(err){
      $scope.error = err;
      $scope.spinner = false;
    })
    // .then(function(res){
    //   $scope.message = "회원탈퇴하셨습니다. 개선해야할 문제를 support@codingo.co로 보내주시면 최선을 다하겠습니다. 감사합니다.";
    //   $scope.spinner = false;
    // }, function(err){
    //   $scope.error = err;
    //   $scope.spinner = false;
    // })
  };

  $scope.changePassword = function(password){
    console.log(password);
    if(password.change !== password.confirm){
      $scope.error = "입력한 비밀번호를 확인해주세요";
    }
    if(password.change === password.confirm){
      UserStatus.getUser()
      .then(function(res){
        console.log(res.user);
        var emailAndNewPassword = {
          email: res.user.email,
          newPassword: password.change
        }
        
        Stamplay.User.resetPassword(emailAndNewPassword)
        .then(function(res){
          console.log(res);
          $scope.successMsg = "비밀번호 재설정 이메일이 보내졌습니다. 보내진 이메일에 링크를 클릭하여 변경을 확인해주시기 바랍니다."
          Materialize.toast($scope.successMsg, 8000);
          $state.go('home');
        }, function(err){
          console.log(err);
        })
      })    
    }
  };

  initialize();
});