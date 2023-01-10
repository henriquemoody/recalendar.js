import { Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

class Header extends React.PureComponent {
	constructor( props ) {
		super( props );

		const stylesObject = {
			header: {
				fontSize: 14,
				flexGrow: 0,
				flexDirection: 'row',
				height: 55,
				backgroundColor: 'white',
				borderBottom: '1px solid #9D9D9D',
			},
			meta: {
				flexGrow: 1,
				flexDirection: 'column',
				borderRight: '1 solid black',
			},
			dateMain: {
				flexDirection: 'row',
				marginLeft: 'auto',
			},
			dateInfo: {
				flex: 1,
				flexDirection: 'row',
				paddingRight: 5,
			},
			subtitle: {
				marginLeft: 'auto',
				textAlign: 'right',
				margin: '0 5',
				flex: 1,
			},
			title: {
				textDecoration: 'none',
				justifyContent: 'center',
				textAlign: 'right',
				color: 'black',
				padding: '10 5',
				maxWidth: 165,
			},
			arrow: {
				color: '#AAA',
				textDecoration: 'none',
				justifyContent: 'center',
				padding: '10 5',
			},
			dayNumber: {
				fontSize: 18,
				fontWeight: 'bold',
				marginBottom: -5,
			},
			specialItems: {
				flexDirection: 'column',
				width: 130,
			},
			specialItem: {
				marginLeft: 5,
				fontStyle: 'italic',
			},
		};

		if ( this.props.isLeftHanded ) {
			stylesObject.header.flexDirection = 'row-reverse';

			stylesObject.meta.borderLeft = stylesObject.meta.borderRight;
			stylesObject.meta.borderRight = 'none';

			delete stylesObject.dateMain.marginLeft;
			delete stylesObject.subtitle.marginLeft;

			stylesObject.dateInfo.flexDirection = 'row-reverse';
			stylesObject.subtitle.textAlign = 'left';
		}

		this.styles = StyleSheet.create( stylesObject );
	}

	renderSpecialItems() {
		if ( ! this.props.specialItems ) {
			return null;
		}

		return (
			<View style={ this.styles.specialItems }>
				{this.props.specialItems.map( ( text, index ) => (
					<Text key={ index } style={ this.styles.specialItem }>
						» {text}
					</Text>
				) )}
			</View>
		);
	}

	render() {
		const {
			id,
			nextLink,
			number,
			previousLink,
			subtitle,
			title,
			titleLink,
		} = this.props;

		return (
			<View id={ id } style={ this.styles.header }>
				<View style={ this.styles.meta }>
					<View style={ this.styles.dateMain }>
						<Link src={ titleLink } style={ this.styles.title }>
							{title}
						</Link>
						<Link src={ previousLink } style={ this.styles.arrow }>
							«
						</Link>
						<Text style={ this.styles.dayNumber }>{number}</Text>
						<Link src={ nextLink } style={ this.styles.arrow }>
							»
						</Link>
					</View>
					<View style={ this.styles.dateInfo }>
						{this.renderSpecialItems()}
						<Text style={ this.styles.subtitle }>{subtitle}</Text>
					</View>
				</View>
			</View>
		);
	}
}

Header.defaultProps = {
	titleSize: 15,
	subtitleSize: 15,
};

Header.propTypes = {
	id: PropTypes.string,
	children: PropTypes.node,
	isLeftHanded: PropTypes.bool.isRequired,
	number: PropTypes.string.isRequired,
	specialItems: PropTypes.array,
	subtitle: PropTypes.string.isRequired,
	subtitleSize: PropTypes.number,
	title: PropTypes.string.isRequired,
	titleLink: PropTypes.string,
	titleSize: PropTypes.number,
	previousLink: PropTypes.string.isRequired,
	nextLink: PropTypes.string.isRequired,
};

export default Header;
