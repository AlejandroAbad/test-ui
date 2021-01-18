import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function CircularProgressWithLabel(props) {
	
	return (<Box display="flex" alignItems="center">
		<Box position="relative" display="inline-flex"  >
			<CircularProgress  {...props} />
			{(props.value > 0 && props.value < 100) &&
				<Box
					top={0}
					left={0}
					bottom={0}
					right={0}
					position="absolute"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Typography variant="caption" component="div" color="textSecondary">
						{`${Math.round(props.value,)}%`}
					</Typography>
				</Box>
			}
		</Box>
		<Box position="relative" display="inline-flex" ml={1} >
			<Typography variant="caption" component="div" color="textSecondary">
				{props.text}
			</Typography>
		</Box>
	</Box>
	);
}

CircularProgressWithLabel.propTypes = {
	/**
	 * The value of the progress indicator for the determinate variant.
	 * Value between 0 and 100.
	 */
	value: PropTypes.number.isRequired,
};