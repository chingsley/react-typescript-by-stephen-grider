import produce from 'immer';
import { Cell } from './../cell';
import { ActionType } from "../action-types";
import { Action } from "../actions";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {}
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;

    // this is what you would do without 'immer'
    // return {
    //   ...state,
    //   data: {
    //     ...state.data,
    //     [id]: {
    //       ...state.data[id],
    //       content: content,
    //     }
    //   }
    // };
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter(id => id !== action.payload);
      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex(id => id === action.payload.id);

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex > state.order.length - 1) return state;

      // [state.order[index], state.order[targetIndex]] = [state.order[targetIndex], state.order[index]];
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId()
      };

      state.data[cell.id] = cell;

      const idx = state.order.findIndex(id => id === action.payload.id);

      if (idx < 0) {
        state.order.push(cell.id);
      } else {
        state.order.splice(idx, 0, cell.id); // see 'immer' docs at https://immerjs.github.io/immer/update-patterns for inserting into array at given position
      }
      return state;
    default:
      return state;
  }
}, initialState);

const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;