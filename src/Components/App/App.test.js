import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

const title = "Sean's Reddit App";
let wrapped = shallow(<App>{title}</App>);
describe('Title', () => {
  it('should render the Title Component correctly', () => {   
    expect(wrapped).toMatchSnapshot();
  });
  it('renders the Titles children', () => { 
    expect(wrapped.find('h1').text()).toEqual(title);
  });
});