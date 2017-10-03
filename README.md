# react-native-line-chart

![Screenshot](https://raw.githubusercontent.com/julienkermarec/react-native-line-chart/master/screenshots/full.png)

I use SVG library (react-native-svg) but with Expo, this is pre-installed.
https://github.com/react-native-community/react-native-svg

## Demo

https://expo.io/@julienkermarec/react-native-line-chart

![Screenshot](https://raw.githubusercontent.com/julienkermarec/react-native-line-chart/master/screenshots/expo.png)

## Tutoriel

https://blog.julienkermarec.com/line-chart-en-react-native/

## Example

You can have POSITIVE OR/AND NEGATIVE values
You can have ONE values, or INFINITE values, automatically responsive
You can CLICK on a value to see details

## Usage
```javascript
import { View, Text, ScrollView,StyleSheet, Dimensions } from 'react-native'
import LineChart from '../LineChart';


const colors = {
  chartBlue:'#4286F5',
  chartRed:'#DC4437',
  chartYellow:'#F5B400',
  chartBlueOpacity:'rgba(66, 134, 245,0.3)',
  chartRedOpacity:null,//'rgba(220, 68, 55, 0)',
  chartYellowOpacity:null,//'rgba(245, 180, 0, 0)',
}


class ScreenBarChart extends Component {

  constructor(props) {
    super(props);

    var chart = {
      values: [
        [28,48,40,19,96,27,100],
        [65,59,90,81,56,55,40],
        [-20, -42, -39, -46, -30, -10, -2]
      ],
      colors: {
        labelsColor : [colors.chartBlue, colors.chartRed,colors.chartYellow],
        fillColor : [colors.chartBlueOpacity, colors.chartRedOpacity,colors.chartYellowOpacity],
        strokeColor : [colors.chartBlue, colors.chartRed,colors.chartYellow],
        axisColor : 'rgba(216, 216, 216, 1)',
        axisTextColor: 'gray',
      },
      options: {
        strokeWidth: 1,
        margin: {
            left: 40,
            right: 10,
            top: 10,
            bottom: 20
        },
        labelWidth: 50,
      },
      showAxis: false,
      labels: ['LABEL A', 'LABEL B', 'LABEL C'],
      selected: 3,
    	 axis: ['10/09', '11/09', '12/09', '13/09', '14/09', '15/09','16/09'],
    }

    this.state = {
      chart : chart,
      count: count,
    }

    this.selectChart = this.selectChart.bind(this);
  }

  selectChart(index) {
    let chart = this.state.chart;
    chart["selected"] = index;
    console.log("selectChart : " + index);
    this.setState({chart:chart});
  }

  render(){
    <LineChart onPressItem={this.selectChart} height={200} width={this.getChartWidth()} chart={chart}/>
  }
}

```

## TODO
- [X] V1 line chart
- [X] Show hide axis
- [X] Hide axis label if to small
- [X] Add horizontal axis (min/max)
- [ ] Add line char to npm
- [ ] Horizontal scroll for infinite line chart

![Screenshot](https://raw.githubusercontent.com/julienkermarec/react-native-line-chart/master/screenshots/phone.png)

## Info/Support

If you need support, or business inquiry contact-me :

@JulienKermarec - contact@julienkermarec.com
