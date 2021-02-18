import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

//Setup
let app = shallow(<App />);

//Test
describe('APP component as a whole', () => {
  it('render the App Component correctly', () => {   
    expect(app)
    .toMatchSnapshot();
  });
});
