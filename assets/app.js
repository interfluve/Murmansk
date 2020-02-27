moment.locale('ru');

var tNowSrc = 'https://raw.githubusercontent.com/interfluve/Sensor-Data/master/temperature_now.json';
var t24Src  = 'https://raw.githubusercontent.com/interfluve/Sensor-Data/master/temperature_24.json';

function requestNowData() {
    $.ajax({
        type: 'GET',
        url: tNowSrc,
        dataType: 'json',
        timeout: 2000,
        success: function(rawData){
            updateData(rawData);
        },
        error: function(xhr, type){
           console.log('Ajax error!');
        }
    });

    setTimeout(requestNowData, 120000);    //2 seconds loop
}
requestNowData();

function request24Data() {
    $.ajax({
        type: 'GET',
        url: t24Src,
        dataType: 'json',
        timeout: 2000,
        success: function(rawData){
            buildChart(rawData)
        },
        error: function(xhr, type){
            console.log('Ajax error!');
        }
    });
}

request24Data();

function buildChart(data) {
    var chartLabels = [];
    var chartData_w1_t      = [];
    var chartData_bme280_t  = [];
    var chartData_fc_t      = [];

    var i = 0;
    data.forEach(function(item) {
        if (i++ % 2) {
            return;
        }
        chartLabels.push(moment.unix(item.time));
        chartData_w1_t.push(item.w1_t.toFixed(2));
        chartData_bme280_t.push(item.bme280_t.toFixed(2));
        chartData_fc_t.push(item.fc_t.toFixed(2));
    });

    var lineColor_w1_t = '#81BEFF';
    var lineColor_bme280_t = '#76ADE7';
    var lineColor_fc_t = '#5B98DA';
    if (data[data.length-1].w1_t > 0){
        lineColor_w1_t = '#FFD59D';
        lineColor_bme280_t = '#FFBF9D';
        lineColor_fc_t = '#FF9E9D';
    }

    var ctx = $('#tChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    backgroundColor: lineColor_w1_t,
                    borderColor: lineColor_w1_t,
                    label: "Сенсор w1:",
                    data: chartData_w1_t,
                    fill: false,
                },
                {
                    backgroundColor: lineColor_bme280_t,
                    borderColor: lineColor_bme280_t,
                    label: "Сенсор bme280:",
                    data: chartData_bme280_t,
                    fill: false,
                },
                {
                    backgroundColor: lineColor_fc_t,
                    borderColor: lineColor_fc_t,
                    label: "Онлайн:",
                    data: chartData_fc_t,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true,
                animationDuration: 0
            },

            animation: {duration: 0},
            responsiveAnimationDuration: 0,
            onResize: function(instance, size) {
                console.log(size);
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: function(tooltipItems, data) {
                        console.log(tooltipItems)
                        return tooltipItems[0].xLabel;
                    },
                    label: function(tooltipItems, data) {
                        var label = data.datasets[tooltipItems.datasetIndex].label || '';
                        var plus = tooltipItems.yLabel > 0 ? '+':'';
                        return label + ' ' + plus + tooltipItems.yLabel + ' °C';
                    }
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'series',
                    time: {
                        displayFormats: {
                            year: 'dddd'
                        }
                    },
                    display: false
                }],
                yAxes: [{
                    display: false
                }],
            }
        }
    });
}


function updateData(rawData) {
    var t = rawData.w1_t.toFixed(2);
    if (t > 0) {
        t = '+' + t;
        $("#favicon").attr("href","img/faviconPositive.ico");
    }

    var time = moment.unix(rawData.time).fromNow();

    var arrow = $('.arrow');
    if (rawData.temp_direction < 0) {
        arrow.addClass('color-cold');
        arrow.text('↓');
    }
    else if (rawData.temp_direction > 0) {
        arrow.addClass('color-worm');
        arrow.text('↑');
    }

    document.title = t + '°C';
    $("#t").text(t);
    $("#time").text(time);
}



