// src/components/base/App.js

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Layout
import Layout from './Layout';
import FullScreenLayout from './FullScreenLayout';
// Index
const IntroPage = loadable(() => import('components/page/IntroPage'));
// Component
const ComponentChartsPage= loadable(() => import('components/page/ComponentChartsPage'));
// Layering
const LayeringMapPage= loadable(() => import('components/page/LayeringMapPage'));
const LayeringHeatMapPage= loadable(() => import('components/page/LayeringHeatMapPage'));
// Not found
const NotFoundPage= loadable(() => import('components/page/NotFoundPage'));

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
                                    <Route exact path='/' component={IntroPage} />
                                    {/* Component */}
                                    <Route path='/components/chart' component={ComponentChartsPage} />
                                    {/* Layering */}
                                    <Route path="/layering/map" component={LayeringMapPage} />
                                    <Route path="/layering/heatmap" component={LayeringHeatMapPage} />
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
