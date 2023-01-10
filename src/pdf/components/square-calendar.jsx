import { Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { getWeekdays, getWeekendDays, getWeekNumber } from 'lib/date';
import PdfConfig from 'pdf/config';
import {
	dayPageLink,
	monthOverviewLink,
	weekOverviewLink,
	weekRetrospectiveLink,
	yearOverviewLink,
} from 'pdf/lib/links';

export const HIGHLIGHT_WEEK = 'HIGHLIGHT_WEEK';
export const HIGHLIGHT_DAY = 'HIGHLIGHT_DAY';
export const HIGHLIGHT_NONE = 'HIGHLIGHT_NONE';

class SquareCalendar extends React.Component {
	styles = StyleSheet.create( {
		body: {
			fontSize: 8,
			width: '40%',
			margin: 5,
		},
		week: {
			display: 'flex',
			flexDirection: 'row',
		},
		currentWeek: {
			backgroundColor: this.props.config.colors.accent1,
		},
		currentWeekDay: {
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: this.props.config.colors.accent1,
		},
		day: {
			flexGrow: 1,
			flexShrink: 1,
			width: 20,
			textDecoration: 'none',
			color: 'black',
			fontWeight: 'normal',
			textAlign: 'center',
			// borderWidth: 1,
			// borderStyle: 'solid',
			// borderColor: this.props.config.colors.accent1,
		},
		header: {
			flexDirection: 'row',
		},
		monthArrow: {
			flexBasis: 20,
			flexGrow: 0,
			textAlign: 'center',
			padding: '2 5',
			textDecoration: 'none',
			color: this.props.config.colors.accent1,
			fontSize: 10,
			fontWeight: 'bold',
		},
		monthName: {
			padding: '2 5',
			textDecoration: 'none',
			color: this.props.config.colors.accent1,
			fontSize: 10,
			fontWeight: 'bold',
		},
		pushLeft: {
			marginLeft: 'auto',
		},
		pushRight: {
			marginRight: 'auto',
		},
		currentDay: {
			backgroundColor: this.props.config.colors.accent2,
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: this.props.config.colors.basic1,
		},
		weekendDay: {
			fontWeight: 'bold',
		},
		specialDay: {
			border: '1px solid #555',
		},
		otherMonthDay: {
			color: '#999',
		},
		weekNumber: {
			justifyContent: 'center',
			borderStyle: 'solid',
			borderColor: this.props.config.colors.accent2,
			borderRightWidth: 1,
			width: 20,
		},
		weekRetrospective: {
			color: '#999',
			border: 'none',
			borderLeft: '1 solid black',
			paddingTop: 2,
		},
		weekdayName: {
			fontWeight: 'bold',
			borderStyle: 'solid',
			borderColor: this.props.config.colors.accent2,
			borderBottomWidth: 1,
			fontSize: 6,
		},
	} );

	renderMonthName() {
		const { monthArrow, monthName, pushLeft, pushRight, header } = this.styles;
		const { date } = this.props;
		return (
			<View style={ header }>
				<Link
					src={ '#' + monthOverviewLink( date.subtract( 1, 'month' ) ) }
					style={ [ monthArrow, pushLeft ] }
				>
					«
				</Link>
				<Link src={ '#' + monthOverviewLink( date ) } style={ monthName }>
					{date.format( 'MMM' )}
				</Link>
				<Link src={ '#' + yearOverviewLink() } style={ monthName }>
					{date.format( 'YYYY' )}
				</Link>
				<Link
					src={ '#' + monthOverviewLink( date.add( 1, 'month' ) ) }
					style={ [ monthArrow, pushRight ] }
				>
					»
				</Link>
			</View>
		);
	}

	renderWeekdayNames() {
		const { t } = this.props;
		const { day, week } = this.styles;
		const weekdays = getWeekdays();
		const daysOfTheWeek = weekdays.map( ( dayOfTheWeek, index ) => (
			<Text key={ index } style={ [ day, this.styles.weekdayName ] }>
				{dayOfTheWeek.min}
			</Text>
		) );

		return (
			<View style={ week }>
				<Text
					style={ [
						day,
						this.styles.weekNumber,
						this.styles.weekdayName,
						{ paddingTop: 1 },
					] }
				>
					{t( 'calendar.header.week-number' )}
				</Text>
				{daysOfTheWeek}
				{this.props.config.isWeekRetrospectiveEnabled && (
					<Text
						style={ [
							day,
							this.styles.weekRetrospective,
							this.styles.weekdayName,
							{ paddingTop: 1 },
						] }
					>
						{t( 'calendar.header.retrospective' )}
					</Text>
				)}
			</View>
		);
	}

	renderMonth() {
		let currentWeek = this.props.date.startOf( 'month' ).startOf( 'week' );
		const endDate = this.props.date.endOf( 'month' );
		const weekRows = [];
		while ( currentWeek.isBefore( endDate ) ) {
			weekRows.push( this.renderWeek( currentWeek ) );
			currentWeek = currentWeek.add( 1, 'week' );
		}

		return <>{weekRows}</>;
	}

	renderWeek( week ) {
		const { config, t } = this.props;
		const { day } = this.styles;
		const days = [];
		const weekendDays = getWeekendDays( config.weekendDays );
		const weekNumber = getWeekNumber( week );

		for ( let i = 0; i < 7; i++ ) {
			const currentDay = week.add( i, 'days' );
			const dayStyles = [ day ];

			if (
				this.props.highlightMode === HIGHLIGHT_DAY &&
				currentDay.isSame( this.props.date, 'day' )
			) {
				dayStyles.push( this.styles.currentDay );
			}

			if (
				this.props.highlightMode === HIGHLIGHT_WEEK &&
				weekNumber === getWeekNumber( this.props.date )
			) {
				dayStyles.push( this.styles.currentWeekDay );
			}

			if ( weekendDays.includes( currentDay.day() ) ) {
				dayStyles.push( this.styles.weekendDay );
			}

			if ( currentDay.month() !== this.props.date.month() ) {
				dayStyles.push( this.styles.otherMonthDay );
			}

			const specialDateKey = currentDay.format( 'DD-MM' );
			if ( config.specialDates[ specialDateKey ] ) {
				dayStyles.push( this.styles.specialDay );
			}

			days.push(
				<Link key={ i } src={ '#' + dayPageLink( currentDay ) } style={ dayStyles }>
					{currentDay.date()}
				</Link>,
			);
		}

		const weekStyles = [ this.styles.week ];
		if (
			this.props.highlightMode === HIGHLIGHT_WEEK &&
			weekNumber === getWeekNumber( this.props.date )
		) {
			weekStyles.push( this.styles.currentWeek );
		}
		return (
			<View key={ weekNumber } style={ weekStyles }>
				<Link
					src={ '#' + weekOverviewLink( week ) }
					style={ [ day, this.styles.weekNumber ] }
				>
					{weekNumber}
				</Link>
				{days}
				{config.isWeekRetrospectiveEnabled && (
					<Link
						src={ '#' + weekRetrospectiveLink( week ) }
						style={ [ day, this.styles.weekRetrospective ] }
					>
						{t( 'calendar.body.retrospective' )}
					</Link>
				)}
			</View>
		);
	}

	render() {
		return (
			<View style={ this.styles.body }>
				{this.renderMonthName()}
				{this.renderWeekdayNames()}
				{this.renderMonth()}
			</View>
		);
	}
}

SquareCalendar.defaultProps = {
	highlightMode: HIGHLIGHT_DAY,
};

SquareCalendar.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	highlightMode: PropTypes.oneOf( [
		HIGHLIGHT_DAY,
		HIGHLIGHT_WEEK,
		HIGHLIGHT_NONE,
	] ),
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( SquareCalendar );
