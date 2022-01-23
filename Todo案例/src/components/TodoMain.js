import classNames from 'classnames'
import React, { Component } from 'react'

export default class TodoMain extends Component {
  state = {
    // 当前双击的id
    currentId: '',
    // 当前双击的名字
    currentName: '',
  }
  render() {
    const { list, type } = this.props
    let showList = []
    if (type === 'active') {
      showList = list.filter((item) => !item.done)
    } else if (type === 'completed') {
      showList = list.filter((item) => item.done)
    } else {
      showList = list
    }
    return (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={list.every((item) => item.done)}
          onChange={this.handleChange}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {showList.map((item) => {
            return (
              <li
                className={classNames({
                  completed: item.done,
                  editing: item.id === this.state.currentId,
                })}
                key={item.id}
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={item.done}
                    onChange={() => this.updateDone(item.id)}
                  />
                  <label onDoubleClick={() => this.showEdit(item)}>
                    {item.name}
                  </label>
                  <button
                    className="destroy"
                    onClick={() => this.delTodo(item.id)}
                  ></button>
                </div>
                <input
                  className="edit"
                  value={this.state.currentName}
                  onChange={(e) => {
                    this.setState({ currentName: e.target.value })
                  }}
                  onKeyUp={this.handleKeyUp}
                />
              </li>
            )
          })}
        </ul>
      </section>
    )
  }
  //删除任务
  delTodo = (id) => {
    console.log('id', id)
    this.props.delTodoById(id)
  }
  //修改任务状态
  updateDone = (id) => {
    this.props.updateDoneById(id)
  }
  showEdit = ({ id, name }) => {
    this.setState({
      currentId: id,
      currentName: name,
    })
  }
  handleKeyUp = (e) => {
    if (e.keyCode === 27) {
      //按了ESC,取消修改
      this.setState({
        currentId: '',
        currentName: '',
      })
    }
    if (e.keyCode === 13) {
      //添加
      this.props.editTodo(this.state.currentId, this.state.currentName)
      //关闭
      this.setState({
        currentId: '',
        currentName: '',
      })
    }
  }
  handleChange = (e) => {
    this.props.checkAll(e.target.checked)
  }
}
