import { store } from 'react-notifications-component'

export function errorToast (message) {
  store.addNotification({
    title: 'Uh oh!',
    message: message || 'Some error occured',
    type: 'danger',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  })
}

export function successToast (message) {
  store.addNotification({
    title: 'Wonderful!',
    message: message || 'Success',
    type: 'success',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  })
}
