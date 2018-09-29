var pos = 0;
var neg = 0;
var deciseconds = 0;
var clickList = [];

$(function() {
    $("#chart").hide();
  });

$("body").on("keydown", function(event)
{

  if (event.which == 65)
  {
    pos+=1;
    raw = pos-neg;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text(" +" + pos + " " + "-" + neg);
  }
  else if (event.which == 76)
  {
    neg+=1;
    raw = pos-neg;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text(" +" + pos + " " + "-" + neg);
  }
  else if (event.which == 48)
  {
    clearTimeout(t);
    deciseconds = 0;
    console.log(clickList);
    //$("#click-display").text(" +" + 0 + " " + "-" + 0);
    showChart();

  }
});

function add()
{
  deciseconds++;
  timer();
}

function timer()
{
  t = setTimeout(add, 100);
}
timer();

function showChart()
{
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(drawBasic);
}

function drawBasic()
{
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Time');
    data.addColumn('number', 'Clicks');
    data.addRows(clickList);

    var options = {
      hAxis: {
        title: 'Time'
      },
      vAxis: {
        title: 'Score'
      },
      curveType: 'function',
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(data, options);
    $('#chart').show();
}
