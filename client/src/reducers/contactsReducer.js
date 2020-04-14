import {SET_SEARCH_CONTACT, LOADING_SEARCH_CONTACT} from './types'

  
  const initialState = {
    data: null,
    loading: false,
    errors: []
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SEARCH_CONTACT:
                return {
                    ...state,
                    data: action.payload,
                };
        case LOADING_SEARCH_CONTACT:
                return {
                    ...state,
                    loading: action.payload
                };
        // case ERROR_AUTO_COMPLETE:
        //         return {
        //             ...state,
        //             errors: [...state.errors, action.payload]
        //         };
        default:
                return state;
    }
  }