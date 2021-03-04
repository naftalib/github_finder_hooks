import React from 'react'
import PropTypes from 'prop-types'
import RepoItem from './RepoItem'

const Repos = ({ repos }) => {
    return repos.map(repo => <RepoItem repo={repo} key={repo.id} />)
   
}
Repos.propsTypes = {
    repos: PropTypes.array.isRequired,
}

export default Repos