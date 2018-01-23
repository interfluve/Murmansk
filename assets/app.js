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
    var chartData   = [];

    var i = 0;
    data.forEach(function(item) {
        if (i++ % 2) {
            return;
        }
        chartLabels.push(moment.unix(item.time));
        chartData.push(item.t.toFixed(2));
    });

    var lineColor = '#baddff';
    if (data[data.length-1].t > 0){
        lineColor = '#ffb991';
    }

    var ctx = $('#tChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                backgroundColor: lineColor,
                borderColor: lineColor,
                label: "Температура",
                data: chartData,
                fill: false,
            }]
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
            // plugins: {
            //     datalabels: {
            //         backgroundColor: function(context) {
            //             return context.dataset.backgroundColor;
            //         },
            //         borderRadius: 4,
            //         font: {
            //             weight: 'bold'
            //         }
            //     }
            // },
            tooltips: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: function(tooltipItems, data) {
                        return tooltipItems[0].xLabel.calendar();
                    },
                    label: function(tooltipItems, data) {
                        return ' ' + tooltipItems.yLabel + ' °C';
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
                    }
                }]
            }
        }
    });
}


function updateData(rawData) {
    var t = rawData.t.toFixed(2);
    if (t > 0) {
        t = '+' + 1;
        $("#favicon").attr("href","img/faviconPositive.ico");
    }

    var time = moment.unix(rawData.time).fromNow();

    var arrow = $('.arrow');
    if (rawData.direction < 0) {
        arrow.addClass('color-cold');
        arrow.text('↓');
    }
    else if (rawData.direction > 0) {
        arrow.addClass('color-worm');
        arrow.text('↑');
    }

    document.title = t + '°C';
    $("#t").text(t);
    $("#time").text(time);
}



