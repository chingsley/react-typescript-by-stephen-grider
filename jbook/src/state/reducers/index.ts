import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';

const reducers = combineReducers({
  cells: cellsReducer,
});

export default reducers;

/**
 * The line below is needed in order to apply some types to
 * the useSelector hook from react-redux. This is a type that
 * defines the overall structure of the "reducers" state object
 */
export type RootState = ReturnType<typeof reducers>;