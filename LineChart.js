import React, {Component} from 'react';
import {Dimensions, LayoutAnimation, StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
//If you have not Expo import https://github.com/react-native-community/react-native-svg
import Svg, {
    Circle,
    G,
    Line,
    Path,
    Polygon,
    Text
} from 'react-native-svg';

export default class LineChart extends Component {
    props : {
        values: Array < number >,
        fillColor: string,
        strokeColor: string,
        strokeWidth: number,
        margin: number
    };

    constructor(props) {
        super(props);
        const {
            width,
            height,
            chart
        } = this.props;
        this.state = {
            minValue: 0,
            maxValue: 0,
            variation: 0,
            margin: chart.options.margin,
            labelWidth: chart.options.labelWidth,
            stepX: 0,
            stepY: 0,
            width: width,
            height: height,
            values: chart.values,
            colors: chart.colors,
            length: chart.axis.length,
            selected: chart.selected,
            axis: chart.axis,
            showAxis: chart.showAxis,
            horizontalLines: []
        };

        this.buildChart();
    }

    componentWillUpdate() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    onPress = (e) =>   {
      const {stepX, margin} = this.state;
      let x = e.nativeEvent.locationX - margin.left;
      let result = Math.round(x/stepX);
      if(!(result>=0))
        result = null;
      this.props.onPressItem(result);
    }

    noPress = (e) =>   {
      result = null;
      this.props.onPressItem(result);
    }

    buildChart() {
        const {values, width, height, margin, length} = this.state;
        let minValue = -1;
        let maxValue = 0;
        let horizontalLines = [];
        let variation = 0;

        values.map(elem => {
            minElem = Math.min(...elem);
            if (minElem < minValue)
                minValue = minElem;
            }
        )

        values.map(elem => {
            maxElem = Math.max(...elem);
            if (maxElem > maxValue)
                maxValue = maxElem;
            }
        )

        variation = (minValue * -1) + maxValue;

        horizontalLines.push(minValue);
        horizontalLines.push(maxValue);
        if (minValue < -1)
            horizontalLines.push(0);

        // step between each value point on horizontal (x) axis
        let stepX = (width - (margin.left + margin.right)) / (length - 1 || 1);
        // step between each value point on vertical (y) axis
        let stepY = (height - (margin.top + margin.bottom)) / variation;

        this.state.minValue = minValue;
        this.state.maxValue = maxValue;
        this.state.variation = variation;
        this.state.stepX = stepX;
        this.state.stepY = stepY;
        this.state.horizontalLines = horizontalLines;
    }

    buildPath = (values) : Path => {
        const {
            width,
            height,
            minValue,
            maxValue,
            margin,
            variation,
            stepX,
            stepY
        } = this.state;

        let firstPoint : boolean = true;
        let start = minValue * stepY;
        let path = "";
        values.forEach((number, index) => {
            let x = (index * stepX) + margin.left;
            let y = -(((number - minValue) * stepY) + margin.bottom);
            if (firstPoint) {
                path += "M" + margin.left + " " + y;
            } else {
                path += " L" + x + " " + y;
            }
            firstPoint = false;
        });

        return path;
    };

    buildPolygon = (values) : Path => {
        const {
            width,
            height,
            minValue,
            maxValue,
            margin,
            variation,
            stepX,
            stepY,
            length
        } = this.state;

        let firstPoint : boolean = true;
        let start = -(((minValue * -1) * stepY) + margin.bottom);
        let path = margin.left + "," + start;
        values.forEach((number, index) => {
            let x = (index * stepX) + margin.left;
            let y = -(((number - minValue) * stepY) + margin.bottom);
            if (firstPoint) {
                path += " " + margin.left + "," + y;
            } else {
                path += " " + x + "," + y;
            }
            firstPoint = false;
        });

        path += " " + (((length - 1) * stepX) + margin.left) + "," + start;
        path += " " + margin.left + "," + start;

        return path;
    };

    getPosition(itemval, itemindex) {
        const {
            width,
            height,
            minValue,
            maxValue,
            margin,
            variation,
            stepX,
            stepY
        } = this.state;
        let x = (itemindex * stepX) + margin.left
        let y = -(((itemval - minValue) * stepY) + margin.bottom);
        return {x: x, y: y};
    }
    render() {
        const {fillColor, strokeColor, axisColor,chart} = this.props;

        const {
            width,
            height,
            minValue,
            maxValue,
            variation,
            selected,
            values,
            stepX,
            stepY,
            length,
            axis,
            margin,
            labelWidth,
            horizontalLines,
            colors,
            showAxis
        } = this.state;

        const lines = values.map((item, i) => {
            let strokeWidth = 1;
            let stroke = colors.strokeColor[i];
            fill = colors.fillColor[i];
            let line = null;
            if (colors.fillColor[i] != null) {
                strokeWidth = 0;
                line = (<Polygon key={"polygon_" + i} points={this.buildPolygon(item)} fill={fill} />)
            }

            let path = (<Path key={"path_" + i} d={this.buildPath(item)} fill="none" stroke={stroke} strokeWidth={strokeWidth}/>)
            return (
                <G key={"lines_" + i}>
                    {path}
                    {line}
                </G>
            );
        });
        const circles = values.map((item, i) => {
            return item.map((itemval, itemindex) => {
                if(chart.selected != null && chart.selected == itemindex){
                  let position = this.getPosition(itemval, itemindex);
                  let x = position.x;
                  let y = position.y;
                  let key = "circle_" + i + "_" + itemindex;
                  return (<Circle key={"circle_" + i + "_" + itemindex} cx={position.x} cy={position.y} r="4" stroke="white" strokeWidth="1" fill={colors.strokeColor[i]}/>);
                }
                return (<Circle key={"circle_" + i + "_" + itemindex} />);
            });
        });

        const axisX = axis.map((item, i) => {
          let strokeColor = colors.axisColor;
            if(chart.showAxis || (chart.selected != null && chart.selected == i)  || i == 0){
              if(chart.selected == i){
                strokeColor = "gray";
              }

              return (<Line key={"axisx_" + i} x1={(i * stepX) + margin.left} y1={-(margin.bottom)} x2={(i * stepX) + margin.left} y2={-(stepY * variation) - (margin.bottom + margin.top)} stroke={strokeColor} strokeWidth={0.5} />)

            }
            return (<Line key={"axisx_" + i} ></Line>);
        });
        const axisH = horizontalLines.map((item, i) => {
            return (<Line key={"axish_" + i} x1={margin.left} y1={-(((item - minValue) * stepY) + margin.bottom)} x2={(length * stepX) + margin.left} y2={-(((item - minValue) * stepY) + margin.bottom)} stroke={colors.axisColor} strokeWidth="0.5"/>)
        });
        const axisHLabel = horizontalLines.map((item, i) => {
            return (
                <Text key={"axislabel_" + i} fill={colors.axisTextColor} stroke="none" fontSize="10" fontWeight="normal" x={margin.left - 7} y={-(((item - minValue) * stepY) + margin.bottom + 7)} textAnchor="end">{item}€</Text>
            )
        });
        const axisXLabel = axis.map((item, i) => {
              let width = (length * stepX) + margin.left;
              let each = Math.round(labelWidth/stepX);
              if(i != length && (i == 0 || (i%each == 0)))
            return (
                <Text key={"axislabel_" + i} fill={colors.axisTextColor} stroke="none" fontSize="10" fontWeight="normal" x={(i * stepX) + margin.left} y={-(margin.bottom - 3)} textAnchor="middle">{item}</Text>
            )
        });

        return (
            <View style={styles.container} onLayout={this.onLayout}>
                <TouchableWithoutFeedback onPressIn={(e) => this.onPress(e)} onPressOut={() => this.noPress()}>
                    <Svg width={width} height={height}>
                        <G x={0} y={height}>
                            {axisH}
                            {axisHLabel}
                            {axisX}
                            {axisXLabel}
                            {lines}
                            {circles}
                        </G>
                    </Svg>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // align at the bottom of the container so when animated it rises to the top
        justifyContent: 'flex-start'
    }
});
