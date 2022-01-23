import React, { Component } from 'react'

export default class TodoFooter extends Component {
  render() {
    const { list, type } = this.props
    if (list.length === 0) {
      return null
    }
    const leftCount = list.filter((item) => !item.done).length
    const isShow = list.some((item) => item.done)
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{leftCount}</strong> item left
        </span>
        <ul className="filters">
          <li>
            <a
              className={type === 'all' ? 'selected' : ''}
              onClick={() => this.handleClick('all')}
              href="#/"
            >
              All
            </a>
          </li>
          <li>
            <a
              className={type === 'active' ? 'selected' : ''}
              onClick={() => this.handleClick('active')}
              href="#/active"
            >
              Active
            </a>
          </li>
          <li>
            <a
              className={type === 'completed' ? 'selected' : ''}
              onClick={() => this.handleClick('completed')}
              href="#/completed"
            >
              Completed
            </a>
          </li>
        </ul>
        {isShow && (
          <button className="clear-completed" onClick={this.clearTodo}>
            Clear completed
          </button>
        )}
      </footer>
    )
  }
  clearTodo = () => {
    this.props.clearTodo()
  }
  handleClick = (type) => {
    this.props.changeType(type)
  }
}
