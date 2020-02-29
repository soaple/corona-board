// src/components/page/ComponentChartsPage.js

import React from 'react'
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { Sticker } from '@stickyboard/core';
import { LineChart, BarChart, StackedBarChart, ComposedChart,
    PieChart, RadarChart, AreaChart,
    ScatterChart, Treemap
} from '@stickyboard/recharts';

import ApiManager from 'network/ApiManager';
import StatusCode from 'network/StatusCode';

import PageBaseContainer from 'redux/containers/PageBaseContainer';

const styles = theme => ({
    root: {
    },
});

const initialLayout = {
    lg: [
        { i: "SelectMenu", x: 0, y: 0, w: 12, h: 1 },
        { i: "LineChart", x: 0, y: 1, w: 4, h: 6 },
        { i: "BarChart", x: 4, y: 7, w: 4, h: 6 },
        { i: "StackedBarChart", x: 4, y: 1, w: 4, h: 6 },
        { i: "ComposedChart", x: 8, y: 1, w: 4, h: 6 }
    ],
    md: [
        { i: "SelectMenu", x: 0, y: 0, w: 12, h: 1 },
        { i: "LineChart", x: 0, y: 0, w: 4, h: 6 },
        { i: "BarChart", x: 0, y: 6, w: 4, h: 6 },
        { i: "StackedBarChart", x: 4, y: 0, w: 4, h: 6 },
        { i: "ComposedChart", x: 8, y: 0, w: 4, h: 6 }
    ],
    sm: [
        { i: "SelectMenu", x: 0, y: 0, w: 12, h: 1 },
        { i: "LineChart", x: 0, y: 0, w: 4, h: 6 },
        { i: "BarChart", x: 0, y: 18, w: 4, h: 6 },
        { i: "StackedBarChart", x: 4, y: 0, w: 4, h: 6 },
        { i: "ComposedChart", x: 4, y: 6, w: 4, h: 6 }
    ],
    xs: [
        { i: "SelectMenu", x: 0, y: 0, w: 12, h: 1 },
        { i: "LineChart", x: 0, y: 0, w: 6, h: 6 },
        { i: "BarChart", x: 0, y: 12, w: 6, h: 6 },
        { i: "StackedBarChart", x: 0, y: 6, w: 6, h: 6 },
        { i: "ComposedChart", x: 0, y: 18, w: 6, h: 6 }
    ],
    xxs: [
        { i: "SelectMenu", x: 0, y: 0, w: 12, h: 1 },
        { i: "LineChart", x: 0, y: 0, w: 4, h: 6 },
        { i: "BarChart", x: 0, y: 18, w: 4, h: 6 },
        { i: "StackedBarChart", x: 0, y: 6, w: 4, h: 6 },
        { i: "ComposedChart", x: 0, y: 12, w: 4, h: 6 }
    ]
};

const initialBlocks = [{"i": "SelectMenu"},{"i":"LineChart"},{"i":"BarChart"},{"i":"StackedBarChart"},{"i":"ComposedChart"}];

class ComponentChartsPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            countries: [],
            selectedCountryId: 0,
            // Data
            brief: null,
            latest: null,
            timeseries: null,
        }
    }

    componentDidMount() {
        ApiManager.Corona.readBrief(this.readBriefCallback);
        ApiManager.Corona.readLatest(this.readLatestCallback);
        ApiManager.Corona.readTimeseries(this.readTimeseriesCallback);
    }

    onSelectCountry = (event) => {
        this.setState({
            selectedCountryId: event.target.value,
        });
    }

    readBriefCallback = (statusCode, response) => {
        switch (statusCode) {
        case StatusCode.OK:
            this.setState({
                brief: response,
            });
            break;
        default:
            alert(response.msg);
            break;
        }
    }

    readLatestCallback = (statusCode, response) => {
        switch (statusCode) {
        case StatusCode.OK:
            this.setState({
                latest: response,
            });
            break;
        default:
            alert(response.msg);
            break;
        }
    }

    readTimeseriesCallback = (statusCode, response) => {
        switch (statusCode) {
        case StatusCode.OK:
            let countries = [];
            let convertedTimeseries = [];

            response.forEach((data) => {
                // Extract country region list
                let name = data.countryregion;
                if (data.provincestate !== '') {
                    name += ` (${data.provincestate})`;
                }
                countries.push({
                    id: countries.length,
                    name: name,
                });

                // Extract timeseries data for each country region
                const timeseriesData = data.timeseries;
                const convertedData = Object.keys(timeseriesData).map((key) => {
                    return {
                        ...timeseriesData[key],
                        date: key,
                    };
                });
                convertedTimeseries.push(convertedData);
            });

            this.setState({
                countries: countries,
                timeseries: convertedTimeseries,
            });
            break;
        default:
            alert(response.msg);
            break;
        }
    }

    generateBlock = (block) => {
        const {
            countries,
            selectedCountryId,
            brief,
            latest,
            timeseries,
        } = this.state;
        const { theme } = this.props;
        let colors = theme.colors.colorArray;

        const targetTimeseriesData = timeseries ? timeseries[selectedCountryId] : [];

        switch (block.i) {
        case 'SelectMenu':
            return (
                <Sticker key={block.i}>
                    <FormControl style={{ minWidth: 200 }}>
                        <InputLabel>Country & Region</InputLabel>
                        <Select
                            value={selectedCountryId}
                            onChange={this.onSelectCountry}>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {countries.map((country) => {
                                return (
                                    <MenuItem
                                        key={country.id}
                                        value={country.id}>
                                        {country.name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Sticker>
            )
        case 'LineChart':
            return (
                <Sticker key={block.i}>
                    <LineChart
                        data={targetTimeseriesData}
                        xAxisDataKey={'date'}
                        lineType={'linear'}
                        lineDataKey={'confirmed'}
                        lineName={'Confirmed'}
                        lineColor={colors[0]} />
                </Sticker>
            )
        case 'BarChart':
            return (
                <Sticker key={block.i}>
                    <BarChart
                        data={targetTimeseriesData}
                        xAxisDataKey={'date'}
                        barDataKey={'confirmed'}
                        barName={'Confirmed'}
                        barColor={colors[1]} />
                </Sticker>
            )
        case 'StackedBarChart':
            return (
                <Sticker key={block.i}>
                    <StackedBarChart
                        data={targetTimeseriesData}
                        xAxisDataKey={'date'}
                        barDataArray={[
                            {
                                key: 'confirmed',
                                name: 'Confirmed',
                                color: colors[0],
                            }, {
                                key: 'recovered',
                                name: 'Recovered',
                                color: colors[1],
                            }
                        ]} />
                </Sticker>
            )
        case 'ComposedChart':
            return (
                <Sticker key={block.i}>
                    <ComposedChart
                        data={targetTimeseriesData}
                        xAxisDataKey={'date'}
                        barDataKey={'confirmed'}
                        barName={'Confirmed'}
                        barColor={colors[2]}
                        lineType={'linear'}
                        lineDataKey={'recovered'}
                        lineName={'Recovered'}
                        lineColor={colors[3]} />
                </Sticker>
            )
        }
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <PageBaseContainer
                generateBlock={this.generateBlock}
                initialLayout={initialLayout}
                initialBlocks={initialBlocks} />
        )
    }
}

ComponentChartsPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ComponentChartsPage);
