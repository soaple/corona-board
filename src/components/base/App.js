// src/components/base/App.js

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Layout
import Layout from './Layout';
import FullScreenLayout from './FullScreenLayout';
// Statistics
const DashboardPage = loadable(() => import('components/page/DashboardPage'));
const RiskRankingPage = loadable(() => import('components/page/RiskRankingPage'))
// Not found
const NotFoundPage = loadable(() => import('components/page/NotFoundPage'));

// Manager
import LocalStorageManager from 'manager/LocalStorageManager';
// Theme
import StickyBoardThemes from 'theme/StickyBoardThemes';
// Constants
import LocalStorageConst from 'constants/LocalStorageConst';

const themeKeys = Object.keys(StickyBoardThemes);

class App extends React.Component {
    constructor(props) {
        super(props);

        const initialThemeKey = LocalStorageManager.getItem(
            LocalStorageConst.KEY.THEME_KEY,
            themeKeys[0]);
        const initialTheme = StickyBoardThemes[initialThemeKey] || StickyBoardThemes[themeKeys[0]];

        this.state = {
            selectedThemeKey: initialThemeKey,
            muiTheme: createMuiTheme(initialTheme),
        }
    }

    onThemeChange = (themeKey) => {
        const selectedTheme = StickyBoardThemes[themeKey];

        this.setState({
            selectedThemeKey: themeKey,
            muiTheme: createMuiTheme(selectedTheme)
        }, () => {
            LocalStorageManager.setItem(
                LocalStorageConst.KEY.THEME_KEY,
                themeKey);
        });
    }

    render() {
        const {
            selectedThemeKey,
            muiTheme,
        } = this.state;

        return (
            <MuiThemeProvider theme={muiTheme}>
                <Router>
                    <Switch>
                        {/* Signing pages (FullScreenLayout) */}
                        {false && <Route path={['/signin', '/signup']}>
                            <FullScreenLayout>
                                <Switch>
                                </Switch>
                            </FullScreenLayout>
                        </Route>}

                        {/* other pages (Layout) */}
                        <Route path='/'>
                            <Layout
                                themeKeys={themeKeys}
                                selectedThemeKey={selectedThemeKey}
                                onThemeChange={this.onThemeChange}>
                                <Switch>
                                    <Route exact path='/' component={() => { return <Redirect to='/statistics/dashboard' /> }} />
                                    {/* Statistics */}
                                    <Route path='/statistics/dashboard' component={DashboardPage} />
                                    <Route path='/statistics/risk_ranking' component={RiskRankingPage} />
                                    {/* Not found */}
                                    <Route path='*' component={NotFoundPage} />
                                </Switch>
                            </Layout>
                        </Route>
                    </Switch>
                </Router>
            </MuiThemeProvider>
        )
    }
}

export default App;
