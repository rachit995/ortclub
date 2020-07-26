import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles((theme) => ({
  post: {
    background: '#fff',
    maxWidth: '600px',
  },
  postImage: {
    width: '100%',
    objectFit: 'contain',
    borderTop: '1px solid rgba(239, 239, 239, 1)',
    borderBottom: '1px solid rgba(239, 239, 239, 1)',
  },
  postCaption: {
    fontWeight: 'normal',
    padding: '20px',
    fontSize: '14px',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  postHeaderAvatar: {
    marginRight: theme.spacing(2),
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
  postHeaderUsername: {
    fontSize: '14px',
  },
  leftAction: {
    flexDirection: 'row',
  },
}))

function Post ({ imageUrl, username, caption, avatar }) {
  const classes = useStyles()
  return (
    <div className={classes.post}>
      <div className={classes.postHeader}>
        <Avatar
          className={classes.postHeaderAvatar}
          alt={username}
          src='avatar'
        />
        <h3 className={classes.postHeaderUsername}>{username}</h3>
      </div>
      <img className={classes.postImage} src={imageUrl} alt='' />
      <h4 className={classes.postCaption}>
        <strong>{username} </strong>
        {caption}
      </h4>
    </div>
  )
}

Post.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  caption: PropTypes.string,
  avatar: PropTypes.string,
}

Post.defaultProps = {
  caption: '',
  avatar: '',
}

export default Post
