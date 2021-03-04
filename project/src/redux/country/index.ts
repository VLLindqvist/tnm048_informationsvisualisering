import { LeafletMouseEvent } from "leaflet";
import { Dispatch } from "redux";

export const countryActions = {
  SET_COUNTRY: "setCountry",
  // UNSET_COUNTRY: "unsetCountry",
};

export type oneCountryRedux = {
  name: string;
  event?: LeafletMouseEvent;
};

export type countryRedux = {
  current: oneCountryRedux;
  old: oneCountryRedux;
};

const initialState: countryRedux = {
  current: { name: "", event: undefined },
  old: { name: "", event: undefined },
};

export const setCountry = (newState: oneCountryRedux) => (
  dispatch: Dispatch,
) => {
  return dispatch({
    type: countryActions.SET_COUNTRY,
    payload: newState,
  });
};

// export const unsetCountry = () => (dispatch: Dispatch) => {
//   return dispatch({
//     type: countryActions.UNSET_COUNTRY,
//   });
// };

const reducer = (state: countryRedux = initialState, action: any) => {
  switch (action.type) {
    case countryActions.SET_COUNTRY:
      return action.payload.name !== state.current.name
        ? {
            current: action.payload,
            old: state.current,
          }
        : {
            current: initialState.current,
            old: action.payload,
          };
    // case countryActions.UNSET_COUNTRY:
    //   return "";
    default:
      return state;
  }
};

export default reducer;
