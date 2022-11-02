import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../state';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
/**
 * This file is required by typescript to understand the type of data
 * in the store
 */