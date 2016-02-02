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
var weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
NgAPP.controller('calCtrl', function ($scope) {
    $scope.today = new Date();
    $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.selectDay = new Date();
    $scope.selectMonth = []
    $scope.drawCalendar = function (today) {
        var todayString = today.getFullYear() + '/' + eval(today.getMonth() + '+1').toString() + '/1';
        var todayNumber = Date.parse(todayString);
        var firstMonthDay = new Date(todayNumber);
        var f = todayNumber - firstMonthDay.getDay() * 86400000;
        for (var i = 0; i < 42; i++) {
            var day = new Date(f + 86400000 * i);

            day.class = [];
            if (day.getMonth() == today.getMonth())day.class.push("this-month");
            if (day.getMonth() == $scope.today.getMonth() && day.getDate() == $scope.today.getDate())
                day.class.push("today");
            if (day.getMonth() == today.getMonth() && day.getDate() == today.getDate())
                day.class.push("day-selected");
            if (day.getDate()<10)
                day.class.push("single-day");

            $scope.selectMonth.push(day)
        }
    };
    $scope.drawCalendar($scope.today);

})
function drawCalendar(today) {
    var todayString = today.getFullYear() + '/' + eval(today.getMonth() + '+1').toString() + '/1';
    var todayNumber = Date.parse(todayString);
    var firstMonthDay = new Date(todayNumber);
    var f = todayNumber - firstMonthDay.getDay() * 86400000;
//        var firstSunDay = new Date(f);
    var calBig = document.getElementsByClassName('calBig')[0];
    var calSmall = document.getElementsByClassName('calSmall')[0];
    var thisMonth = $('.month-year .this-month')[0];
    var thisYear = $('.month-year .this-year')[0];

    calBig.innerHTML = '';
    calSmall.innerHTML = '<div><div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div></div>';
    thisMonth.innerHTML = today.toString().split(' ')[1];
    thisYear.innerHTML = today.getFullYear();
    var count = f - 86400000;
    for (var i = 0; i <= 5; i++) {
        var calBigdiv = document.createElement('div');
        var calSmalldiv = document.createElement('div');
        for (var j = 0; j < 7; j++) {
            count = count + 86400000;
            var day = new Date(count);
            var divDay = document.createElement('div');
            divDay.id = day.getFullYear() + day.toString().split(' ')[1] + day.getDate();
            var divDay1 = document.createElement('div');
            divDay1.id = day.getDate() + day.toString().split(' ')[1] + day.getFullYear();
            divDay1.onclick = function () {
                $('.selected').removeClass('selected');
                $('.day-selected').removeClass('day-selected');
                $(this).addClass('day-selected');
                $(this.parentNode).addClass('selected');
            };
            divDay.onclick = function () {
                $('.selected').removeClass('selected');
                $('.day-selected').removeClass('day-selected');
                var day = $('#' + this.id.slice(7) + this.id.slice(4, 7) + this.id.slice(0, 4));
                day.addClass('day-selected');
                day.parent().addClass('selected');
            };

            var span = document.createElement('span');
            var span1 = document.createElement('span');
            if (day.getDate() == '1') {
                span.innerHTML = day.toString().split(' ')[1] + ' ' + day.getDate();
            } else {
                span.innerHTML = day.getDate();
            }
            if (day.getMonth() == today.getMonth()) {
                divDay1.className = 'this-month'
            }
            if (day.getDate() < 10) {
                span1.style.padding = '3px'
            }
            span1.innerHTML = day.getDate();
            divDay1.appendChild(span1);
            calSmalldiv.appendChild(divDay1);
            divDay.appendChild(span);
            calBigdiv.appendChild(divDay);
        }
        calBig.appendChild(calBigdiv);
        calSmall.appendChild(calSmalldiv);

    }
//            var divEmpty = document.createElement('div');
//            divEmpty.style.width = '100%';//this is chrome bug
//            calSmall.appendChild(divEmpty);
    var divHolidays = $('.calSmall .holidays')[0];
    divHolidays.innerHTML = "";
    for (var i in Holidays) {
        if (i.slice(0, 4) == today.getFullYear().toString()) {
            $("#" + eval(i.slice(6)).toString() + month[i.slice(4, 6)] + i.slice(0, 4)).addClass('holiday');
            var divHoliday = document.createElement('div');
            divHoliday.className = 'holiday';
            var span1 = document.createElement('span');
            var da = new Date(Date.parse(i.slice(0, 4) + "/" + i.slice(4, 6) + "/" + i.slice(6) + "/"));
            span1.innerHTML = weeks[da.getDate()] + " " + da.getDay() + '/' + eval(da.getMonth() + "+1").toString() + '/' + da.getFullYear();
            var div1 = document.createElement('div');
            var span2 = document.createElement('span');

        }
    }

//            <div class="holiday">
//                <span>SUNDAY 2/7/2016</span>
//                <div>
//                    <div class="holiday-name">
//                        <span class="color-bg-A">除aaa夕</span>
//                        <span class="color-bg-A">除夕</span>
//                    </div>
//                    <div class="holiday-time">
//                        <span>all-day</span>
//                    </div>
//                </div>
//            </div>


    var todaySelect = $('#' + today.getDate() + today.toString().split(' ')[1] + today.getFullYear());
    todaySelect.addClass('day-selected');
    todaySelect.parent().addClass('selected');
    today = new Date();
    $('#' + today.getDate() + today.toString().split(' ')[1] + today.getFullYear()).addClass('today');
    $('#' + today.getFullYear() + today.toString().split(' ')[1] + today.getDate() + ' span').addClass('today');
}

$(document).ready(function () {
    var now = new Date();
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
    var weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var Holidays;
    $.get('./holidays', function (e) {
//        http://www.google.com/calendar/ical/zh_cn.china#holiday@group.v.calendar.google.com/public/basic.ics
// make json shell :cat basic.ics | awk  -F: '{if($1=="SUMMARY") print "\""$2 ;else if($1=="DTSTART;VALUE=DATE") printf "\n\"%d\":",$2}'|sort -u|sed -e 's/\r/",/g'|awk '{if(NR==1) print "{"$0;else print $0}' > holidays && echo '"":""}' >> holidays
        // https://p30-calendars.icloud.com/holidays/cn_zh.ics
        Holidays = JSON.parse(e);
        //drawCalendar(now);
    });

    $('.next-month').click(function () {
        if (now.getMonth() == '11') {
            now = new Date(Date.parse(eval(now.getFullYear() + '+1').toString() + '/1/1'))
        } else {
            now = new Date(Date.parse(now.getFullYear() + '/' + eval(now.getMonth() + '+2').toString() + '/1'))
        }
        drawCalendar(now);
    });
    $('.past-month').click(function () {
        if (now.getMonth() == 0) {
            now = new Date(Date.parse(eval(now.getFullYear() + '-1').toString() + '/12/1'))
        } else {
            now = new Date(Date.parse(now.getFullYear() + '/' + now.getMonth() + '/1'))
        }
        drawCalendar(now);
    });
    $('.cal-right .topbar .today .Today').click(function () {
        now = new Date();
        //drawCalendar(now);
    });

})