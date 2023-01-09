import { Canvas, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

class Grid extends React.PureComponent {
	styles = StyleSheet.create( {
		canvas: {
			width: this.props.width,
			height: this.props.height,
			position: 'absolute',
			top: this.props.startY,
			left: this.props.startX,
		},
	} );

	paintDottedGrid = ( painter ) => {
		const rowCount = Math.floor( this.props.height / this.props.dotDistance );
		const columnCount = Math.floor( this.props.width / this.props.dotDistance );

		for ( let column = 0; column < columnCount + 1; column += 1 ) {
			const x = column * this.props.dotDistance;
			for ( let row = 0; row < rowCount + 1; row += 1 ) {
				const y = row * this.props.dotDistance;
				painter.circle( x, y, this.props.dotRadius ).fill( '#C9C9C9' );
			}
		}
	}

	render() {
		return (
			<Canvas
				style={ this.styles.canvas }
				paint={ this.paintDottedGrid }
			/>
		);
	}
}

Grid.propTypes = {
	dotRadius: PropTypes.number,
	dotDistance: PropTypes.number,
	startX: PropTypes.number,
	startY: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
};

Grid.defaultProps = {
	dotRadius: 1,
	dotDistance: 18,
	startX: 19,
	startY: 14,
	width: 414,
	height: 432,
};

export default Grid;
