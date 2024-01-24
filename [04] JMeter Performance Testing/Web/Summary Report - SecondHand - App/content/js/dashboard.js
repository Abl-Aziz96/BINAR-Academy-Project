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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9369117647058823, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Seller - GET List Product"], "isController": false}, {"data": [1.0, 500, 1500, "Buyer - POST Registration"], "isController": false}, {"data": [1.0, 500, 1500, "Seller - GET Category by ID"], "isController": false}, {"data": [1.0, 500, 1500, "Seller - GET Product"], "isController": false}, {"data": [1.0, 500, 1500, "Buyer - POST Sign In"], "isController": false}, {"data": [1.0, 500, 1500, "Seller - GET List Categories"], "isController": false}, {"data": [0.9975, 500, 1500, "Seller - GET List Offer"], "isController": false}, {"data": [1.0, 500, 1500, "Seller - POST Sign In"], "isController": false}, {"data": [0.9575, 500, 1500, "Seller - POST Registration"], "isController": false}, {"data": [1.0, 500, 1500, "Buyer - POST Create Offer"], "isController": false}, {"data": [0.5, 500, 1500, "Buyer - PUT Update Profile"], "isController": false}, {"data": [1.0, 500, 1500, "Seller - GET Profile"], "isController": false}, {"data": [0.98, 500, 1500, "Seller - PUT Update Product"], "isController": false}, {"data": [0.9925, 500, 1500, "Seller - POST Create Product"], "isController": false}, {"data": [1.0, 500, 1500, "Seller - DELETE Product"], "isController": false}, {"data": [0.5, 500, 1500, "Seller - PUT Update Profile"], "isController": false}, {"data": [1.0, 500, 1500, "Seller - PUT Update Offer"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3400, 0, 0.0, 257.72911764705884, 17, 1628, 61.0, 932.0, 970.0, 1030.0, 3.869555023934336, 7.266702242506721, 37.28360722764592], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Seller - GET List Product", 200, 0, 0.0, 38.40499999999999, 31, 152, 36.0, 43.0, 45.0, 143.71000000000026, 0.2288261447599957, 0.5023281361910287, 0.15590792279062637], "isController": false}, {"data": ["Buyer - POST Registration", 200, 0, 0.0, 308.44, 299, 456, 306.0, 312.0, 315.95, 427.5700000000004, 0.2287554786937147, 0.39094065575331466, 0.07394342133556599], "isController": false}, {"data": ["Seller - GET Category by ID", 200, 0, 0.0, 21.004999999999995, 17, 73, 19.0, 24.900000000000006, 28.94999999999999, 60.950000000000045, 0.22882797742383176, 0.16290585502145835, 0.14898176198114685], "isController": false}, {"data": ["Seller - GET Product", 200, 0, 0.0, 33.33000000000001, 29, 70, 32.0, 38.0, 40.0, 67.83000000000015, 0.2288261447599957, 0.48231925630644856, 0.15143866215078272], "isController": false}, {"data": ["Buyer - POST Sign In", 200, 0, 0.0, 298.72999999999996, 293, 453, 296.0, 299.0, 305.9, 363.8700000000001, 0.22875783352606183, 0.3907067630537798, 0.07036984136788034], "isController": false}, {"data": ["Seller - GET List Categories", 200, 0, 0.0, 21.325000000000003, 18, 70, 20.0, 24.0, 28.0, 52.950000000000045, 0.2288269301837595, 0.23910626493810802, 0.14853415256234676], "isController": false}, {"data": ["Seller - GET List Offer", 200, 0, 0.0, 55.395, 39, 514, 48.0, 59.0, 63.94999999999999, 457.3600000000015, 0.22882850104746247, 0.7053750277454557, 0.1503228948922046], "isController": false}, {"data": ["Seller - POST Sign In", 200, 0, 0.0, 297.465, 293, 336, 296.0, 299.0, 303.95, 332.96000000000004, 0.22875809517709308, 0.39313106280439125, 0.0703699218562347], "isController": false}, {"data": ["Seller - POST Registration", 200, 0, 0.0, 373.6149999999998, 325, 1628, 331.0, 450.8000000000002, 644.3999999999996, 1321.0700000000027, 0.22866341659730544, 0.39273388408822746, 0.07614670415984487], "isController": false}, {"data": ["Buyer - POST Create Offer", 200, 0, 0.0, 61.654999999999994, 54, 120, 59.0, 70.0, 73.94999999999999, 91.92000000000007, 0.22882405032298514, 0.6997747835038454, 0.17205155205632733], "isController": false}, {"data": ["Buyer - PUT Update Profile", 200, 0, 0.0, 980.86, 903, 1317, 969.0, 1031.9, 1070.95, 1261.2100000000007, 0.22858501305220424, 0.3421386363818193, 6.2460877139269995], "isController": false}, {"data": ["Seller - GET Profile", 200, 0, 0.0, 26.1, 22, 134, 24.0, 31.0, 33.0, 50.98000000000002, 0.22882745380259742, 0.3440434175780674, 0.1480875638285579], "isController": false}, {"data": ["Seller - PUT Update Product", 200, 0, 0.0, 434.0099999999998, 375, 781, 426.5, 468.9, 497.9, 705.3200000000006, 0.22872748606763701, 0.4958483548918519, 18.758527469956643], "isController": false}, {"data": ["Seller - POST Create Product", 200, 0, 0.0, 387.72000000000025, 342, 800, 382.0, 415.9, 439.84999999999997, 530.9100000000001, 0.22873611857680387, 0.49709004769148074, 9.56792685376328], "isController": false}, {"data": ["Seller - DELETE Product", 200, 0, 0.0, 34.345, 27, 76, 33.0, 41.900000000000006, 46.0, 63.950000000000045, 0.2288292864874018, 0.22300799458017834, 0.1543458006679527], "isController": false}, {"data": ["Seller - PUT Update Profile", 200, 0, 0.0, 961.3400000000001, 886, 1204, 952.5, 1008.8, 1024.0, 1111.7600000000002, 0.22856960001462845, 0.34365461683449394, 1.2036722902645351], "isController": false}, {"data": ["Seller - PUT Update Offer", 200, 0, 0.0, 47.654999999999994, 39, 420, 43.0, 52.0, 56.94999999999999, 130.93000000000006, 0.2288261447599957, 0.6982929247814139, 0.16439951800632935], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
