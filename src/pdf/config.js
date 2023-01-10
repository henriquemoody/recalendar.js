import dayjs from 'dayjs';

import { LATO } from 'pdf/lib/fonts';

const CONFIG_FIELDS = [
	'fontFamily',
	'year',
	'month',
	'firstDayOfWeek',
	'monthCount',
	'weekendDays',
	'isLeftHanded',
	'alwaysOnSidebar',
	'isMonthOverviewEnabled',
	'habits',
	'monthItinerary',
	'isWeekOverviewEnabled',
	'todos',
	'dayItineraries',
	'isWeekRetrospectiveEnabled',
	'weekRetrospectiveItinerary',
	'specialDates',
];

export const CONFIG_FILE = 'config.json';
export const CONFIG_VERSION_1 = 'v1';
export const CONFIG_VERSION_2 = 'v2';
export const CONFIG_CURRENT_VERSION = CONFIG_VERSION_2;

export function hydrateFromObject( object ) {
	return CONFIG_FIELDS.reduce(
		( fields, field ) => ( {
			...fields,
			[ field ]: object[ field ],
		} ),
		{},
	);
}

class PdfConfig {
	constructor() {
		this.colors = {
			basic1: '#000000',
			basic2: '#FFFFFF',
			accent1: '#9D9D9D',
			accent2: '#C9C9C9',
		};
		this.year = dayjs().year();
		this.month = 0;
		this.firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
		this.weekendDays = [ 0, 6 ];
		this.isLeftHanded = false;
		this.alwaysOnSidebar = false;
		this.monthCount = 12;
		this.fontFamily = LATO;
		this.isMonthOverviewEnabled = true;
		this.habits = [];
		this.monthItinerary = [];
		this.isWeekOverviewEnabled = true;
		this.todos = [];

		let dayOfWeek = this.firstDayOfWeek;
		this.dayItineraries = [ ...Array( 7 ).keys() ].map( () => {
			const itinerary = {
				dayOfWeek,
				items: [ ],
				isEnabled: true,
			};
			dayOfWeek = ++dayOfWeek % 7;
			return itinerary;
		} );
		this.isWeekRetrospectiveEnabled = false;
		this.weekRetrospectiveItinerary = [];
		this.pageSize = [ 445, 592 ];
		this.specialDates = {};
	}
}

export default PdfConfig;
