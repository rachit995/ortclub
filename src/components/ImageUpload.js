import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  TextField,
  Fade,
  Modal,
  Grid,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import { useForm } from 'react-hook-form'
import firebase from 'firebase'
import { BrowserView, MobileView } from 'react-device-detect'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import { FiPlusSquare } from 'react-icons/fi'
import { errorToast } from '../libs/helper'
import { storage, db } from '../firebase'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icons: {
    fontSize: '1.65rem',
  },
  input: {
    display: 'none',
  },
  addPostIcon: {
    lineHeight: 'normal',
  },
  previewImage: {
    width: '100%',
    borderRadius: '4px',
    border: '1px solid rgba(219,219,219,1)',
  },
  captionTextField: {
    width: '100%',
  },
}))

function ImageUpload ({ user }) {
  const { register, handleSubmit, errors, reset } = useForm()
  const classes = useStyles()
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const onClose = () => {
    reset()
    setOpen(false)
  }
  function handleClose () {
    setProgress(0)
    setImage(null)
    setIsLoading(false)
    onClose()
  }

  const handleUpload = (data) => {
    setIsLoading(true)
    const caption = data?.caption
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const tempProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(tempProgress)
      },
      (error) => {
        setIsLoading(false)
        errorToast(error.message)
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption,
              username: user?.displayName,
              imageUrl: url,
            })
            handleClose()
          })
      }
    )
  }
  const [imagePreviewUrl, setImagePreviewUrl] = useState()

  const innerContent = () => {
    return (
      <div className={classes.paper}>
        <h3>Add Post</h3>
        <br />
        <form
          className='app__signup'
          onSubmit={handleSubmit(handleUpload)}
          noValidate
        >
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <img
                src={imagePreviewUrl}
                className={classes.previewImage}
                alt='previewImage'
              />
            </Grid>
            <Grid item xs={9}>
              <TextField
                label='Caption'
                multiline
                name='caption'
                type='caption'
                id='caption'
                rows={5}
                inputRef={register({ required: 'Please enter your caption' })}
                className={classes.captionTextField}
                variant='outlined'
                helperText={errors?.caption?.message}
                error={Boolean(errors?.caption)}
              />
            </Grid>
          </Grid>
          <br />
          <Button variant='outlined' type='submit'>
            {isLoading && (
              <CircularProgress size={24} variant='static' value={progress} />
            )}
            {!isLoading && 'Upload'}
          </Button>
          {/* <progress value={progress} max='100' /> */}
        </form>
      </div>
    )
  }
  const desktopView = () => (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>{innerContent()}</Fade>
    </Modal>
  )

  const mobileView = () => (
    <SwipeableDrawer anchor='bottom' open={open} onClose={onClose}>
      {innerContent()}
    </SwipeableDrawer>
  )

  function handleImageChange (e) {
    e.preventDefault()
    const reader = new FileReader()
    const file = e.target.files[0]
    if (file) {
      reader.onloadend = () => {
        setImage(file)
        setImagePreviewUrl(reader?.result)
        setOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <input
        accept='image/*'
        className={classes.input}
        id='contained-button-file'
        multiple
        type='file'
        onChange={handleImageChange}
      />
      <label htmlFor='contained-button-file' className={classes.addPostIcon}>
        <FiPlusSquare className={classes.icons} />
      </label>
      <BrowserView>{desktopView()}</BrowserView>
      <MobileView>{mobileView()}</MobileView>
    </>
  )
}

ImageUpload.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
  }),
}

ImageUpload.defaultProps = {
  user: {
    displayName: '',
  },
}

export default ImageUpload
