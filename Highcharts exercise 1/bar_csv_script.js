Highcharts.ajax({  
    url: 'data.csv',  
    dataType: 'text',  
    success: function (data) {
        const dataRows = data.trim().split(/\r\n|\n|\r/); //turn in to array of rows
        const colors = dataRows[0].split(',').slice(1) // first row ['#058DC7','#50B432', '#ED561B',..] 
        const categories = dataRows[1].split(',').slice(1); // second row ['Africa','APAC','Europe','LATAM', ...]
        const series = dataRows.map(item => item.split(',')[0]).slice(2); // the the first column of the rest rows ['Employee', 'Resident', 'Visitor']
        const defaultSeries = series[0]; //default the first one

        // function to populate chart data
        function getSeriesData(seriesName) {
            const data = [];
            for (let i = 1; i < dataRows.length; i++) {
                let values = dataRows[i].split(','); // initialize i = 1 to skip the first column ['86', '81', '80',...]
                if (values[0] == seriesName) {
                    values = values.slice(1);
                    for (let j = 0; j< values.length; j++) {
                    data.push([categories[j], Number(values[j])]); // convert string to number using Number()
                    }
                    console.log(data);
                    return data;
                }
            }
        };

        // Create the chart
        var chart = Highcharts.chart('container', {
            colors: colors,
            chart: {
                type: 'bar',
                height: 260,// Adjust the height of the chart
                events: {
                    load: function() {
                        var chart = this;
                        var isMobile = chart.chartWidth < 500; // Define the width for mobile devices
        
                        if (isMobile) {
                            // Custom configuration for mobile devices
                            chart.update({
                                series: {
                                    dataLabels: {
                                        style: {
                                            fontSize: '20px' // Increase the font size for mobile devices
                                        }
                                    }
                                }
                            })
                        

                }
            }
        }
                /* marginLeft: 50 */
                /*events: {
                    load: function () {
                        var chart = this;
                        chart.series[0].points.forEach(function (point) {
                            point.graphic.on('mouseover', function () {
                                point.dataLabel.attr({
                                    text: "  " + point.y + "%"
                                });
                            });
                            point.graphic.on('mouseout', function () {
                                //console.log(point);
                                point.dataLabel.attr({
                            
                                    text: point.options.name
                                });
                            });
                        });
                    }
                }*/

        
            },
            credits: {
                enabled: false // Disable Highcharts credits
            },
            plotOptions: {
                bar: {
                    pointWidth: 30 // Adjust the bar height here
                },
                series: {
                    colorByPoint: true,
                    dataLabels: {
                        enabled: true,
                        inside: true,
                        align: 'right',
                        padding: 10,
                        color: '#FFFFFF',
                        style: {
                            textOutline: 'none',
                            fontSize: '13px',
                            fontFamily: 'KievitWeb',
                            fontWeight: 'bold',
                        },
                        formatter: function() {
                            return this.y + '%';
                        }
                        /*formatter: function () {
                            return this.key;
                        }*/
                    },
                }
            },
            title: {
              // text: 'Agreement by Region and Category',
              // align: 'left'
              text: ''
            },
            tooltip: {
                enabled: false
            },
            xAxis: {
                type: 'category',
                lineWidth: 0,
        
                labels: {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '13px',
                        align: 'left'
                    },
                    /*formatter: function () {
                        var rank = this.pos + 1; // Get the rank of the category
                        return rank; // Display the rank 
                    },*/
                    /* animate: true*/
                }
            },
            yAxis: {
                visible: false,
                /* gridLineWidth: 0,
                    labels: {
                        enabled: false
                    },*/
                max: 100
            },
            series: [{
                //data: getCategoryData(employee),
                data: getSeriesData(defaultSeries),
                dataSorting: {
                    enabled: true,
                    sortKey: 'y'
                }
            }],
            legend: {
                enabled: false // Hide the legend
            }
        });

        // Add the dropdown menu
        var select = document.createElement('select');
        var htmlText = '';
        series.forEach(item => {
            htmlText += `<option value="${item}">${item}</option>`;
        });
        select.innerHTML = htmlText; //'<option value="Employee">Employee</option><option value="resident">Resident</option><option value="visitor">Visitor</option>';
        document.getElementById('dropdown-container').appendChild(select);
            
            
        // Event listener for dropdown menu
        select.addEventListener('change', function() {
        var selectedValue = this.value;
            chart.series[0].setData(
                getSeriesData(selectedValue)
            )
        });
        
        // Set the default selected option 
        select.value = defaultSeries;
    },
    error: function (e, t) {  
        console.error(e, t);  
    }, 

    responsive: {
        rules: [{
            condition: {
                maxWidth: '500px' // Set the maximum width for mobile devices
            },
            chartOptions: {
                xAxis: {
                    labels: {
                        rotation: -45 // Rotate the x-axis labels for better visibility
                    }
                }
            }
        }]
    }
});







 


