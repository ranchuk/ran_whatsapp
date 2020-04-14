import {SET_SEARCH_CONTACT, LOADING_SEARCH_CONTACT} from './types'

const searchContact = (username) => (dispatch) => {
    dispatch(searchContactLoading(true))
    //TO DO : Axios post request
    let data = []

    dispatch({
        type:SET_SEARCH_CONTACT,
        payload: data
    })

    dispatch(searchContactLoading(false))
}

const searchContactLoading = (isLoading) => {
    return {
        type: LOADING_SEARCH_CONTACT
    }

}