import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';
import { Navbar } from '../Navbar/Navbar';
import { Main } from '../Main/Main';

//Setup
let wrapper = shallow(<App />);

//Test
describe('APP component as a whole', () => {
  it('renders the App Component correctly', () => {   
    expect(wrapper)
    .toMatchSnapshot();
  });
  it('checks that the Navbar section exists', () => {
    const navbar = wrapper.find(Navbar);
    expect(navbar.exists())
    .toBe(true);
  });
  it('checks that the Main section exists', () => {
    const main = wrapper.find(Main);
    expect(main.exists())
    .toBe(true);
  });
});
