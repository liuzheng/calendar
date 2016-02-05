/**
 * Created by liuzheng on 2/1/16.
 */
'use strict';
var NgAPP = angular.module('Calendar', []);
NgAPP.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});
NgAPP.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {$event: event});
                });
                event.preventDefault();
            }
        });
    };
});
var month = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
};
NgAPP.controller('calCtrl', function ($scope, $http) {
    $scope.weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $scope.today = new Date();
    $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $http.get('holidays').success(function (data) {
        $scope.holidays = data;
        $scope.drawCalendar($scope.today);
    });

    $scope.drawCalendar = function (today) {
        $scope.selectDay = today;
        $scope.selectMonth = {};
        var todayString = today.getFullYear() + '/' + eval(today.getMonth() + '+1').toString() + '/1';
        var todayNumber = Date.parse(todayString);
        var firstMonthDay = new Date(todayNumber);
        var f = todayNumber - firstMonthDay.getDay() * 86400000;
        $scope.selectDay.key = Math.floor((today.getTime() - f) / 86400000);
        for (var i = 0; i < 42; i++) {
            var day = new Date(f + 86400000 * i);

            day.class = [];
            if (day.getMonth() == today.getMonth())day.class.push("this-month");
            if (day.getMonth() == $scope.today.getMonth() && day.getDate() == $scope.today.getDate() && day.getFullYear() == $scope.today.getFullYear()) {
                day.class.push("today");
                day.today = true;
            }
            if (day.getMonth() == today.getMonth() && day.getDate() == today.getDate())
                day.class.push("day-selected");
            var tmp_selectDay = i - $scope.selectDay.key + $scope.selectDay.getDay();
            if (tmp_selectDay < 7 && tmp_selectDay >= 0) {
                if (tmp_selectDay == 0) {
                    day.class.push('selected left')
                } else if (tmp_selectDay == 6) {
                    day.class.push('selected right')
                } else {
                    day.class.push('selected')
                }
            }
            if (day.getDate() < 10)
                day.class.push("single-day");
            day.key = i;
            var dayid = day.toJSON().slice(0, 10).replace(/-/g, '');
            try {
                day.holidays=$scope.holidays[eval(dayid)];
            } catch (e) {
            }
            $scope.selectMonth[dayid] = day
        }
    };

    $scope.showDay = function (day) {
        $scope.drawCalendar(day);
    };
    $scope.gotoToday = function () {
        $scope.drawCalendar($scope.today);
    };
    $scope.gotoPastMonth = function () {
        var goto;
        if ($scope.selectDay.getMonth() == 0) {
            goto = new Date(Date.parse(eval($scope.selectDay.getFullYear() + '-1').toString() + '/12/1'))
        } else {
            goto = new Date(Date.parse($scope.selectDay.getFullYear() + '/' + $scope.selectDay.getMonth() + '/1'))
        }
        $scope.drawCalendar(goto)
    };
    $scope.gotoNextMonth = function () {
        var goto;
        if ($scope.selectDay.getMonth() == 11) {
            goto = new Date(Date.parse(eval($scope.selectDay.getFullYear() + '+1').toString() + '/1/1'))
        } else {
            goto = new Date(Date.parse($scope.selectDay.getFullYear() + '/' + eval($scope.selectDay.getMonth() + '+2').toString() + '/1'))
        }
        $scope.drawCalendar(goto)
    };
})

