import moment from 'moment';
import React, { Component } from 'react';
import { Row } from 'react-bootstrap';

class WeeklyReportActivity extends Component {

    render() {
        let activity = this.props.activity;
        return (
            <Row>
                <p>
                    <br />
                    <strong>Week of:</strong> {moment(activity.WeekOf).format("DD/MM/YYYY")}<br />
                    <strong>Activity/Purpose:</strong> {activity.Title}<br />
                    <strong>Specific items of interest:</strong> {activity.InterestItems}<br />
                    <strong>Action Items for {activity.Branch}:</strong> {activity.ActionItems}<br />
                    <strong>OPR:</strong> {activity.TextOPRs}<br />
                </p>
            </Row>
        );
    }
}

export default WeeklyReportActivity;