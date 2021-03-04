import { useState, Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/layouts/Navbar'
import Users from './components/users/Users'
import User from './components/users/User'
import Search from './components/users/Search'
import Alert from './components/layouts/Alert'
import About from './components/pages/About'
import axios from 'axios'
import GithubState from './context/github/GithubState'
import './App.css'


//Acess permision for github API
const github = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 1000,
  headers: { Authorization: process.env.REACT_APP_GITHUB_TOKEN }
})
 
const App = () => {

  const [users, setUsers ] = useState ([])
  const [ user, setUser ] = useState ({})
  const [ repos, setRepos ] = useState ([])
  const [ loading, setLoading ] = useState (false)
  const [ alert, setAlert ] = useState (null)
 
 
  // static propTypes = {
  //   searchUsers: PropTypes.func.isRequired,
  //   clearchUsers: PropTypes.func.isRequired,
  //   showClear: PropTypes.bool.isRequired,

  // }

 //Search functinality API call
  const searchUsers = async text => {
    setLoading(true )
    const res = await github.get(`/search/users?q=${text}`)

    setUsers(res.data.items)
    setLoading(false)
    }

  //Get single Github user
  const getUser = async username => {
    setLoading(true )

    const res = await github.get(`/users/${username}`)
    
    setUser(res.data)
    setLoading(false)
  }

  //Get users repos
  const getUserRepos = async username => {
    setLoading(true )

    const res = await github.get(`/users/${username}/repos?per_page=5&sort=created:asc`)
    
    setRepos(res.data)
    setLoading(false )
  }

  //Clear Users from state
  const clearUsers = () => {
    setUsers([])
    setLoading(false )
  }

  //Set Alert to enter valid text
  const showAlert = (msg, type) => {
    setAlert({ msg, type })
    setTimeout(() => setAlert(null), 3000)
  }

    return (
      <GithubState>
      <Router>
      <div className="App">
        <Navbar/>
        <div className="container">
          <Alert alert={alert} />
          <Switch>
            <Route 
            exact
            path='/'
            render={props => (
              <Fragment>
                <Search 
                searchUsers={searchUsers}
                clearUsers={clearUsers}
                showClear={users.length > 0 ? true : false}
                setAlert ={showAlert}
                />
                <Users loading={loading} users={users}/>
              </Fragment>
            )}
            />
            <Route exact path='/about' component={About} />
            <Route 
              exact 
              path='/user/:login' 
              render={props => (
                <User 
                { ...props } 
                getUser={getUser} 
                getUserRepos={getUserRepos}
                user={user} 
                repos={repos}
                loading={loading} 
                />
            )} />
          </Switch>
            
        </div>
      </div>
      </Router>
      </GithubState>
    );
}
export default App;