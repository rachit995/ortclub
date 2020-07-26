import React, { useState } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import {
  Modal,
  TextField,
  Button,
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { errorToast } from '../libs/helper'
import { auth } from '../firebase'
import logo from '../assets/images/logo.png'

function TabPanel (props) {
  const { children, value, index } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {value === index && (
        <Box px={3} pt={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: '4px',
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  closeIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[700],
  },
}))

function SignIn ({ open, onClose }) {
  const { register, handleSubmit, errors, reset } = useForm()
  const classes = useStyles()
  function handleClose () {
    reset()
    onClose()
  }
  const theme = useTheme()

  const [isLoading, setIsLoading] = useState(false)
  const signIn = (data) => {
    setIsLoading(true)
    const { email, password } = data
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        handleClose()
        setIsLoading(false)
      })
      .catch((error) => {
        errorToast(error.message)
        setIsLoading(false)
      })
  }
  const [value, setValue] = useState(0)

  const handleChange = (e, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    // setValue(index)
  }

  const signUp = (data) => {
    setIsLoading(true)
    const { email, password, username } = data
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        handleClose()
        setIsLoading(false)
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => {
        errorToast(error.message)
        setIsLoading(false)
      })
  }

  const innerContent = () => (
    <>
      <CloseOutlinedIcon className={classes.closeIcon} onClick={onClose} />
      <div className={classes.paper}>
        <center>
          <img src={logo} alt='' className='app__headerImage' />
        </center>
        <AppBar position='static' color='inherit' elevation={0}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label='simple tabs example'
            variant='fullWidth'
          >
            <Tab
              label='Login'
              id='full-width-tab-0'
              aria-controls='full-width-tabpanel-0'
            />
            <Tab
              label='Sign Up'
              id='full-width-tab-1'
              aria-controls='full-width-tabpanel-1'
            />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <form
              className='app__signup'
              onSubmit={handleSubmit(signIn)}
              noValidate
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                inputRef={register({
                  required: 'Please enter your email address',
                })}
                helperText={errors?.email?.message}
                error={Boolean(errors?.email)}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                inputRef={register({ required: 'Please enter your password' })}
                helperText={errors?.password?.message}
                error={Boolean(errors?.password)}
              />
              <Button
                type='submit'
                color='primary'
                style={{
                  marginTop: '20px',
                }}
                disabled={isLoading}
              >
                {isLoading && <CircularProgress size={24} />}
                {!isLoading && 'Sign In'}
              </Button>
            </form>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <form
              className='app__signup'
              onSubmit={handleSubmit(signUp)}
              noValidate
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                inputRef={register({
                  required: 'Please enter your email address',
                })}
                helperText={errors?.email?.message}
                error={Boolean(errors?.email)}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                id='username'
                label='Username'
                name='username'
                autoComplete='username'
                inputRef={register({ required: 'Please enter your username' })}
                helperText={errors?.username?.message}
                error={Boolean(errors?.username)}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                inputRef={register({ required: 'Please enter your password' })}
                helperText={errors?.password?.message}
                error={Boolean(errors?.password)}
              />
              <Button
                type='submit'
                color='primary'
                style={{
                  marginTop: '20px',
                }}
              >
                Sign Up
              </Button>
            </form>
          </TabPanel>
        </SwipeableViews>
      </div>
    </>
  )

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
  return (
    <>
      <BrowserView>{desktopView()}</BrowserView>
      <MobileView>{mobileView()}</MobileView>
    </>
  )
}

SignIn.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default SignIn
