import $ from 'jquery';
import React, { Component } from 'react';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import Report from './Report';

class WeeklyReport extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loadingReport: false,
            errorMessage: "",
            activities: [],
            reportGenerated: false
        }

        this.activitiesApi = ActivitiesApiConfig.activitiesApi;
    }

    submitSearch(startDate, endDate) {
        this.setState({ loadingReport: true });
        let submitEndDate = new Date(endDate);
        submitEndDate.setDate(endDate.getDate() + 1);
        this.activitiesApi.fetchActivitiesByDates(startDate, submitEndDate, null, null, "WeekOf").then(r => {
            this.setState({ loadingReport: false, activities: r, reportGenerated: true });
            $(".report-toggle").click();
        }, e =>
            this.setState({ loadingReport: false, errorMessage: `Error while trying to fetch Activities. ${e}`, reportGenerated: true })
        );
    }

    render() {
        return (
            <Report
                pageHeader="Weekly Activity Report"
                searchCardHeader="Weekly Report Search"
                submitSearch={(startDate, endDate) => this.submitSearch(startDate, endDate)}
                loadingReport={this.state.loadingReport}
                activities={this.state.activities}
                reportGenerated={this.state.reportGenerated}
            />
        );
    }
}

export default WeeklyReport;