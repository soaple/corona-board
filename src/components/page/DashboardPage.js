// src/components/page/DashboardPage.js

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';

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
import { NumberWidget } from '@stickyboard/number';
import { HeatMap } from '@stickyboard/openlayers';

import ApiManager from 'network/ApiManager';
import StatusCode from 'network/StatusCode';

import PageBaseContainer from 'redux/containers/PageBaseContainer';

const styles = (theme) => ({
    root: {},
});

const initialLayout = {
    lg: [
        { i: 'TitleWorld', x: 0, y: 0, w: 12, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 1, w: 3, h: 2 },
        { i: 'BriefRecovered', x: 3, y: 1, w: 3, h: 2 },
        { i: 'BriefDeaths', x: 6, y: 1, w: 3, h: 2 },
        { i: 'BriefFatalityRate', x: 9, y: 1, w: 3, h: 2 },
        { i: 'SelectMenu', x: 0, y: 3, w: 12, h: 1 },
        { i: 'CountryConfirmed', x: 0, y: 4, w: 3, h: 2 },
        { i: 'CountryRecovered', x: 3, y: 4, w: 3, h: 2 },
        { i: 'CountryDeaths', x: 6, y: 4, w: 3, h: 2 },
        { i: 'CountryFatalityRate', x: 9, y: 4, w: 3, h: 2 },
        { i: 'LineChart', x: 6, y: 6, w: 6, h: 6 },
        { i: 'HeatMap', x: 0, y: 6, w: 6, h: 11 },
        { i: 'ComposedChart', x: 6, y: 12, w: 6, h: 5 },
    ],
    md: [
        { i: 'TitleWorld', x: 0, y: 0, w: 12, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 1, w: 3, h: 2 },
        { i: 'BriefRecovered', x: 3, y: 1, w: 3, h: 2 },
        { i: 'BriefDeaths', x: 6, y: 1, w: 3, h: 2 },
        { i: 'BriefFatalityRate', x: 9, y: 1, w: 3, h: 2 },
        { i: 'SelectMenu', x: 0, y: 3, w: 12, h: 1 },
        { i: 'CountryConfirmed', x: 0, y: 4, w: 3, h: 2 },
        { i: 'CountryRecovered', x: 3, y: 4, w: 3, h: 2 },
        { i: 'CountryDeaths', x: 6, y: 4, w: 3, h: 2 },
        { i: 'CountryFatalityRate', x: 9, y: 4, w: 3, h: 2 },
        { i: 'LineChart', x: 6, y: 6, w: 6, h: 6 },
        { i: 'HeatMap', x: 0, y: 6, w: 6, h: 12 },
        { i: 'ComposedChart', x: 6, y: 12, w: 6, h: 6 },
    ],
    sm: [
        { i: 'TitleWorld', x: 0, y: 0, w: 8, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 2, w: 4, h: 2 },
        { i: 'BriefRecovered', x: 4, y: 2, w: 4, h: 2 },
        { i: 'BriefDeaths', x: 0, y: 4, w: 4, h: 2 },
        { i: 'BriefFatalityRate', x: 4, y: 4, w: 4, h: 2 },
        { i: 'SelectMenu', x: 0, y: 6, w: 8, h: 1 },
        { i: 'CountryConfirmed', x: 0, y: 7, w: 4, h: 2 },
        { i: 'CountryRecovered', x: 4, y: 7, w: 4, h: 2 },
        { i: 'CountryDeaths', x: 0, y: 9, w: 4, h: 2 },
        { i: 'CountryFatalityRate', x: 4, y: 9, w: 4, h: 2 },
        { i: 'LineChart', x: 0, y: 11, w: 4, h: 6 },
        { i: 'HeatMap', x: 0, y: 17, w: 8, h: 6 },
        { i: 'ComposedChart', x: 4, y: 11, w: 4, h: 6 },
    ],
    xs: [
        { i: 'TitleWorld', x: 0, y: 0, w: 6, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 1, w: 3, h: 2 },
        { i: 'BriefRecovered', x: 3, y: 1, w: 3, h: 2 },
        { i: 'BriefDeaths', x: 0, y: 3, w: 3, h: 2 },
        { i: 'BriefFatalityRate', x: 3, y: 3, w: 3, h: 2 },
        { i: 'SelectMenu', x: 0, y: 5, w: 6, h: 1 },
        { i: 'CountryConfirmed', x: 0, y: 6, w: 3, h: 2 },
        { i: 'CountryRecovered', x: 3, y: 6, w: 3, h: 2 },
        { i: 'CountryDeaths', x: 0, y: 8, w: 3, h: 2 },
        { i: 'CountryFatalityRate', x: 3, y: 8, w: 3, h: 2 },
        { i: 'LineChart', x: 0, y: 10, w: 6, h: 6 },
        { i: 'HeatMap', x: 0, y: 22, w: 6, h: 6 },
        { i: 'ComposedChart', x: 0, y: 16, w: 6, h: 6 },
    ],
    xxs: [
        { i: 'TitleWorld', x: 0, y: 0, w: 4, h: 1 },
        { i: 'BriefConfirmed', x: 0, y: 1, w: 4, h: 2 },
        { i: 'BriefRecovered', x: 0, y: 3, w: 4, h: 2 },
        { i: 'BriefDeaths', x: 0, y: 5, w: 4, h: 2 },
        { i: 'BriefFatalityRate', x: 0, y: 7, w: 4, h: 2 },
        { i: 'SelectMenu', x: 0, y: 9, w: 4, h: 1 },
        { i: 'CountryConfirmed', x: 0, y: 10, w: 4, h: 2 },
        { i: 'CountryRecovered', x: 0, y: 12, w: 4, h: 2 },
        { i: 'CountryDeaths', x: 0, y: 14, w: 4, h: 2 },
        { i: 'CountryFatalityRate', x: 0, y: 16, w: 4, h: 2 },
        { i: 'LineChart', x: 0, y: 18, w: 4, h: 6 },
        { i: 'HeatMap', x: 0, y: 30, w: 4, h: 6 },
        { i: 'ComposedChart', x: 0, y: 24, w: 4, h: 6 },
    ],
};

