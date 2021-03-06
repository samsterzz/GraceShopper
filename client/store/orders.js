import axios from 'axios'

/**
* ACTION TYPES
*/
const GET_ORDERS = 'GET_ORDERS'

/**
* INITIAL STATE
*/
const defaultState = []

/**
* ACTION CREATORS
*/
const getOrders = orders => ({type: GET_ORDERS, orders})

/**
* THUNK CREATORS
*/
export const getOrdersThunk = userId => 
  dispatch => {
    axios.get(`/api/users/${userId}/orders`)   
      .then(res => {
        dispatch(getOrders(res.data))
      }) 
      .catch(error => 
        dispatch(getOrders({error})))
  }  

/**
* REDUCER
*/

export default function (state = defaultState, action) {
  switch (action.type) {
    case GET_ORDERS:
      return action.orders
    default:
      return state
  }
}