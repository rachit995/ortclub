import React, { useState, useEffect } from 'react'
import './App.css'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import ReactNotification from 'react-notifications-component'
import grey from '@material-ui/core/colors/grey'
import Post from './components/Post'
import { db, auth } from './firebase'
import Navbar from './components/Navbar'
import 'react-notifications-component/dist/theme.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: grey[900],
    },
  },
})

function App () {
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState('home')

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc?.id,
            ...doc?.data(),
          }))
        )
      })
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setUser(authUser)
      } else {
        // user has logged out
        setUser(null)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className='app'>
      <ThemeProvider theme={theme}>
        <ReactNotification />
        <Navbar
          setUser={(parUser) => setUser(parUser)}
          user={user}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        {posts?.map(({ imageUrl, username, caption, id }) => {
          return (
            <Post
              key={id}
              imageUrl={imageUrl}
              username={username}
              caption={caption}
            />
          )
        })}
      </ThemeProvider>
    </div>
  )
}

export default App
