// src/components/page/DashboardPage.js

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { Sticker } from '@stickyboard/core';
import {
    LineChart,
    MultiLineChart,
    BarChart,
    StackedBarChart,
    ComposedChart,
    PieChart,
    RadarChart,
    AreaChart,
    ScatterChart,
    Treemap,
} from '@stickyboard/recharts';
import { OpenLayers } from '@stickyboard/openlayers';

import ApiManager from 'network/ApiManager';
import StatusCode from 'network/StatusCode';

import PageBaseContainer from 'redux/containers/PageBaseContainer';

const styles = (theme) => ({
    root: {},
});

const initialLayout = {
    lg: [
        { i: 'SelectMenu', x: 0, y: 0, w: 12, h: 1 },
        { i: 'LineChart', x: 6, y: 1, w: 6, h: 8 },
        { i: 'BarChart', x: 0, y: 1, w: 6, h: 16 },
        { i: 'StackedBarChart', x: 9, y: 9, w: 3, h: 8 },
        { i: 'ComposedChart', x: 6, y: 9, w: 3, h: 8 },
    ],
    md: [
        { i: 'SelectMenu', x: 0, y: 0, w: 12, h: 1 },
        { i: 'LineChart', x: 0, y: 0, w: 4, h: 6 },
        { i: 'BarChart', x: 0, y: 6, w: 4, h: 6 },
        { i: 'StackedBarChart', x: 4, y: 0, w: 4, h: 6 },
        { i: 'ComposedChart', x: 8, y: 0, w: 4, h: 6 },
    ],
    sm: [
        { i: 'SelectMenu', x: 0, y: 0, w: 12, h: 1 },
        { i: 'LineChart', x: 0, y: 0, w: 4, h: 6 },
        { i: 'BarChart', x: 0, y: 18, w: 4, h: 6 },
        { i: 'StackedBarChart', x: 4, y: 0, w: 4, h: 6 },
        { i: 'ComposedChart', x: 4, y: 6, w: 4, h: 6 },
    ],
    xs: [
        { i: 'SelectMenu', x: 0, y: 0, w: 12, h: 1 },
        { i: 'LineChart', x: 0, y: 0, w: 6, h: 6 },
        { i: 'BarChart', x: 0, y: 12, w: 6, h: 6 },
        { i: 'StackedBarChart', x: 0, y: 6, w: 6, h: 6 },
        { i: 'ComposedChart', x: 0, y: 18, w: 6, h: 6 },
    ],
    xxs: [
        { i: 'SelectMenu', x: 0, y: 0, w: 12, h: 1 },
        { i: 'LineChart', x: 0, y: 0, w: 4, h: 6 },
        { i: 'BarChart', x: 0, y: 18, w: 4, h: 6 },
        { i: 'StackedBarChart', x: 0, y: 6, w: 4, h: 6 },
        { i: 'ComposedChart', x: 0, y: 12, w: 4, h: 6 },
    ],
};

const initialBlocks = [
    { i: 'SelectMenu' },
    { i: 'LineChart' },
    { i: 'BarChart' },
    { i: 'StackedBarChart' },
    { i: 'ComposedChart' },
];

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            countryDict: {},
            selectedCountryName: '',
            // Data
            brief: null,
            latest: null,
            timeseries: null,
        };
    }

    componentDidMount() {
        ApiManager.Corona.readBrief(this.readBriefCallback);
        ApiManager.Corona.readLatest(this.readLatestCallback);
        ApiManager.Corona.readTimeseries(this.readTimeseriesCallback);
    }

    onSelectCountry = (event) => {
        this.setState({
            selectedCountryName: event.target.value,
        });
    };

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
    };

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
    };

    readTimeseriesCallback = (statusCode, response) => {
        switch (statusCode) {
            case StatusCode.OK:
                let countryDict = {};

                // Sort country by name
                response.sort((a, b) => {
                    return `${a.countryregion}${a.provincestate}` <
                        `${b.countryregion}${b.provincestate}`
                        ? -1
                        : 1;
                });

                response.forEach((data) => {
                    const {
                        countryregion,
                        provincestate,
                        location,
                        timeseries,
                        lastupdate,
                    } = data;

                    // Extract country region list
                    let name = countryregion;
                    if (provincestate !== '') {
                        name += ` (${provincestate})`;
                    }

                    // Extract timeseries data for each country region
                    const timeseriesData = timeseries;
                    const convertedTimeseries = Object.keys(timeseriesData).map(
                        (key) => {
                            return {
                                ...timeseriesData[key],
                                date: key,
                            };
                        }
                    );

                    countryDict[name] = {
                        name: name,
                        location: location,
                        lastUpdate: lastupdate,
                        timeseries: convertedTimeseries,
                    };
                });

                this.setState({
                    countryDict: countryDict,
                });
                break;
            default:
                alert(response.msg);
                break;
        }
    };

    generateBlock = (block) => {
        const {
            countryDict,
            selectedCountryName,
            brief,
            latest,
            timeseries,
        } = this.state;
        const { theme } = this.props;

        let colors = theme.colors.colorArray;

        const selectedCountry = countryDict[selectedCountryName];
        const targetTimeseriesData = selectedCountry
            ? selectedCountry.timeseries
            : [];

        console.log('selectedCountry', selectedCountry)

        switch (block.i) {
            case 'SelectMenu':
                return (
                    <Sticker key={block.i}>
                        <FormControl style={{ minWidth: 200 }}>
                            <InputLabel>Country & Region</InputLabel>
                            <Select
                                value={selectedCountryName}
                                onChange={this.onSelectCountry}>
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {Object.values(countryDict).map((country) => {
                                    return (
                                        <MenuItem
                                            key={country.name}
                                            value={country.name}>
                                            {country.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Sticker>
                );
            case 'LineChart':
                return (
                    <Sticker key={block.i}>
                        <MultiLineChart
                            data={targetTimeseriesData}
                            xAxisDataKey={'date'}
                            lineDataArray={[
                                {
                                    key: 'confirmed',
                                    name: 'Confirmed',
                                    color: colors[0],
                                },
                                {
                                    key: 'deaths',
                                    name: 'Deaths',
                                    color: colors[1],
                                },
                                {
                                    key: 'recovered',
                                    name: 'Recovered',
                                    color: colors[2],
                                },
                            ]}
                        />
                    </Sticker>
                );
            case 'BarChart':
                return (
                    <Sticker key={block.i}>
                        <OpenLayers
                            isHeatmapMode={true}
                            zoom={3}
                            minZoom={2}
                            maxZoom={17}
                            longitude={
                                selectedCountry
                                    ? selectedCountry.location.lng
                                    : 127.024792
                            }
                            latitude={
                                selectedCountry
                                    ? selectedCountry.location.lat
                                    : 37.504296
                            }
                        />
                    </Sticker>
                );
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
                                },
                                {
                                    key: 'recovered',
                                    name: 'Recovered',
                                    color: colors[1],
                                },
                            ]}
                        />
                    </Sticker>
                );
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
                            lineColor={colors[3]}
                        />
                    </Sticker>
                );
        }
    };

    render() {
        const { classes, theme } = this.props;

        return (
            <PageBaseContainer
                generateBlock={this.generateBlock}
                initialLayout={initialLayout}
                initialBlocks={initialBlocks}
            />
        );
    }
}

DashboardPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(DashboardPage);
