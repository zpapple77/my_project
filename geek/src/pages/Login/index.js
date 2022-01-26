import React, { Component } from 'react'
import { Button, DatePicker } from 'antd'
export default class Login extends Component {
  render() {
    return (
      <div>
        登入组件
        <Button type="primary">登入</Button><br />
        <DatePicker />
      </div>
    )
  }
}
