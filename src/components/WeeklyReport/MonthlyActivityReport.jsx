import $ from 'jquery';
import React, { Component } from 'react';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import DateUtilities from '../../utilities/DateUtilities';
import Report from './Report';

class MonthlyActivityReport extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loadingReport: false,
            errorMessage: "",
            activities: []
        }

        this.activitiesApi = ActivitiesApiConfig.activitiesApi;
    }

    submitSearch(startDate, endDate) {
        this.setState({ loadingReport: true });
        let submitEndDate = DateUtilities.getDate(endDate).add(1, 'day');
        this.activitiesApi.fetchMarEntriesByDates(startDate, submitEndDate, null, "WeekOf").then(r => {
            this.setState({ loadingReport: false, activities: r, reportGenerated: true });
            $(".report-toggle").click();
        }, e =>
            this.setState({ loadingReport: false, errorMessage: `Error while trying to fetch MAR Activities. ${e}`, reportGenerated: true })
        );
    }

    render() {
        return (
            <Report
                pageHeader="Monthly Activity Report"
                searchCardHeader="MAR Search"
                submitSearch={(startDate, endDate) => this.submitSearch(startDate, endDate)}
                loadingReport={this.state.loadingReport}
                activities={this.state.activities}
                reportGenerated={this.state.reportGenerated}
            />
        );
    }
}

export default MonthlyActivityReport;