const initialBlocks = [
    { i: 'TitleWorld' },
    { i: 'BriefConfirmed' },
    { i: 'BriefRecovered' },
    { i: 'BriefDeaths' },
    { i: 'BriefFatalityRate' },
    { i: 'SelectMenu' },
    { i: 'CountryConfirmed' },
    { i: 'CountryRecovered' },
    { i: 'CountryDeaths' },
    { i: 'CountryFatalityRate' },
    { i: 'LineChart' },
    { i: 'HeatMap' },
    { i: 'ComposedChart' },
];

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCountryName: '',
            // Data
            brief: null,
            countryLatestDict: {},
            countryTimeseriesDict: {},
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
                let countryLatestDict = {};

                response.forEach((data) => {
                    const {
                        countryregion,
                        provincestate,
                        location,
                        confirmed,
                        deaths,
                        recovered,
                        lastupdate,
                    } = data;

                    // Extract country region list
                    let name = countryregion;
                    if (provincestate !== '') {
                        name += ` (${provincestate})`;
                    }

                    countryLatestDict[name] = {
                        name: name,
                        location: location,
                        confirmed: confirmed,
                        deaths: deaths,
                        recovered: recovered,
                        lastUpdate: lastupdate,
                    };
                });

                this.setState({
                    countryLatestDict: countryLatestDict,
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
                let countryTimeseriesDict = {};

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

                    countryTimeseriesDict[name] = {
                        name: name,
                        location: location,
                        timeseries: convertedTimeseries,
                        lastUpdate: lastupdate,
                    };
                });

                this.setState({
                    countryTimeseriesDict: countryTimeseriesDict,
                });
                break;
            default:
                alert(response.msg);
                break;
        }
    };

    generateBlock = (block, data) => {
        const {
            selectedCountryName,
            brief,
            countryLatestDict,
            countryTimeseriesDict,
        } = data;
        const { theme } = this.props;

        const colors = theme.colors.colorArray;

        const selectedCountry = countryTimeseriesDict[selectedCountryName];
        const targetTimeseriesData = selectedCountry
            ? selectedCountry.timeseries
            : [];

        const selectedCountryLatest = countryLatestDict[selectedCountryName];

        const pointList = Object.values(countryLatestDict).map(
            (countryLatest) => {
                return {
                    geometry: [
                        countryLatest.location.lng,
                        countryLatest.location.lat,
                    ],
                    weight: countryLatest.confirmed,
                };
            }
        );

        switch (block.i) {
            case 'TitleWorld':
                return (
                    <Sticker key={block.i}>
                        <div style={{ fontSize: 32, fontWeight: 'bold' }}>
                            World Wide
                        </div>
                    </Sticker>
                );
            case 'BriefConfirmed':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon />}
                            backgroundColor={theme.colors.colorArray[0]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'Confirmed'}
                            value={brief ? brief.confirmed : '-'}
                            unit={''}
                        />
                    </Sticker>
                );
            case 'BriefRecovered':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon />}
                            backgroundColor={theme.colors.colorArray[2]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'Recovered'}
                            value={brief ? brief.recovered : '-'}
                            unit={''}
                        />
                    </Sticker>
                );
            case 'BriefDeaths':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon />}
                            backgroundColor={theme.colors.colorArray[1]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'Deaths'}
                            value={brief ? brief.deaths : '-'}
                            unit={''}
                        />
                    </Sticker>
                );
            case 'BriefFatalityRate':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon />}
                            backgroundColor={theme.colors.colorArray[4]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'Fatality rate'}
                            value={
                                brief
                                    ? `${(
                                          (brief.deaths / brief.confirmed) *
                                          100
                                      ).toFixed(2)}`
                                    : '-'
                            }
                            unit={'%'}
                        />
                    </Sticker>
                );
            case 'SelectMenu':
                return (
                    <Sticker key={block.i}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ fontSize: 32, fontWeight: 'bold' }}>
                                Regional
                            </div>

                            <FormControl
                                style={{ minWidth: 200, marginLeft: 32 }}>
                                <InputLabel>Country & Region</InputLabel>
                                <Select
                                    value={selectedCountryName}
                                    onChange={this.onSelectCountry}>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {Object.values(countryTimeseriesDict).map(
                                        (country) => {
                                            return (
                                                <MenuItem
                                                    key={country.name}
                                                    value={country.name}>
                                                    {country.name}
                                                </MenuItem>
                                            );
                                        }
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </Sticker>
                );
            case 'CountryConfirmed':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon />}
                            backgroundColor={theme.colors.colorArray[3]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'Confirmed'}
                            value={
                                selectedCountryLatest
                                    ? selectedCountryLatest.confirmed
                                    : '-'
                            }
                            unit={''}
                        />
                    </Sticker>
                );
            case 'CountryRecovered':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon />}
                            backgroundColor={theme.colors.colorArray[5]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'Recovered'}
                            value={
                                selectedCountryLatest
                                    ? selectedCountryLatest.recovered
                                    : '-'
                            }
                            unit={''}
                        />
                    </Sticker>
                );
            case 'CountryDeaths':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon />}
                            backgroundColor={theme.colors.colorArray[4]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'Deaths'}
                            value={
                                selectedCountryLatest
                                    ? selectedCountryLatest.deaths
                                    : '-'
                            }
                            unit={''}
                        />
                    </Sticker>
                );
            case 'CountryFatalityRate':
                return (
                    <Sticker key={block.i}>
                        <NumberWidget
                            icon={<PersonIcon />}
                            backgroundColor={theme.colors.colorArray[10]}
                            defaultColor={theme.colors.colorLight}
                            valueColor={theme.colors.colorLight}
                            title={'Fatality rate'}
                            value={
                                selectedCountryLatest
                                    ? `${(
                                          (selectedCountryLatest.deaths /
                                              selectedCountryLatest.confirmed) *
                                          100
                                      ).toFixed(2)}`
                                    : '-'
                            }
                            unit={'%'}
                        />
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
                                    key: 'recovered',
                                    name: 'Recovered',
                                    color: colors[2],
                                },
                                {
                                    key: 'deaths',
                                    name: 'Deaths',
                                    color: colors[1],
                                },
                            ]}
                        />
                    </Sticker>
                );
            case 'HeatMap':
                return (
                    <Sticker key={block.i}>
                        <HeatMap
                            zoom={3}
                            minZoom={2}
                            maxZoom={17}
                            blur={30}
                            radius={20}
                            longitude={127.024792}
                            latitude={37.504296}
                            pointList={pointList}
                        />
                    </Sticker>
                );
            case 'ComposedChart':
                return (
                    <Sticker key={block.i}>
                        <ComposedChart
                            data={targetTimeseriesData}
                            xAxisDataKey={'date'}
                            barDataKey={'recovered'}
                            barName={'Recovered'}
                            barColor={colors[2]}
                            lineType={'linear'}
                            lineDataKey={'confirmed'}
                            lineName={'Confirmed'}
                            lineColor={colors[0]}
                        />
                    </Sticker>
                );
        }
    };

    render() {
        return (
            <PageBaseContainer
                data={this.state}
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
