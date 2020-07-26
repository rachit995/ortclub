import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Box,
  ButtonGroup,
  Avatar,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import './Navbar.css'
import {
  FiLogIn,
  FiCamera,
  FiMoreVertical,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiUser,
  FiPlusSquare,
} from 'react-icons/fi'
import Home from '@material-ui/icons/Home'
import HomeOutlined from '@material-ui/icons/HomeOutlined'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import { auth } from '../firebase'
import logo from '../assets/images/logo.png'
import SignIn from './SignIn'
import ImageUpload from './ImageUpload'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },

  leftAction: {
    flexDirection: 'row',
  },
  rightAction: {
    justifyContent: 'flex-end',
  },
  navBrand: {
    width: '100%',
    textAlign: 'center',
  },
  actionIcon: {
    fontSize: '1.65rem',
  },
  actionButton: {
    minWidth: 'auto',
  },
  iconInButton: {
    marginRight: '10px',
  },
  bottomRoot: {
    flexGrow: 1,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    height: '44px',
    borderTop: '1px solid rgba(219,219,219,1)',
    borderRadius: 0,
    zIndex: 9,
  },
  icons: {
    fontSize: '1.65rem',
  },
  buttons: {
    width: '100%',
    border: 'none',
  },
  avatar: {
    height: '30px',
    width: '30px',
  },
}))

function Navbar ({ user, currentView, setCurrentView }) {
  const classes = useStyles()
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openImageUpload, setOpenImageUpload] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <SignIn open={openSignIn} onClose={() => setOpenSignIn(false)} />
      <AppBar
        position='sticky'
        color='inherit'
        className='navBar__appBar'
        elevation={0}
      >
        <Toolbar>
          <div className={classes.leftAction}>
            <Button
              aria-controls='simple-menu'
              aria-haspopup='true'
              className={classes.actionButton}
            >
              <FiCamera className={classes.actionIcon} />
            </Button>
          </div>
          <div className={classes.navBrand}>
            <img src={logo} alt='' className='app__headerImage' />
          </div>
          <div className={classes.rightAction}>
            {user ? (
              <>
                <Button
                  aria-controls='simple-menu'
                  aria-haspopup='true'
                  onClick={handleClick}
                  className={classes.actionButton}
                >
                  <FiMoreVertical className={classes.actionIcon} />
                </Button>
                <Menu
                  id='simple-menu'
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <FiSettings className={classes.iconInButton} />
                    Settings
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      auth.signOut()
                      handleClose()
                    }}
                  >
                    <Box color='error.main'>
                      <FiLogOut className={classes.iconInButton} />
                      Logout
                    </Box>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                aria-controls='simple-menu'
                aria-haspopup='true'
                onClick={() => setOpenSignIn(true)}
                className={classes.actionButton}
              >
                <FiLogIn className={classes.actionIcon} />
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <ButtonGroup className={classes.bottomRoot}>
        <Button
          className={classes.buttons}
          onClick={() => setCurrentView('home')}
        >
          {currentView === 'home' ? (
            <Home className={classes.icons} />
          ) : (
            <HomeOutlined className={classes.icons} />
          )}
        </Button>
        <Button
          className={classes.buttons}
          onClick={() => setCurrentView('explore')}
        >
          <FiSearch className={classes.icons} />
        </Button>
        <Button className={classes.buttons}>
          {user ? (
            <ImageUpload
              open={openImageUpload}
              onClose={() => setOpenImageUpload(false)}
              user={user}
            />
          ) : (
            <FiPlusSquare className={classes.icons} />
          )}
        </Button>
        <Button
          className={classes.buttons}
          onClick={() => setCurrentView('activity')}
        >
          {currentView === 'activity' ? (
            <Favorite className={classes.icons} />
          ) : (
            <FavoriteBorder className={classes.icons} />
          )}
        </Button>
        {user ? (
          <Button className={classes.buttons}>
            <Avatar
              alt={user?.displayName.toUpperCase()}
              src='static'
              className={classes.avatar}
            />
          </Button>
        ) : (
          <Button
            className={classes.buttons}
            onClick={() => setOpenSignIn(true)}
          >
            <FiUser className={classes.icons} />
          </Button>
        )}
      </ButtonGroup>
    </>
  )
}

Navbar.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
  }),
  currentView: PropTypes.string,
  setCurrentView: PropTypes.func,
}

Navbar.defaultProps = {
  user: {
    displayName: '',
  },
  currentView: 'home',
  setCurrentView: () => {},
}

export default Navbar
