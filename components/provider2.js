import React, { Component } from 'react';

// first we will make a new context
const MyContext = React.createContext();

export const MyContext;

// Then create a provider Component
export default class MyProvider extends Component {
  state = {
    name: 'heyyy',
    age: 1
  }
  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        growAYearOlder: () => this.setState({
          age: this.state.age + 1
        })
      }}>
        {this.props.children}
      </MyContext.Provider>
    )
  }
}