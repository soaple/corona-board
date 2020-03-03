// src/components/page/RiskRankingPage.js

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import { Sticker } from '@stickyboard/core';
import { TableWithPagination } from '@stickyboard/table';

import ApiManager from 'network/ApiManager';
import StatusCode from 'network/StatusCode';

import PageBaseContainer from 'redux/containers/PageBaseContainer';

const styles = (theme) => ({
    root: {},
});

const initialLayout = {
    lg: [
        { i: 'RankingTable', x: 0, y: 0, w: 12, h: 15 },
    ],
    md: [
        { i: 'RankingTable', x: 0, y: 0, w: 12, h: 15 },
    ],
    sm: [
        { i: 'RankingTable', x: 0, y: 0, w: 12, h: 15 },
    ],
    xs: [
        { i: 'RankingTable', x: 0, y: 0, w: 12, h: 15 },
    ],
    xxs: [
        { i: 'RankingTable', x: 0, y: 0, w: 12, h: 15 },
    ],
};

const initialBlocks = [
    { i: 'RankingTable' },
];

class RiskRankingPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // Data
            sortedLatestList: [],
        };
    }

    componentDidMount() {
        ApiManager.Corona.readLatest(this.readLatestCallback);
    }

    readLatestCallback = (statusCode, response) => {
        switch (statusCode) {
            case StatusCode.OK:
                let latest = [];

                // Sort latest by # of confirmed, deaths, recovered
                response.sort((a, b) => {
                    if (a.confirmed !== b.confirmed) {
                        return a.confirmed > b.confirmed ? -1 : 1;
                    } else if (a.deaths !== b.deaths) {
                        return a.deaths > b.deaths ? -1 : 1;
                    } else {
                        return a.recovered < b.recovered ? -1 : 1;
                    }
                });

                response.forEach((data, index) => {
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

                    latest.push({
                        ranking: index + 1,
                        name: name,
                        confirmed: confirmed,
                        deaths: deaths,
                        recovered: recovered,
                        lastUpdate: lastupdate,
                    });
                });

                this.setState({
                    sortedLatestList: latest,
                });
                break;
            default:
                alert(response.msg);
                break;
        }
    };

    generateBlock = (block, data) => {
        const {
            sortedLatestList,
        } = data;
        const { theme } = this.props;

        const colors = theme.colors.colorArray;

        switch (block.i) {
            case 'RankingTable':
                return (
                    <Sticker key={block.i}>
                        <TableWithPagination
                            title={'Risk Ranking (Sorted by # of confirmed)'}
                            data={sortedLatestList}
                            rowsPerPage={10} />
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

RiskRankingPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RiskRankingPage);
