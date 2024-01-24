/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9486666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9925, 500, 1500, "Seller - GET Product by ID"], "isController": false}, {"data": [1.0, 500, 1500, "Buyer - GET Order by ID"], "isController": false}, {"data": [0.995, 500, 1500, "Seller - GET Product"], "isController": false}, {"data": [0.995, 500, 1500, "Buyer - POST Create Order"], "isController": false}, {"data": [0.96, 500, 1500, "Seller - POST Register Account"], "isController": false}, {"data": [0.9825, 500, 1500, "Seller - DELETE Product by ID"], "isController": false}, {"data": [0.8225, 500, 1500, "Buyer - POST Register Account"], "isController": false}, {"data": [1.0, 500, 1500, "Buyer - PUT Edit Order By ID"], "isController": false}, {"data": [0.92, 500, 1500, "Buyer - GET Product"], "isController": false}, {"data": [0.995, 500, 1500, "Buyer - GET Product by ID"], "isController": false}, {"data": [0.995, 500, 1500, "Seller - POST Login Account"], "isController": false}, {"data": [0.7175, 500, 1500, "Buyer - POST Login Account"], "isController": false}, {"data": [0.9275, 500, 1500, "Seller - POST Create Product"], "isController": false}, {"data": [1.0, 500, 1500, "Buyer - GET Order"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3000, 0, 0.0, 204.5443333333334, 21, 1502, 113.5, 503.0, 796.4999999999982, 1235.949999999999, 4.875163317971152, 3.4107099619087236, 29.374288848246728], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Seller - GET Product by ID", 200, 0, 0.0, 72.98, 53, 877, 56.0, 79.0, 97.79999999999995, 532.8600000000001, 0.3268251550785361, 0.23107559792662122, 0.12192110277343828], "isController": false}, {"data": ["Buyer - GET Order by ID", 200, 0, 0.0, 72.78500000000003, 48, 475, 51.0, 132.9, 201.0, 231.84000000000015, 0.3259356798529378, 0.3905498820112839, 0.12063439713306975], "isController": false}, {"data": ["Seller - GET Product", 200, 0, 0.0, 107.83499999999998, 77, 1007, 81.0, 185.9, 206.89999999999998, 565.2700000000016, 0.3268150079987973, 0.23170673418664733, 0.12000238574955839], "isController": false}, {"data": ["Buyer - POST Create Order", 200, 0, 0.0, 90.99000000000002, 62, 957, 66.0, 130.0, 198.6999999999997, 620.3900000000033, 0.3259170899514872, 0.2126099766480405, 0.14099733481299692], "isController": false}, {"data": ["Seller - POST Register Account", 200, 0, 0.0, 256.1049999999999, 156, 1335, 184.5, 464.1, 655.6999999999997, 1011.850000000001, 0.32686521549406494, 0.18960736133151812, 0.5205280676096183], "isController": false}, {"data": ["Seller - DELETE Product by ID", 200, 0, 0.0, 122.40500000000006, 64, 877, 67.0, 407.8000000000001, 452.4499999999999, 760.0100000000009, 0.3268208825471113, 0.09957823765107295, 0.12894105131741498], "isController": false}, {"data": ["Buyer - POST Register Account", 200, 0, 0.0, 478.8949999999999, 126, 1502, 272.5, 998.3000000000001, 1198.9999999999995, 1494.900000000001, 0.3260642737896494, 0.18914275256938648, 0.5200979904658807], "isController": false}, {"data": ["Buyer - PUT Edit Order By ID", 200, 0, 0.0, 70.42500000000001, 54, 377, 57.0, 109.0, 165.89999999999975, 242.86000000000013, 0.32593514868346646, 0.21103027693079907, 0.1355941145890202], "isController": false}, {"data": ["Buyer - GET Product", 200, 0, 0.0, 294.4900000000001, 109, 1250, 181.0, 713.7000000000002, 939.9999999999991, 1167.8200000000002, 0.3258820404778083, 0.23104527479188355, 0.14066392762811644], "isController": false}, {"data": ["Buyer - GET Product by ID", 200, 0, 0.0, 55.16000000000002, 21, 603, 24.0, 136.70000000000002, 170.64999999999992, 517.8100000000002, 0.32593939808771355, 0.2867884742939745, 0.12127237370255749], "isController": false}, {"data": ["Seller - POST Login Account", 200, 0, 0.0, 220.94499999999996, 121, 773, 164.5, 454.8, 457.0, 500.93000000000006, 0.3268134058859094, 0.16532162524306745, 0.09415034642221023], "isController": false}, {"data": ["Buyer - POST Login Account", 200, 0, 0.0, 598.9400000000002, 122, 1466, 504.0, 1242.7, 1265.9, 1461.0, 0.325995713156372, 0.16490798770996162, 0.09391478064563451], "isController": false}, {"data": ["Seller - POST Create Product", 400, 0, 0.0, 277.07750000000016, 106, 1252, 236.5, 553.8000000000001, 637.4999999999997, 942.8500000000001, 0.652694649861955, 0.4289682610909138, 27.117563258349595], "isController": false}, {"data": ["Buyer - GET Order", 200, 0, 0.0, 72.05499999999999, 51, 415, 54.0, 114.70000000000002, 174.6999999999997, 345.6700000000003, 0.32593461751572633, 0.39118520012385516, 0.11872423079430267], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
