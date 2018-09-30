var deciseconds = 0;
var clickList = [];
var judge_name = "";
var yt_link = "";
var pos = 0;
var neg = 0;
var t;

function saveData()
{
  judge_name = $('#judge-name').val();
  yt_link = $('#yt-link').val();
}


$("body").on("keydown", function(event)
{
  // enter key to start the timer - press this once the song starts
  if (event.which == 13)
  {
    timer();
  }
  // press a key to click a negative
  else if (event.which == 76)
  {
    neg+=1;
    raw = pos-neg;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text(" +" + String(pos) + " " + "-" + String(neg));
  }
  // press a key to click a positive
  else if (event.which == 65)
  {
    pos+=1;
    raw = pos-neg;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text(" +" + String(pos) + " " + "-" + String(neg));
  }
  // press 0 key to end the timer
  else if (event.which == 48)
  {
    clearTimeout(t);
    deciseconds = 0;
    console.log(clickList);
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

function showChart()
{
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(drawBasic);
}

function drawBasic()
{
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', $('#judge-name').val());
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
