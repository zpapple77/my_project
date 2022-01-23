import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './styles/base.css'
import './styles/index.css'

//导入组件
import TodoHeader from './components/TodoHeader'
import TodoMain from './components/TodoMain'
import TodoFooter from './components/TodoFooter'

class App extends Component {
  state = {
    list: [
      { id: 1, name: '吃饭', done: false },
      { id: 2, name: '睡觉', done: true },
      { id: 3, name: '学习', done: true },
    ],
    type: '',
  }
  render() {
    const { list, type } = this.state

    return (
      <section className="todoapp">
        <TodoHeader addTodo={this.addTodo}></TodoHeader>
        <TodoMain
          list={list}
          delTodoById={this.delTodoById}
          updateDoneById={this.updateDoneById}
          editTodo={this.editTodo}
          type={type}
          checkAll = {this.checkAll}
        ></TodoMain>
        <TodoFooter
          list={list}
          clearTodo={this.clearTodo}
          type={type}
          changeType={this.changeType}
        ></TodoFooter>
      </section>
    )
  }
  delTodoById = (id) => {
    this.setState({
      list: this.state.list.filter((item) => item.id !== id),
    })
  }
  updateDoneById = (id) => {
    //需要根据id吧对应任务的状态取反
    this.setState({
      list: this.state.list.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            done: !item.done,
          }
        } else {
          return item
        }
      }),
    })
  }
  addTodo = (name) => {
    this.setState({
      list: [
        {
          id: Date.now(),
          name,
          done: false,
        },
        ...this.state.list,
      ],
    })
  }
  editTodo = (id, name) => {
    this.setState({
      list: this.state.list.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name,
          }
        } else {
          return item
        }
      }),
    })
  }
  clearTodo = () => {
    this.setState({
      list: this.state.list.filter((item) => !item.done),
    })
  }
  changeType = (type) => {
    console.log(type)
    this.setState({ type })
  }
  checkAll = (check) => {
    this.setState({
      list:this.state.list.map(item=>{
        return {
          ...item,
          done:check
        }
      })
    })
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
