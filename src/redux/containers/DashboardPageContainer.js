// src/components/containers/DashboardPageContainer.js

import { connect } from 'react-redux'

import {
    showMessageSnackbar,
    hideMessageSnackbar,
} from '../actions';

import DashboardPage from 'components/page/DashboardPage';

const mapStateToProps = (state, ownProps) => {
    return {
        selectedCountryName: '',
        // Data
        brief: null,
        countryLatestDict: {},
        countryTimeseriesDict: {},

        open: state.messageSnackbarReducer.open,
        message: state.messageSnackbarReducer.message,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadData: () => {
            dispatch(showMessageSnackbar());
        },
    }
}

const DashboardPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PageBase);

export default DashboardPageContainer;
