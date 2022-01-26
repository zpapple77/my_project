import React, { Component } from 'react'
import { Card } from 'antd'
import './index.css'
import logo from '../../assets/logo.png'
export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <Card className="login-container">
          {/* 正常情况下 使用<img src="" alt="" />导入图片，
          但是src=""是字符串不能被webpack处理，这个图片地址必须是一个动态的*/}
          <img className="login-logo" src={logo} alt="" />
        </Card>
      </div>
    )
  }
}
