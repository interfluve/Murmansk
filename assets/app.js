moment.locale('ru');

var tSrc = 'https://raw.githubusercontent.com/interfluve/Sensor-Data/master/temperature.json';

function requestData() {
    $.ajax({
        type: 'GET',
        url: tSrc,
        dataType: 'json',
        timeout: 300,
        success: function(rawData){
            updateData(rawData);
        },
        error: function(xhr, type){
           console.log('Ajax error!');
        }
    });

    setTimeout(requestData, 120000);    //2 seconds loop

}

function updateData(rawData) {
    var t = rawData.t.toFixed(2);
    if (t > 0) {
        t = '+' + 1;
        $("#favicon").attr("href","img/faviconPositive.ico");
    }

    var time = moment.unix(rawData.time).fromNow();

    document.title = t + '°C';
    $("#t").text(t);
    $("#time").text(time);
}

requestData();