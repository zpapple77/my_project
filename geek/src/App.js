import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
} from 'react-router-dom'
import Home from './pages/Layout'
import Login from './pages/Login'
import NoMatch from './pages/4o4'
function App() {
  return (
    <Router>
      <div className="App">
        {/* <NavLink to="/login">登入</NavLink>
        <NavLink to="/home">首页</NavLink> */}
      </div>
      {/* 配置路由规则 */}
      <Switch>
        <Route path={'/home'} component={Home}></Route>
        <Route path={'/login'} component={Login}></Route>
        <Route component={NoMatch}/>
      </Switch>
    </Router>
  )
}

export default App
